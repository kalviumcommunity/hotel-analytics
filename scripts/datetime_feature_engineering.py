import pandas as pd
import matplotlib.pyplot as plt


# ---------------------------------------
# SAMPLE TRANSACTION DATA
# ---------------------------------------
data = {
    "customer_id": [101, 102, 101, 103, 102, 104, 101, 105, 106, 102],
    "transaction_date": [
        "2025-01-15 14:30:45",
        "2025-01-15 14:10:20",
        "2025-01-16 14:45:10",
        "2025-01-16 09:00:00",
        "2025-01-17 09:10:05",
        "2025-01-18 18:20:30",
        "2025-01-18 18:40:55",
        "2025-01-19 18:25:10",
        "2025-01-20 22:50:40",
        "2025-01-20 22:05:15"
    ],
    "amount": [500, 250, 700, 300, 450, 600, 350, 800, 550, 400]
}

df = pd.DataFrame(data)

print("\nORIGINAL DATASET")
print(df)


# ---------------------------------------
# TASK 1 - PARSE TIMESTAMP STRINGS
# ---------------------------------------
print("\nTASK 1 - DATETIME CONVERSION")

df["transaction_date"] = pd.to_datetime(
    df["transaction_date"],
    format="%Y-%m-%d %H:%M:%S"
)

print("Datatype after conversion:")
print(df["transaction_date"].dtype)


# ---------------------------------------
# TASK 2 - EXTRACT DAY OF WEEK + HOUR
# ---------------------------------------
print("\nTASK 2 - DAY AND HOUR FEATURES")

df["day_of_week"] = df["transaction_date"].dt.day_name()
df["hour"] = df["transaction_date"].dt.hour

print(df[["transaction_date", "day_of_week", "hour"]])

print("\nHourly Transaction Volume")
hourly_volume = df.groupby("hour").size()
print(hourly_volume)

# Histogram
plt.figure(figsize=(8, 5))
plt.hist(df["hour"], bins=range(25))
plt.xlabel("Hour of Day")
plt.ylabel("Number of Transactions")
plt.title("Transaction Distribution by Hour")
plt.grid(True)
plt.show()


# ---------------------------------------
# TASK 3 - WEEK NUMBER + RESAMPLING
# ---------------------------------------
print("\nTASK 3 - WEEK NUMBER + RESAMPLING")

df["week_num"] = df["transaction_date"].dt.isocalendar().week

print(df[["transaction_date", "week_num"]])

df_ts = df.set_index("transaction_date")

weekly_revenue = df_ts["amount"].resample("W").sum()

print("\nWeekly Revenue")
print(weekly_revenue)

# Weekly Revenue Plot
plt.figure(figsize=(8, 5))
weekly_revenue.plot()
plt.title("Weekly Revenue Trend")
plt.xlabel("Week")
plt.ylabel("Revenue")
plt.grid(True)
plt.show()


# ---------------------------------------
# TASK 4 - DAYS SINCE LAST PURCHASE
# ---------------------------------------
print("\nTASK 4 - RECENCY / CHURN ANALYSIS")

today = pd.Timestamp.now()

customer_last_purchase = df.groupby("customer_id")["transaction_date"].transform("max")

df["days_since_last_purchase"] = (
    today - customer_last_purchase
).dt.days

print(df[["customer_id", "days_since_last_purchase"]])

print("\nRecency Distribution")
print(df["days_since_last_purchase"].describe())

inactive_customers = df[df["days_since_last_purchase"] > 30]

print("\nInactive Customers (>30 days)")
print(inactive_customers[["customer_id", "days_since_last_purchase"]])


# ---------------------------------------
# TASK 5 - TIME INDEXED AGGREGATION
# ---------------------------------------
print("\nTASK 5 - DAY × HOUR ANALYSIS")

hourly_daily = df.groupby(
    ["day_of_week", "hour"]
).agg({
    "amount": ["sum", "count", "mean"]
})

print("\nGrouped Aggregation")
print(hourly_daily)

pivot_table = pd.pivot_table(
    df,
    values="amount",
    index="hour",
    columns="day_of_week",
    aggfunc="sum"
)

print("\nPivot Table (Hour x Day)")
print(pivot_table)


# ---------------------------------------
# PEAK ACTIVITY WINDOW
# ---------------------------------------
peak = df.groupby(["day_of_week", "hour"])["amount"].sum().idxmax()

print("\nPeak Activity Window")
print(f"Highest activity on {peak[0]} at {peak[1]}:00")


# ---------------------------------------
# TESTING SECTION
# ---------------------------------------
print("\nTESTING OUTPUTS")

print("Min date:", df["transaction_date"].min())
print("Max date:", df["transaction_date"].max())

print(
    "Days in dataset:",
    (df["transaction_date"].max() -
     df["transaction_date"].min()).days
)

print("Hours with data:", df["hour"].unique())
print("Weeks in dataset:", df["week_num"].nunique())

print(
    "Min days since purchase:",
    df["days_since_last_purchase"].min()
)

print(
    "Max days since purchase:",
    df["days_since_last_purchase"].max()
)


# ---------------------------------------
# FINAL DATAFRAME
# ---------------------------------------
print("\nFINAL DATAFRAME")
print(df)