import pandas as pd
import numpy as np
from scipy import stats
import os


# ---------------------------------------
# SAMPLE CUSTOMER DATA
# ---------------------------------------
# revenue has extreme outliers
# age has impossible values

data = {
    "customer_id": [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],
    "revenue": [500, 700, 650, 800, 900, 1200, 1000, 750, 20000, 50000],
    "age": [22, 25, 30, 35, 40, 28, 32, 27, 180, 150]
}

df = pd.DataFrame(data)

print("\nORIGINAL DATASET")
print(df)


# =======================================
# TASK 1 - Z SCORE OUTLIER DETECTION
# =======================================
print("\nTASK 1 - Z SCORE DETECTION")

df["revenue_zscore"] = np.abs(stats.zscore(df["revenue"]))

z_outliers = df[df["revenue_zscore"] > 3]

print("Z-score outliers found:", len(z_outliers))
print(z_outliers)


# =======================================
# TASK 2 - IQR OUTLIER DETECTION
# =======================================
print("\nTASK 2 - IQR DETECTION")

Q1 = df["revenue"].quantile(0.25)
Q3 = df["revenue"].quantile(0.75)
IQR = Q3 - Q1

lower = Q1 - 1.5 * IQR
upper = Q3 + 1.5 * IQR

df["is_outlier_iqr"] = (
    (df["revenue"] < lower) |
    (df["revenue"] > upper)
)

print("Lower Bound:", lower)
print("Upper Bound:", upper)

iqr_outliers = df[df["is_outlier_iqr"]]

print("IQR outliers found:", len(iqr_outliers))
print(iqr_outliers)


# =======================================
# TASK 3 - CAP OUTLIERS
# =======================================
print("\nTASK 3 - CAPPING OUTLIERS")

df["revenue_capped"] = df["revenue"].clip(
    lower=lower,
    upper=upper
)

print("Before Capping")
print("Min =", df["revenue"].min())
print("Max =", df["revenue"].max())

print("\nAfter Capping")
print("Min =", df["revenue_capped"].min())
print("Max =", df["revenue_capped"].max())


# =======================================
# TASK 4 - FLAG OUTLIERS
# =======================================
print("\nTASK 4 - FLAGGING OUTLIERS")

df["is_outlier"] = (
    df["is_outlier_iqr"] |
    (df["revenue_zscore"] > 3)
)

normal = df[~df["is_outlier"]]
anomalies = df[df["is_outlier"]]

print("Normal records:", len(normal))
print("Anomalies:", len(anomalies))

print("\nFlagged Data")
print(df[["customer_id", "revenue", "is_outlier"]])


# =======================================
# EXTRA - AGE CLEANING
# =======================================
# age > 100 treated as impossible

print("\nAGE OUTLIER CHECK")

df["age_outlier"] = df["age"] > 100

print(df[["customer_id", "age", "age_outlier"]])


# =======================================
# TASK 5 - CLEANING LOG
# =======================================
print("\nTASK 5 - CLEANING LOG")

cleaning_log = [

    {
        "column": "revenue",
        "method": "Z-score",
        "action": "flag",
        "threshold_lower": "z < -3",
        "threshold_upper": "z > 3",
        "affected_rows": len(z_outliers),
        "date": pd.Timestamp.now()
    },

    {
        "column": "revenue",
        "method": "IQR",
        "action": "cap",
        "threshold_lower": lower,
        "threshold_upper": upper,
        "affected_rows": df["is_outlier_iqr"].sum(),
        "date": pd.Timestamp.now()
    },

    {
        "column": "age",
        "method": "Business Rule",
        "action": "flag",
        "threshold_lower": 0,
        "threshold_upper": 100,
        "affected_rows": df["age_outlier"].sum(),
        "date": pd.Timestamp.now()
    }

]

log_df = pd.DataFrame(cleaning_log)

# create output folder if not exists
os.makedirs("output", exist_ok=True)

log_df.to_csv("output/cleaning_log.csv", index=False)

print("\nCleaning log saved → output/cleaning_log.csv")


# =======================================
# FINAL DATAFRAME
# =======================================
print("\nFINAL DATAFRAME")
print(df)