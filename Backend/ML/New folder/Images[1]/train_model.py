from mlxtend.frequent_patterns import apriori, association_rules
from tqdm import tqdm
import pandas as pd
import json

# Load JSON data from a file
with open('data.json', 'r') as file:
    data = json.load(file)

# Create a dataframe from the JSON data
df = pd.DataFrame(data)

# Create a list of all unique users (convert set to list)
users = list(set(user for sublist in df["splitUserIds"] for user in sublist))

# Create a user-product matrix (one-hot encoding with boolean values)
user_product_matrix = pd.DataFrame(False, index=users, columns=df["productName"].unique())

# Populate the matrix with True for user-product associations and show the progress bar
print("Populating User-Product Matrix...")
for _, row in tqdm(df.iterrows(), total=len(df), desc="Filling Matrix"):
    for user in row["splitUserIds"]:
        user_product_matrix.loc[user, row["productName"]] = True

# Run Apriori with increased min_support for faster performance
print("Running Apriori Algorithm...")
min_support = 0.3  # Increased min_support to reduce computation time
frequent_itemsets = apriori(user_product_matrix, min_support=min_support, use_colnames=True)

# Generate association rules from frequent itemsets with confidence threshold
print("Generating Association Rules...")
rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.5)

# Display the association rules
print("\nAssociation Rules:")
print(rules)

# Example usage: Predict which users are likely to consume a given product
def predict_user_for_product(product_name, rules):
    relevant_rules = rules[rules["antecedents"].apply(lambda x: product_name in x)]
    users_likely_to_buy = relevant_rules["consequents"].apply(lambda x: list(x)).explode().unique()
    return users_likely_to_buy

product_name = "Basmati Rice"
predicted_users = predict_user_for_product(product_name, rules)

print(f"\nUsers likely to consume {product_name}: {predicted_users}")
