import pandas as pd
import json


def analyze_missing_values(df):
    """
    Compute null counts and percentages before treatment.
    """
    missing_analysis = pd.DataFrame({
        "column": df.columns,
        "null_count": df.isnull().sum().values,
        "null_percentage": (df.isnull().sum() / len(df) * 100).round(2).values,
        "data_type": df.dtypes.values
    })

    print("=" * 70)
    print("BEFORE IMPUTATION - Missing Value Analysis")
    print("=" * 70)
    print(missing_analysis.to_string(index=False))
    print(f"\nTotal rows: {len(df)}")
    print(f"Total cells: {len(df) * len(df.columns)}")
    print(f"Missing cells: {df.isnull().sum().sum()}")
    print("=" * 70)

    return missing_analysis


def impute_mean_median(df, numerical_cols, strategy="median"):
    """
    Fill numerical nulls with mean or median.
    """
    df_imputed = df.copy()

    for col in numerical_cols:
        if col in df.columns and df[col].isnull().sum() > 0:
            fill_value = (
                df[col].median()
                if strategy == "median"
                else df[col].mean()
            )

            null_count = df[col].isnull().sum()

            df_imputed[col] = df_imputed[col].fillna(fill_value)

            print(
                f"✓ {col}: filled {null_count} nulls with "
                f"{strategy} ({fill_value:.2f})"
            )

    return df_imputed


def impute_mode(df, categorical_cols):
    """
    Fill categorical nulls with mode.
    """
    df_imputed = df.copy()

    for col in categorical_cols:
        if col in df.columns and df[col].isnull().sum() > 0:
            mode_val = df[col].mode()[0]
            null_count = df[col].isnull().sum()

            df_imputed[col] = df_imputed[col].fillna(mode_val)

            print(
                f"✓ {col}: filled {null_count} nulls with mode '{mode_val}'"
            )

    return df_imputed


def impute_forward_fill(df, time_series_cols):
    """
    Fill with previous value (for time-series columns).
    """
    df_imputed = df.copy()

    for col in time_series_cols:
        if col in df.columns and df[col].isnull().sum() > 0:
            null_count = df[col].isnull().sum()

            df_imputed[col] = df_imputed[col].ffill()

            print(f"✓ {col}: forward-filled {null_count} nulls")

    return df_imputed


def drop_rows_with_nulls(df, critical_cols):
    """
    Drop rows with null values in critical columns.
    """
    rows_before = len(df)

    df_imputed = df.dropna(subset=critical_cols)

    rows_dropped = rows_before - len(df_imputed)

    print(
        f"✓ Dropped {rows_dropped} rows with nulls in {critical_cols}"
    )

    return df_imputed


def document_imputation_decisions(df_original, df_imputed):
    """
    Document all imputation decisions with business reasoning.
    """

    decisions = {
        "amount": {
            "column_type": "numerical",
            "null_count_before": (
                int(df_original["amount"].isnull().sum())
                if "amount" in df_original.columns
                else 0
            ),
            "strategy": "median_imputation",
            "value_used": (
                float(df_original["amount"].median())
                if "amount" in df_original.columns
                else None
            ),
            "business_reasoning": (
                "Median purchase amount is representative of a typical "
                "transaction and is less affected by outliers."
            ),
            "risk_assessment": (
                "Low risk because median is robust to extreme values."
            )
        },

        "email": {
            "column_type": "categorical_identifier",
            "null_count_before": (
                int(df_original["email"].isnull().sum())
                if "email" in df_original.columns
                else 0
            ),
            "strategy": "drop_rows",
            "rows_affected": (
                int(df_original["email"].isnull().sum())
                if "email" in df_original.columns
                else 0
            ),
            "business_reasoning": (
                "Email is required for customer communication and "
                "marketing campaigns."
            ),
            "risk_assessment": (
                "Low risk because only a few rows are removed."
            )
        },

        "name": {
            "column_type": "categorical",
            "strategy": "mode_imputation",
            "business_reasoning": (
                "Most frequent customer name preserves the categorical "
                "distribution."
            ),
            "risk_assessment": (
                "Low risk because only one value is missing."
            )
        }
    }

    with open("output/imputation_decisions.json", "w") as f:
        json.dump(decisions, f, indent=4)

    return decisions


def validate_imputation(df_original, df_imputed):
    """
    Compare before and after metrics.
    """

    print("\n" + "=" * 70)
    print("AFTER IMPUTATION - Validation Report")
    print("=" * 70)

    print(f"Total rows before: {len(df_original)}")
    print(f"Total rows after : {len(df_imputed)}")
    print(f"Rows removed     : {len(df_original) - len(df_imputed)}")

    print(f"\nTotal nulls before: {df_original.isnull().sum().sum()}")
    print(f"Total nulls after : {df_imputed.isnull().sum().sum()}")

    missing_after = pd.DataFrame({
        "column": df_imputed.columns,
        "null_count_after": df_imputed.isnull().sum().values,
        "null_percentage_after": (
            df_imputed.isnull().sum() / len(df_imputed) * 100
        ).round(2).values
    })

    print("\nNull values by column after imputation:")
    print(missing_after.to_string(index=False))

    print("=" * 70)

    return missing_after


if __name__ == "__main__":

    # Load data
    df = pd.read_csv("data/raw/missing_data.csv")

    # Step 1
    print("Step 1: Analyzing missing values...")
    analyze_missing_values(df)

    # Step 2
    print("\nStep 2: Applying imputation strategies...")

    # Drop rows with missing critical columns
    df_clean = drop_rows_with_nulls(
        df,
        ["customer_id", "email"]
    )

    # Numerical columns
    df_clean = impute_mean_median(
        df_clean,
        ["amount"],
        strategy="median"
    )

    # Categorical columns
    df_clean = impute_mode(
        df_clean,
        ["category", "name"]
    )

    # Time-series columns (none in current dataset)
    df_clean = impute_forward_fill(
        df_clean,
        []
    )

    # Step 3
    print("\nStep 3: Documenting imputation decisions...")
    document_imputation_decisions(df, df_clean)

    # Step 4
    print("\nStep 4: Validating imputation...")
    validate_imputation(df, df_clean)

    # Save cleaned data
    df_clean.to_csv(
        "data/processed/cleaned_data.csv",
        index=False
    )

    print("\n✓ Cleaned data saved to data/processed/cleaned_data.csv")