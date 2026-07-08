import pandas as pd
import os

# Load data
df = pd.read_csv("data/raw/customer_transactions.csv")

os.makedirs("output", exist_ok=True)

# ---------------------------------------
# Task 1: Ratio Features
# ---------------------------------------

df["transactions_per_month"] = (
    df["total_transactions"] /
    (df["days_as_customer"] / 30)
)

df["avg_spend_per_transaction"] = (
    df["total_spent"] /
    df["total_transactions"]
)

df["lifetime_value_per_month"] = (
    df["total_spent"] /
    (df["days_as_customer"] / 30)
)

print("\nRatio Features")
print(df[
    [
        "transactions_per_month",
        "avg_spend_per_transaction",
        "lifetime_value_per_month"
    ]
].describe())

# ---------------------------------------
# Task 2: Equal Width Bins
# ---------------------------------------

df["engagement_tier"] = pd.cut(
    df["transactions_per_month"],
    bins=[0, 2, 10, float("inf")],
    labels=["low", "medium", "high"]
)

print("\nEngagement Tier")
print(df["engagement_tier"].value_counts())

# ---------------------------------------
# Task 3: Quantile Binning
# ---------------------------------------

df["spend_quartile"] = pd.qcut(
    df["total_spent"],
    q=4,
    labels=["Q1", "Q2", "Q3", "Q4"]
)

print("\nSpend Quartiles")
print(df["spend_quartile"].value_counts())

# ---------------------------------------
# Task 4: Composite Score
# ---------------------------------------

df["recency_score"] = pd.qcut(
    df["days_since_last_purchase"],
    q=5,
    labels=[5, 4, 3, 2, 1]
)

df["frequency_score"] = pd.qcut(
    df["purchase_count"],
    q=5,
    labels=[1, 2, 3, 4, 5]
)

df["monetary_score"] = pd.qcut(
    df["total_spent"],
    q=5,
    labels=[1, 2, 3, 4, 5]
)

df["rfm_score"] = (
    df["recency_score"].astype(int)
    + df["frequency_score"].astype(int)
    + df["monetary_score"].astype(int)
)

# ---------------------------------------
# Task 5: Validation
# ---------------------------------------

print("\nValidation")

print(df["engagement_tier"].value_counts())

print(
    f"RFM Score Range: "
    f"{df['rfm_score'].min()} - {df['rfm_score'].max()}"
)

print("\nMissing Values")

print(
    df[
        [
            "engagement_tier",
            "spend_quartile",
            "rfm_score",
        ]
    ].isna().sum()
)

# ---------------------------------------
# Save output
# ---------------------------------------

df.to_csv(
    "output/feature_engineered_data.csv",
    index=False
)

print("\nFeature engineering completed!")