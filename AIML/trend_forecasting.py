# prophet_surat_all_eval.py
# Forecasting multiple complaint columns for Surat dataset with evaluation
# Handles flexible date formats automatically

import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt
import numpy as np
import os
from sklearn.metrics import mean_absolute_error, mean_squared_error
from prophet.serialize import model_to_json
import json

df = pd.read_csv("surat.csv")

# Flexible date parsing (handles both "25/06/2017" and "25-06-2017")
df['Date'] = pd.to_datetime(df['Date'], dayfirst=True, errors='coerce')

# Drop rows where date parsing failed
df = df.dropna(subset=['Date'])

# Define the columns we want to forecast
targets = {
    "No_of_complain_received": "Complaints Received",
    "No_of_complain_disposed": "Complaints Disposed",
    "No_of_complain_pending":  "Complaints Pending"
}

os.makedirs("forecast_plots", exist_ok=True)

test_size_days = 90  

results = []  

for col, title in targets.items():
    print(f"\n=== Forecasting {title} ===")
    
    df_prophet = df[['Date', col]].rename(columns={'Date': 'ds', col: 'y'})
    df_prophet = df_prophet.sort_values('ds').reset_index(drop=True)

    last_date = df_prophet['ds'].max()
    cutoff_date = last_date - pd.Timedelta(days=test_size_days)
    train = df_prophet[df_prophet['ds'] <= cutoff_date].copy()
    test  = df_prophet[df_prophet['ds'] >  cutoff_date].copy()

    print(f"Train size: {len(train)}, Test size: {len(test)}")

    m = Prophet(yearly_seasonality=True, weekly_seasonality=True, daily_seasonality=False)
    m.fit(train)

    model_filename = f"prophet_{col}.json"
    with open(model_filename, "w") as f:
        f.write(model_to_json(m))
    print(f"✅ Saved model for {title} → {model_filename}")

    future = m.make_future_dataframe(periods=len(test), freq='D', include_history=False)
    forecast = m.predict(future)

    pred = forecast[['ds', 'yhat']].set_index('ds').join(test.set_index('ds'))
    pred = pred.reset_index().rename(columns={'yhat': 'y_pred', 'y': 'y_true'})

    mae = mean_absolute_error(pred['y_true'], pred['y_pred'])
    rmse = np.sqrt(mean_squared_error(pred['y_true'], pred['y_pred']))
    mape = np.mean(np.abs((pred['y_true'] - pred['y_pred']) / (pred['y_true'] + 1e-9))) * 100

    results.append([title, round(mae,2), round(rmse,2), round(mape,2)])
    print(f"MAE: {mae:.2f}, RMSE: {rmse:.2f}, MAPE: {mape:.2f}%")

    future_full = m.make_future_dataframe(periods=365, freq='D', include_history=True)
    forecast_full = m.predict(future_full)

    forecast_file = f"forecast_{col}.csv"
    forecast_full.to_csv(forecast_file, index=False)
    print(f"Saved full forecast to {forecast_file}")

    # Plot test vs predictions
    # plt.figure(figsize=(12,6))
    # plt.plot(train['ds'], train['y'], label="Train")
    # plt.plot(test['ds'], test['y'], label="Test")
    # plt.plot(pred['ds'], pred['y_pred'], label="Predicted")
    # plt.fill_between(pred['ds'], forecast['yhat_lower'], forecast['yhat_upper'], alpha=0.2, label="Uncertainty")
    # plt.title(f"Prophet Forecast & Evaluation: {title}")
    # plt.xlabel("Date")
    # plt.ylabel(title)
    # plt.legend()
    # plt.tight_layout()
    # plt.savefig(f"forecast_plots/{col}_evaluation.png")
    # plt.close()

    # Plot trend + seasonality
    # fig2 = m.plot_components(forecast_full)
    # plt.savefig(f"forecast_plots/{col}_components.png")
    # plt.close()

#Show summary table

results_df = pd.DataFrame(results, columns=["Complaint Type", "MAE", "RMSE", "MAPE (%)"])
print("\n📊 Evaluation Summary:\n")
print(results_df.to_string(index=False))

results_df.to_csv("evaluation_summary.csv", index=False)
print("\n✅ Forecasting + Evaluation complete! Check 'forecast_plots/' folder, forecast CSVs, model JSONs, and 'evaluation_summary.csv'")
