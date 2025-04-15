from mlxtend.frequent_patterns import apriori, association_rules
from mlxtend.preprocessing import TransactionEncoder
import pandas as pd
import json
from collections import Counter

# Count how many times each user was in a transaction involving 'Milk'
milk_user_counter = Counter()


# Step 1: Build transactions with just product and users (NO payer)
records = []
with open('data.json', 'r') as file:
    data = json.load(file)
for entry in data:
    transaction = [f"product_{entry['productName']}"] + [f"user_{uid}" for uid in entry['splitUserIds']]
    records.append(transaction)

# Step 2: One-hot encode
te = TransactionEncoder()
te_ary = te.fit(records).transform(records)
df = pd.DataFrame(te_ary, columns=te.columns_)

frequent_itemsets = apriori(df, min_support=0.03, use_colnames=True)

rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.5)

filtered_rules = rules[
    rules['antecedents'].apply(lambda x: len(x) == 1 and list(x)[0].startswith('product_')) &
    rules['consequents'].apply(lambda x: any(i.startswith('user_') for i in x))
]

print("\n📊 Product → User Association Rules:")
print(filtered_rules[['antecedents', 'consequents', 'support', 'confidence', 'lift']])

def predict_users_for_product(product_name, rules_df):
    key = f"product_{product_name}"
    predicted_users = set()
    
    for _, row in rules_df.iterrows():
        if key in row['antecedents']:
            predicted_users.update([int(i.split('_')[1]) for i in row['consequents'] if i.startswith('user_')])
    
    return sorted(predicted_users)

product_query = "Butter"
predicted_users = predict_users_for_product(product_query, filtered_rules)
print(f"\n🔮 Predicted split users for '{product_query}':", predicted_users)
for entry in data:
    if entry['productName'] == product_query:
        for uid in entry['splitUserIds']:
            milk_user_counter[uid] += 1

print("\n🧾 User Purchase Count for 'Milk':")
for user, count in milk_user_counter.items():
    print(f"User {user} → {count} times")
