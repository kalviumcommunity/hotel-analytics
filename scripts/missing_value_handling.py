import pandas as pd

# Load dataset
df = pd.read_csv("data/raw/sample.csv")

print("BEFORE IMPUTATION")
print(df.isnull().sum())

# Critical columns (drop if null)
df = df.dropna(subset=["booking_id"])

# Numerical columns
df["room_nights"] = df["room_nights"].fillna(
    df["room_nights"].median()
)

# Categorical columns
df["customer_segment"] = df["customer_segment"].fillna(
    df["customer_segment"].mode()[0]
)

df["season"] = df["season"].fillna(
    df["season"].mode()[0]
)

print("\nAFTER IMPUTATION")
print(df.isnull().sum())

# Save processed file
df.to_csv(
    "data/processed/cleaned_data.csv",
    index=False
)

print("\nProcessed dataset saved.")