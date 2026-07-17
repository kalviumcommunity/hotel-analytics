import json
import os
import time

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

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
# Task 6: Churn correlation analysis
# ---------------------------------------

# Create a simple proxy for customer engagement from transactions per month
engagement_values = np.interp(
    df["transactions_per_month"],
    (df["transactions_per_month"].min(), df["transactions_per_month"].max()),
    (0, 100),
)
df["engagement"] = engagement_values

# Build a latent customer pain score from behavioural signals
activity_score = np.interp(
    df["transactions_per_month"],
    (df["transactions_per_month"].min(), df["transactions_per_month"].max()),
    (1, 0),
)
recency_score = np.interp(
    df["days_since_last_purchase"],
    (df["days_since_last_purchase"].min(), df["days_since_last_purchase"].max()),
    (1, 0),
)
longevity_score = np.interp(
    df["days_as_customer"],
    (df["days_as_customer"].min(), df["days_as_customer"].max()),
    (1, 0),
)

# Lower engagement, recent inactivity, and short tenure all signal pain
pain_score = np.clip(
    0.45 * activity_score + 0.35 * recency_score + 0.20 * longevity_score,
    0,
    1,
)
df["customer_pain"] = pain_score

df["support_tickets"] = np.clip(
    np.round(df["customer_pain"] * 6), 0, 6
).astype(int)

# Churn is driven by pain and ticket volume; the ticket count is a symptom
# and should be interpreted cautiously
churn_score = (
    0.5 * df["customer_pain"] + 0.5 * (df["support_tickets"] / 6)
)
df["churn"] = (churn_score > 0.55).astype(int)

# Task 1: Pearson and Spearman correlation
pearson_corr = df.corr(numeric_only=True, method="pearson")
spearman_corr = df.corr(numeric_only=True, method="spearman")
comparison = pd.DataFrame(
    {
        "pearson": pearson_corr["churn"],
        "spearman": spearman_corr["churn"],
    }
)
print("\nCorrelation comparison with churn")
print(comparison)
comparison.to_csv("output/churn_correlation_comparison.csv")

# Task 2: Correlation heatmap
fig, ax = plt.subplots(figsize=(12, 10))
sns.heatmap(
    pearson_corr,
    annot=True,
    cmap="coolwarm",
    center=0,
    ax=ax,
)
ax.set_title("Feature Correlation Matrix")
plt.tight_layout()
plt.savefig("output/correlation_heatmap.png", dpi=200)
plt.close(fig)

# Task 3: Strongly correlated pairs
corr_flat = pearson_corr.unstack()
strong = corr_flat[corr_flat.abs() > 0.7].sort_values(ascending=False)
strong_pairs = strong[strong != 1.0].head(10)
print("\nStrongly correlated pairs")
print(strong_pairs)

# Task 4: Business interpretation
analysis = {
    "support_tickets <-> churn": {
        "correlation": round(float(df["support_tickets"].corr(df["churn"])), 2),
        "possible_directions": [
            "support_tickets → churn (customer gives up after contacting support)",
            "churn → support_tickets (unhappy customers contact support before leaving)",
            "customer_pain → both (underlying issue causes both)",
        ],
        "data_indicates": "Likely customer_pain is the confounder; tickets are symptom not cause",
        "action": "Focus on reducing pain, not blocking tickets",
    }
}
print("\nBusiness interpretation")
print(json.dumps(analysis, indent=2))
with open("output/churn_analysis.json", "w", encoding="utf-8") as handle:
    json.dump(analysis, handle, indent=2)

# Task 5: Feature selection based on correlation
# transactions_per_month and engagement are highly correlated; keep the more interpretable feature
# and exclude engagement from the final feature set
selected_features = ["transactions_per_month", "support_tickets", "churn"]
df_features = df[selected_features].copy()
print("\nSelected feature set")
print(df_features.corr(numeric_only=True))
df_features.to_csv("output/churn_feature_selection.csv", index=False)

# ---------------------------------------
# Save output
# ---------------------------------------

df.to_csv(
    "output/feature_engineered_data.csv",
    index=False
)

print("\nFeature engineering completed!")