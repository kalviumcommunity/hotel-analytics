import os
import json
from datetime import datetime

import numpy as np
import pandas as pd


def detect_exact_duplicates(df):
    """
    Find rows where all values are identical.

    Returns:
        tuple: (count, duplicate_rows_dataframe)
    """
    exact_dups = df.duplicated().sum()

    dup_rows = df[df.duplicated(keep=False)].sort_values(
        by=df.columns.tolist()
    )

    print("\nEXACT DUPLICATE DETECTION")
    print("=" * 60)
    print(f"Exact duplicates found: {exact_dups}")
    print(f"Total duplicate rows (including originals): {len(dup_rows)}")

    if len(dup_rows) > 0:
        print("\nSample duplicate rows:")
        print(dup_rows.head(10).to_string(index=False))

    return exact_dups, dup_rows


def detect_near_duplicates(df, key_columns):
    """
    Find rows with duplicate key values.
    """

    duplicate_keys = df[df.duplicated(subset=key_columns, keep=False)]

    print("\nNEAR-DUPLICATE DETECTION")
    print("=" * 60)
    print(f"Records with duplicate keys: {len(duplicate_keys)}")
    print(
        f"Unique key combinations with duplicates: "
        f"{len(duplicate_keys.groupby(key_columns))}"
    )

    if len(duplicate_keys) > 0:
        print("\nSample duplicate groups:")

        for keys, group in list(
            duplicate_keys.groupby(key_columns)
        )[:3]:
            print(f"\nKey: {keys}")
            print(group.to_string(index=False))

    return duplicate_keys


def remove_exact_duplicates(df, keep="first"):
    """
    Remove exact duplicates.
    """

    rows_before = len(df)

    df_dedup = df.drop_duplicates(keep=keep)

    rows_after = len(df_dedup)

    rows_removed = rows_before - rows_after

    removal_pct = (rows_removed / rows_before) * 100

    print("\nEXACT DUPLICATE REMOVAL")
    print("=" * 60)
    print(f"Keep strategy: {keep}")
    print(f"Rows before : {rows_before}")
    print(f"Rows after  : {rows_after}")
    print(f"Rows removed: {rows_removed} ({removal_pct:.2f}%)")

    return df_dedup


def remove_near_duplicates(df, key_columns, keep_strategy="most_complete"):
    """
    Remove near duplicates.
    """

    rows_before = len(df)

    if keep_strategy == "most_complete":

        def keep_most_complete(group):
            null_counts = group.isnull().sum(axis=1)
            best_index = null_counts.idxmin()
            return group.loc[[best_index]]

        df_dedup = (
            df.groupby(key_columns, group_keys=False)
            .apply(keep_most_complete)
            .reset_index(drop=True)
        )

    elif keep_strategy == "last":

        df_dedup = df.drop_duplicates(
            subset=key_columns,
            keep="last",
        )

    else:

        df_dedup = df.drop_duplicates(
            subset=key_columns,
            keep="first",
        )

    rows_after = len(df_dedup)

    rows_removed = rows_before - rows_after

    removal_pct = (rows_removed / rows_before) * 100

    print("\nNEAR-DUPLICATE REMOVAL")
    print("=" * 60)
    print(f"Keep strategy: {keep_strategy}")
    print(f"Key columns : {key_columns}")
    print(f"Rows before : {rows_before}")
    print(f"Rows after  : {rows_after}")
    print(f"Rows removed: {rows_removed} ({removal_pct:.2f}%)")

    return df_dedup


