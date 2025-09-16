import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import OneHotEncoder, MaxAbsScaler
import scipy.sparse as sp
import pickle
import sklearn
import numpy as np
from imblearn.over_sampling import SMOTE

df = pd.read_csv("jharkhand_priority_dataset_noisy_5000.csv")

X_issue = df["issue_type"]
X_desc = df["complaint_text"]
X_numeric = df[["attachments"]]
y = df["priority_label"]

if sklearn.__version__ >= "1.2":
    encoder = OneHotEncoder(sparse_output=True, handle_unknown="ignore")
else:
    encoder = OneHotEncoder(sparse=True, handle_unknown="ignore")

X_issue_encoded = encoder.fit_transform(X_issue.values.reshape(-1, 1))

# TF-IDF for complaint description (more n-grams, higher weight)
vectorizer = TfidfVectorizer(max_features=15000, ngram_range=(1,4), min_df=2)
X_desc_tfidf = vectorizer.fit_transform(X_desc)
X_desc_tfidf = X_desc_tfidf * 3  

# Scale numeric features down (attachments only)
scaler = MaxAbsScaler()
X_numeric_sparse = sp.csr_matrix(scaler.fit_transform(X_numeric.values) * 0.2)

X = sp.hstack((X_issue_encoded, X_desc_tfidf, X_numeric_sparse))

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# -----------------------------
# Apply SMOTE to handle class imbalance
smote = SMOTE(random_state=42)
X_train_res, y_train_res = smote.fit_resample(X_train, y_train)

param_grid = {
    "n_estimators": [300, 500],
    "max_depth": [25, 35, None],
    "max_features": ["sqrt", "log2", None]
}

grid = GridSearchCV(
    RandomForestClassifier(class_weight="balanced", random_state=42, n_jobs=-1),
    param_grid,
    cv=3,
    scoring="f1_macro",
    n_jobs=-1,
    verbose=2
)

grid.fit(X_train_res, y_train_res)
best_model = grid.best_estimator_

y_pred = best_model.predict(X_test)
# print("Accuracy:", accuracy_score(y_test, y_pred))
# print("\nClassification Report:\n", classification_report(y_test, y_pred))

# Save model and encoders
with open("priority_model.pkl", "wb") as f:
    pickle.dump(best_model, f)
with open("tfidf_vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)
with open("issue_encoder.pkl", "wb") as f:
    pickle.dump(encoder, f)

print("Model, vectorizer, and encoder saved successfully!")

# Feature Importance
# importances = best_model.feature_importances_

# issue_len = X_issue_encoded.shape[1]
# desc_len = X_desc_tfidf.shape[1]
# numeric_len = X_numeric_sparse.shape[1]

# issue_importance = np.sum(importances[:issue_len])
# desc_importance = np.sum(importances[issue_len:issue_len + desc_len])
# numeric_importance = np.sum(importances[-numeric_len:])

# print("\nFeature Effect on Priority Prediction:")
# print(f"Issue Type: {issue_importance:.4f}")
# print(f"Complaint Text: {desc_importance:.4f}")
# print(f"Numeric Features (Attachments): {numeric_importance:.4f}")

# Prediction function
def predict_priority(issue_type, description, attachments):
    issue_encoded = encoder.transform([[issue_type]])
    desc_tfidf = vectorizer.transform([description])
    numeric_sparse = sp.csr_matrix([[attachments]])  # Only attachments used
    X_input = sp.hstack((issue_encoded, desc_tfidf, numeric_sparse))
    return best_model.predict(X_input)[0]

# Example 
while True:
    issue_inp = input("Enter Issue Type (or 'exit' to quit): ")
    if issue_inp.lower() == 'exit':
        break
    desc_inp = input("Enter Complaint Description: ")
    attach_inp = int(input("Enter number of attachments (0 if none): "))
    pred_priority = predict_priority(issue_inp, desc_inp, attach_inp)
    print(f"Predicted Priority: {pred_priority}\n")
