import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
import scipy.sparse as sp
import pickle

# Load dataset
df = pd.read_csv("jharkhand_priority_dataset_noisy_5000.csv")

# Features: complaint text + metadata
X_text = df["complaint_text"]
X_meta = df[["votes", "attachments"]]
y = df["priority_label"]

# Convert complaint text to TF-IDF features (with bigrams for improvement)
vectorizer = TfidfVectorizer(max_features=8000, ngram_range=(1,2))
X_text_tfidf = vectorizer.fit_transform(X_text)

# Combine text features with numeric metadata
X = sp.hstack((X_text_tfidf, X_meta))

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ----------------------
# 🔍 Model Tuning with GridSearchCV
# ----------------------
param_grid = {
    "n_estimators": [200, 300, 500],
    "max_depth": [15, 25, 35, None],
    "max_features": ["sqrt", "log2"]
}

grid = GridSearchCV(
    RandomForestClassifier(class_weight="balanced", random_state=42, n_jobs=-1),
    param_grid,
    cv=3,
    scoring="f1_macro",
    n_jobs=-1,
    verbose=2
)

# Train with best parameters
grid.fit(X_train, y_train)
print("Best Parameters:", grid.best_params_)

# Use the best model
best_model = grid.best_estimator_
y_pred = best_model.predict(X_test)

# ----------------------
# Evaluation
# ----------------------
print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred, labels=["High","Medium","Low"])
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
            xticklabels=["High","Medium","Low"],
            yticklabels=["High","Medium","Low"])
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix - Priority Prediction")
plt.show()

# ----------------------
# ✅ Save Model + Vectorizer
# ----------------------
with open("priority_model.pkl", "wb") as f:
    pickle.dump(best_model, f)

with open("tfidf_vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

print("✅ Model and vectorizer saved successfully!")
