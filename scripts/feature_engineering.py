import os
import time

import numpy as np
import pandas as pd

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
# Task 5: NumPy-based normalization
# ---------------------------------------

df["revenue"] = df["total_spent"].astype(float)
revenue_array = df["revenue"].to_numpy(dtype=float)

# Min-max normalization
revenue_min = revenue_array.min()
revenue_max = revenue_array.max()
revenue_range = revenue_max - revenue_min
if revenue_range == 0:
    normalized_np = np.zeros_like(revenue_array, dtype=float)
else:
    normalized_np = (revenue_array - revenue_min) / revenue_range

df["revenue_normalized"] = normalized_np

# Z-score normalization
revenue_mean = revenue_array.mean()
revenue_std = revenue_array.std(ddof=0)
if revenue_std == 0:
    z_scores = np.zeros_like(revenue_array, dtype=float)
else:
    z_scores = (revenue_array - revenue_mean) / revenue_std

df["revenue_zscore"] = z_scores

# Bulk ranking / scoring
rankings = np.argsort(-revenue_array)
ranked_values = np.empty_like(rankings, dtype=int)
ranked_values[rankings] = np.arange(1, len(rankings) + 1)
df["revenue_rank"] = ranked_values

# Performance comparison
start = time.perf_counter()
result_loop = []
for val in revenue_array:
    result_loop.append(val * 1.1)
loop_time = time.perf_counter() - start

start = time.perf_counter()
result_np = revenue_array * 1.1
np_time = time.perf_counter() - start

print("\nNormalization Performance")
print(f"Loop: {loop_time:.6f}s")
print(f"NumPy: {np_time:.6f}s")
print(f"Speedup: {loop_time / np_time:.1f}x" if np_time > 0 else "Speedup: infx")

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
            "revenue_normalized",
            "revenue_zscore",
            "revenue_rank",
        ]
    ].isna().sum()
)
print("\nNormalization Output")
print(f"Shape: {df.shape}")
print(f"Dtypes:\n{df.dtypes}")

# ---------------------------------------
# Save output
# ---------------------------------------

df.to_csv(
    "output/feature_engineered_data.csv",
    index=False
)

print("\nFeature engineering completed!")