# association_model.py
from mlxtend.frequent_patterns import apriori, association_rules
from mlxtend.preprocessing import TransactionEncoder
import pandas as pd
import json
from collections import Counter

class ProductUserAssociation:
    def __init__(self, json_path="data.json"):
        self.json_path = json_path
        self.data = self._load_data()
        self.records = self._build_transactions()
        self.df = self._one_hot_encode()
        self.rules = self._mine_rules()
    
    def _load_data(self):
        with open(self.json_path, 'r') as file:
            return json.load(file)

    def _build_transactions(self):
        return [
            [f"product_{entry['productName']}"] + [f"user_{uid}" for uid in entry['splitUserIds']]
            for entry in self.data
        ]

    def _one_hot_encode(self):
        te = TransactionEncoder()
        te_ary = te.fit(self.records).transform(self.records)
        return pd.DataFrame(te_ary, columns=te.columns_)

    def _mine_rules(self):
        frequent_itemsets = apriori(self.df, min_support=0.03, use_colnames=True)
        rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.5)
        return rules[
            rules['antecedents'].apply(lambda x: len(x) == 1 and list(x)[0].startswith('product_')) &
            rules['consequents'].apply(lambda x: any(i.startswith('user_') for i in x))
        ]

    def predict_users_for_product(self, product_name):
        key = f"product_{product_name}"
        predicted_users = set()

        for _, row in self.rules.iterrows():
            if key in row['antecedents']:
                predicted_users.update([
                    int(i.split('_')[1]) for i in row['consequents'] if i.startswith('user_')
                ])
        return sorted(predicted_users)

    def get_user_purchase_count(self, product_name):
        counter = Counter()
        for entry in self.data:
            if entry['productName'] == product_name:
                for uid in entry['splitUserIds']:
                    counter[uid] += 1
        return counter