def log_removed_duplicates(df_original, df_dedup):
    """
    Save all removed duplicate rows to audit file for compliance.
    """

    os.makedirs("output", exist_ok=True)

    removed_indices = df_original.index.difference(df_dedup.index)
    removed_records = df_original.loc[removed_indices]

    print("\nAUDIT LOGGING")
    print("=" * 60)
    print(f"Total records removed: {len(removed_records)}")

    removed_records.to_csv(
        "output/removed_duplicates_audit.csv",
        index=False
    )

    audit_summary = {
        "removal_timestamp": datetime.now().isoformat(),
        "total_removed": int(len(removed_records)),
        "reason": "Duplicate detection and deduplication",
        "audit_file": "output/removed_duplicates_audit.csv",
        "audit_note": "All removed records logged for compliance."
    }

    with open("output/dedup_audit_summary.json", "w") as f:
        json.dump(audit_summary, f, indent=2)

    print("✓ Removed records saved")
    print("✓ Audit summary saved")

    return removed_records, audit_summary
    """
    Save removed records.
    """

    os.makedirs("output", exist_ok=True)

    removed_records = df_original.merge(
        df_dedup.drop_duplicates(),
        how="outer",
        indicator=True,
    )

    removed_records = removed_records[
        removed_records["_merge"] == "left_only"
    ].drop(columns="_merge")

    print("\nAUDIT LOGGING")
    print("=" * 60)
    print(f"Total removed records: {len(removed_records)}")

    removed_records.to_csv(
        "output/removed_duplicates_audit.csv",
        index=False,
    )

    audit_summary = {
        "removal_timestamp": datetime.now().isoformat(),
        "total_removed": int(len(removed_records)),
        "reason": "Duplicate detection and deduplication",
        "audit_file": "output/removed_duplicates_audit.csv",
        "audit_note": (
            "All removed records logged for compliance."
        ),
    }

    with open(
        "output/dedup_audit_summary.json",
        "w",
    ) as f:
        json.dump(audit_summary, f, indent=2)

    print("✓ Removed records saved")
    print("✓ Audit summary saved")

    return removed_records, audit_summary


def compare_before_after(df_original, df_dedup):
    """
    Compare dataset before and after deduplication.
    """

    comparison = {
        "rows_before": len(df_original),
        "rows_after": len(df_dedup),
        "rows_removed": len(df_original) - len(df_dedup),
        "removal_percentage": round(
            (
                (len(df_original) - len(df_dedup))
                / len(df_original)
            )
            * 100,
            2,
        ),
        "columns": len(df_original.columns),
        "nulls_before": int(df_original.isnull().sum().sum()),
        "nulls_after": int(df_dedup.isnull().sum().sum()),
        "timestamp": datetime.now().isoformat(),
    }

    print("\n" + "=" * 70)
    print("DEDUPLICATION FINAL SUMMARY")
    print("=" * 70)

    for key, value in comparison.items():
        print(f"{key}: {value}")

    with open(
        "output/dedup_summary.json",
        "w",
    ) as f:
        json.dump(comparison, f, indent=2)

    return comparison


if __name__ == "__main__":

    print("\n" + "=" * 70)
    print("STARTING DEDUPLICATION WORKFLOW")
    print("=" * 70)

    df_original = pd.read_csv("data/raw/data_with_dupes.csv")

    print(f"Initial record count: {len(df_original)}")

    print("\n[Step 1/4] Detecting exact duplicates...")
    detect_exact_duplicates(df_original)

    print("\n[Step 2/4] Detecting near duplicates...")
    detect_near_duplicates(
        df_original,
        key_columns=["customer_id", "transaction_date"],
    )

    print("\n[Step 3/4] Removing exact duplicates...")
    df_exact = remove_exact_duplicates(
        df_original,
        keep="first",
    )

    print("\n[Step 4/4] Removing near duplicates...")
    df_final = remove_near_duplicates(
        df_exact,
        key_columns=["customer_id", "transaction_date"],
        keep_strategy="most_complete",
    )

    print("\n[Audit] Logging removed records...")
    log_removed_duplicates(df_original, df_final)

    compare_before_after(df_original, df_final)

    os.makedirs("data/processed", exist_ok=True)

    df_final.to_csv(
        "data/processed/deduplicated_data.csv",
        index=False,
    )

    print(
        "\n✓ Deduplicated data saved to "
        "data/processed/deduplicated_data.csv"
    )