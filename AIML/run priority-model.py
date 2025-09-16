import pickle
import scipy.sparse as sp

# Load saved objects
with open("priority_model.pkl", "rb") as f:
    model = pickle.load(f)

with open("tfidf_vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

with open("issue_encoder.pkl", "rb") as f:
    encoder = pickle.load(f)

# Prediction function
def predict_priority(issue_type, description, attachments):
    issue_encoded = encoder.transform([[issue_type]])
    desc_tfidf = vectorizer.transform([description])
    numeric_sparse = sp.csr_matrix([[attachments]])
    X_input = sp.hstack((issue_encoded, desc_tfidf, numeric_sparse))
    return model.predict(X_input)[0]

# Example usage multiple times
while True:
    issue_inp = input("Enter Issue Type (or 'exit' to quit): ")
    if issue_inp.lower() == 'exit':
        break
    desc_inp = input("Enter Complaint Description: ")
    attach_inp = int(input("Enter number of attachments (0 if none): "))
    pred_priority = predict_priority(issue_inp, desc_inp, attach_inp)
    print(f"Predicted Priority: {pred_priority}\n")
