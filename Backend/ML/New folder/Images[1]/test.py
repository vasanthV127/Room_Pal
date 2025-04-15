import pickle

with open("association_model.pkl", "rb") as f:
    model = pickle.load(f)

product = "MustardSeeds"
print("Predicted Users:", model.predict_users_for_product(product))
