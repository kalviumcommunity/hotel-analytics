import pandas as pd
import os

# Load data
df = pd.read_csv("data/raw/missing_data.csv")

# -----------------------
# Validation Rules
# -----------------------

# Customer ID must exist
df["valid_customer_id"] = df["customer_id"].notna()

# Name must exist
df["valid_name"] = df["name"].notna()

# Email must exist
df["valid_email"] = df["email"].notna()

# Email format
df["valid_email_format"] = df["email"].str.contains("@", na=False)

# Amount must not be negative
df["valid_amount"] = df["amount"] >= 0

# Category must exist
df["valid_category"] = df["category"].notna()

# -----------------------
# Overall Validation
# -----------------------

validation_cols = [
    "valid_customer_id",
    "valid_name",
    "valid_email",
    "valid_email_format",
    "valid_amount",
    "valid_category",
]

df["passes_all_checks"] = df[validation_cols].all(axis=1)

# Separate good and bad records
failures = df[~df["passes_all_checks"]]
clean = df[df["passes_all_checks"]]

# Save outputs
os.makedirs("output", exist_ok=True)

failures.to_csv("output/validation_failures.csv", index=False)
clean.to_csv("output/validated_data.csv", index=False)

# -----------------------
# Report
# -----------------------

print("===== VALIDATION REPORT =====")
print("Total Records :", len(df))
print("Passed        :", df["passes_all_checks"].sum())
print("Failed        :", (~df["passes_all_checks"]).sum())

print("\nFailures by Rule")
for col in validation_cols:
    print(f"{col}: {(~df[col]).sum()}")