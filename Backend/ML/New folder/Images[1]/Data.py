import json
import random
from datetime import datetime, timedelta

# List of products with min and max rates
products = [
    {"name": "Basmati Rice", "min": 80, "max": 150, "category": "Grains"},
    {"name": "Wheat Flour", "min": 30, "max": 60, "category": "Grains"},
    {"name": "Sugar", "min": 35, "max": 55, "category": "Staples"},
    {"name": "Salt", "min": 10, "max": 25, "category": "Staples"},
    {"name": "Toor Dal", "min": 90, "max": 130, "category": "Pulses"},
    {"name": "Urad Dal", "min": 80, "max": 120, "category": "Pulses"},
    {"name": "Milk", "min": 40, "max": 60, "category": "Dairy"},
    {"name": "Curd", "min": 25, "max": 45, "category": "Dairy"},
    {"name": "Butter", "min": 180, "max": 300, "category": "Dairy"},
    {"name": "Paneer", "min": 100, "max": 180, "category": "Dairy"},
    {"name": "Tea Powder", "min": 100, "max": 250, "category": "Beverages"},
    {"name": "Coffee Powder", "min": 150, "max": 300, "category": "Beverages"},
    {"name": "Sunflower Oil", "min": 100, "max": 200, "category": "Oils"},
    {"name": "Groundnut Oil", "min": 110, "max": 210, "category": "Oils"},
    {"name": "Coconut Oil", "min": 90, "max": 180, "category": "Oils"},
    {"name": "Eggs", "min": 60, "max": 90, "category": "Eggs & Meat"},
    {"name": "Onion", "min": 20, "max": 40, "category": "Vegetables"},
    {"name": "Potato", "min": 20, "max": 35, "category": "Vegetables"},
    {"name": "Apple", "min": 100, "max": 180, "category": "Fruits"},
    {"name": "Banana", "min": 40, "max": 70, "category": "Fruits"},
    {"name": "Orange", "min": 80, "max": 120, "category": "Fruits"},
    {"name": "Mango", "min": 100, "max": 150, "category": "Fruits"},
]

def random_date(start_days_ago=180, end_days_ago=0):
    days_ago = random.randint(end_days_ago, start_days_ago)
    date = datetime.now() - timedelta(days=days_ago)
    return date.strftime("%Y-%m-%d")

# Increase product combinations for higher co-occurrence
data = []
for _ in range(200):  # Increased data size
    product1 = random.choice(products)
    product2 = random.choice(products)
    while product1 == product2:  # Ensure two different products
        product2 = random.choice(products)

    rate1 = round(random.uniform(product1["min"], product1["max"]), 2)
    rate2 = round(random.uniform(product2["min"], product2["max"]), 2)
    quantity1 = random.randint(1, 5)
    quantity2 = random.randint(1, 5)
    date = random_date()
    room_id = 1

    # Modify payer_id to exclude User 1
    payer_id = random.choice([2, 3, 4, 5])  # Exclude User 1 as payer

    # Modify split_users to exclude User 1
    possible_users = [2, 3, 4, 5]  # Exclude User 1 from split users
    split_users = random.sample(possible_users, random.randint(2, 4))

    entry = {
        "productName": product1["name"],
        "rate": rate1,
        "quantity": quantity1,
        "date": date,
        "roomId": room_id,
        "payerId": payer_id,
        "splitUserIds": split_users
    }
    data.append(entry)

    entry2 = {
        "productName": product2["name"],
        "rate": rate2,
        "quantity": quantity2,
        "date": date,
        "roomId": room_id,
        "payerId": payer_id,
        "splitUserIds": split_users
    }
    data.append(entry2)

# Save to JSON file
with open("data.json", "w") as f:
    json.dump(data, f, indent=2)

print("✅ Data saved to 'product_expenses_data.json'")
