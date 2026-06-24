import pandas as pd
import numpy as np


# -----------------------------
# Task 1: Generic type casting
# -----------------------------
def cast_columns_to_types(df, type_mapping):
    df_typed = df.copy()
    conversion_log = {}

    for col, target_dtype in type_mapping.items():
        if col not in df.columns:
            print(f"Warning: Column {col} not found in DataFrame")
            continue

        original_dtype = df[col].dtype

        try:
            df_typed[col] = df_typed[col].astype(target_dtype)

            conversion_log[col] = {
                "from": str(original_dtype),
                "to": str(target_dtype),
                "status": "success",
            }

            print(f"✓ {col}: {original_dtype} → {target_dtype}")

        except Exception as e:
            conversion_log[col] = {
                "from": str(original_dtype),
                "to": str(target_dtype),
                "status": "failed",
                "error": str(e),
            }

            print(f"✗ {col}: Conversion failed - {e}")
            raise

    return df_typed, conversion_log


# -----------------------------
# Task 2: Dates → datetime
# -----------------------------
def convert_string_dates_to_datetime(df, date_columns, date_format="%Y-%m-%d"):
    df_typed = df.copy()

    for col in date_columns:
        if col not in df.columns:
            print(f"Warning: Column {col} not found")
            continue

        try:
            df_typed[col] = pd.to_datetime(df_typed[col], format=date_format)
            print(f"✓ {col}: Converted to datetime")

        except Exception as e:
            print(f"✗ {col}: Conversion failed - {e}")
            print(df[col].head())
            raise

    return df_typed


# -----------------------------
# Task 3: Currency → float
# -----------------------------
def convert_currency_to_float(df, currency_columns):
    df_typed = df.copy()

    for col in currency_columns:
        if col not in df.columns:
            print(f"Warning: Column {col} not found")
            continue

        try:
            df_typed[col] = (
                df_typed[col]
                .astype(str)
                .str.replace(r"[$,]", "", regex=True)
                .str.strip()
            )

            df_typed[col] = pd.to_numeric(df_typed[col], errors="coerce")

            print(f"✓ {col}: Converted to float")

        except Exception as e:
            print(f"✗ {col}: Conversion failed - {e}")
            raise

    return df_typed


# -----------------------------
# Task 4: Boolean conversion
# -----------------------------
def convert_integers_to_boolean(df, boolean_columns):
    df_typed = df.copy()

    for col in boolean_columns:
        if col not in df.columns:
            print(f"Warning: Column {col} not found")
            continue

        try:
            mapping = {
                "yes": True, "no": False,
                "y": True, "n": False,
                "true": True, "false": False,
                "1": True, "0": False,
                1: True, 0: False,
                True: True, False: False
            }

            if df[col].dtype == "object":
                df_typed[col] = df_typed[col].astype(str).str.lower().map(mapping)
            else:
                df_typed[col] = df_typed[col].astype(bool)

            print(f"✓ {col}: Converted to boolean")

        except Exception as e:
            print(f"✗ {col}: Conversion failed - {e}")
            raise

    return df_typed


# -----------------------------
# Task 5: Compare dtypes
# -----------------------------
def compare_dtypes(df_original, df_typed):
    comparison = pd.DataFrame({
        "column": df_original.columns,
        "dtype_before": df_original.dtypes.values,
        "dtype_after": df_typed.dtypes.values,
        "changed": (df_original.dtypes != df_typed.dtypes).values
    })

    print("\n" + "=" * 60)
    print("DTYPE CONVERSION SUMMARY")
    print("=" * 60)
    print(comparison)

    comparison.to_csv("output/dtype_conversion_report.csv", index=False)

    print("\nSaved report → output/dtype_conversion_report.csv")

    return comparison


# -----------------------------
# Task 6: Main pipeline
# -----------------------------
if __name__ == "__main__":

    df = pd.read_csv("data/raw/untyped_data.csv")

    print("\nBEFORE:")
    print(df.dtypes)
    print(df.head())

    df_typed = df.copy()

    # Dates
    df_typed = convert_string_dates_to_datetime(
        df_typed,
        ["transaction_date", "signup_date"]
    )

    # Currency
    df_typed = convert_currency_to_float(
        df_typed,
        ["amount"]
    )

    # Boolean
    df_typed = convert_integers_to_boolean(
        df_typed,
        ["is_active"]
    )

    print("\nAFTER:")
    print(df_typed.dtypes)
    print(df_typed.head())

    compare_dtypes(df, df_typed)

    df_typed.to_csv("data/processed/typed_data.csv", index=False)
    print("\n✓ Saved typed dataset → data/processed/typed_data.csv")