import pandas as pd
import json
import os

os.makedirs("output", exist_ok=True)

df_customers = pd.read_csv("data/raw/customers.csv")
df_orders = pd.read_csv("data/raw/orders.csv")

# ---------------- Task 1 ----------------

print("Customers:", len(df_customers))
print("Orders:", len(df_orders))

df_merged = pd.merge(
    df_customers,
    df_orders,
    on="customer_id",
    how="left"
)

print("Merged:", len(df_merged))
print("Change:", len(df_merged) - len(df_customers))

# ---------------- Task 2 ----------------

unmatched_customers = df_customers[
    ~df_customers["customer_id"].isin(df_orders["customer_id"])
]

unmatched_orders = df_orders[
    ~df_orders["customer_id"].isin(df_customers["customer_id"])
]

print("Customers without orders:", len(unmatched_customers))
print("Orders without customer:", len(unmatched_orders))

unmatched_customers.to_csv(
    "output/unmatched_customers.csv",
    index=False
)

unmatched_orders.to_csv(
    "output/unmatched_orders.csv",
    index=False
)

# ---------------- Task 3 ----------------

inner = pd.merge(
    df_customers,
    df_orders,
    on="customer_id",
    how="inner"
)

left = pd.merge(
    df_customers,
    df_orders,
    on="customer_id",
    how="left"
)

outer = pd.merge(
    df_customers,
    df_orders,
    on="customer_id",
    how="outer"
)

print("Inner:", len(inner))
print("Left :", len(left))
print("Outer:", len(outer))

# ---------------- Task 4 ----------------

print("\nColumns:")
print(df_merged.columns.tolist())

key_counts = df_merged["customer_id"].value_counts()

print("Max orders per customer:", key_counts.max())

# ---------------- Task 5 ----------------

join_report = {
    "join_type": "left",
    "left_table": "customers",
    "right_table": "orders",
    "join_key": "customer_id",
    "left_rows": len(df_customers),
    "right_rows": len(df_orders),
    "result_rows": len(df_merged),
    "unmatched_left": len(unmatched_customers),
    "unmatched_right": len(unmatched_orders),
    "reasoning": "Left join preserves all customers even if they have no orders."
}

print(json.dumps(join_report, indent=4))

with open("output/join_report.json", "w") as f:
    json.dump(join_report, f, indent=4)

df_merged.to_csv("output/merged_data.csv", index=False)

print("\nFiles saved in output/")