import pandas as pd

df = pd.read_csv("data/raw/sample.csv")   # adjust path if needed

print(df.info())
print("\nMissing values:")
print(df.isnull().sum())