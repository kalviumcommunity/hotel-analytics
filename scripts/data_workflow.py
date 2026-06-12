import pandas as pd

def ingest_data(filepath, delimiter=","):
    """
    Load data from a CSV file with encoding fallback.
    """

    encodings = [
        "utf-8",
        "latin-1",
        "iso-8859-1",
        "cp1252"
    ]

    for encoding in encodings:
        try:
            df = pd.read_csv(
                filepath,
                delimiter=delimiter,
                encoding=encoding
            )

            print(f"Loaded file: {filepath}")
            print(f"Delimiter: {delimiter}")
            print(f"Encoding used: {encoding}")
            print(
                f"Rows: {df.shape[0]}, "
                f"Columns: {df.shape[1]}"
            )

            return df

        except UnicodeDecodeError:
            continue

    raise ValueError(
        "Could not load file with any supported encoding."
    )

def document_ingestion(df, source):
    """
    Print ingestion audit information.
    """

    print("\nINGESTION REPORT")
    print(f"Source: {source}")
    print(f"Rows: {df.shape[0]}")
    print(f"Columns: {df.shape[1]}")

    print("\nColumn Types:")
    print(df.dtypes)

    print("\nFirst 3 Rows:")
    print(df.head(3))

def profile_nulls_and_duplicates(df):
    """
    Profile null values and duplicate records.
    """

    print("\nDATA QUALITY PROFILE")

    for col in df.columns:
        null_count = df[col].isnull().sum()
        null_pct = (null_count / len(df)) * 100

        print(
            f"{col}: "
            f"Nulls={null_count}, "
            f"Null %={null_pct:.2f}"
        )

    duplicate_count = df.duplicated().sum()

    print(
        f"\nExact Duplicate Rows: "
        f"{duplicate_count}"
    )

def profile_numerical(df):
    """
    Profile numerical columns.
    """

    print("\nNUMERICAL PROFILE")

    numeric_columns = df.select_dtypes(
        include=["number"]
    ).columns

    for col in numeric_columns:
        print(f"\nColumn: {col}")
        print(f"Min: {df[col].min()}")
        print(f"Max: {df[col].max()}")
        print(f"Mean: {df[col].mean():.2f}")
        print(f"Median: {df[col].median()}")

        
def identify_issues(df, null_threshold=30, dup_threshold=5):
    """
    Identify potential data quality issues.
    """

    print("\nQUALITY ISSUES")

    issues_found = False

    for col in df.columns:
        null_pct = (
            df[col].isnull().sum() / len(df)
        ) * 100

        if null_pct > null_threshold:
            print(
                f"High null percentage in "
                f"{col}: {null_pct:.2f}%"
            )
            issues_found = True

    duplicate_pct = (
        df.duplicated().sum() / len(df)
    ) * 100

    if duplicate_pct > dup_threshold:
        print(
            f"High duplicate percentage: "
            f"{duplicate_pct:.2f}%"
        )
        issues_found = True

    if not issues_found:
        print("No major quality issues detected.")

def process_data(df):
    """
    Clean and transform data.

    Input:
        Raw DataFrame

    Returns:
        Processed DataFrame
    """

    df = df.drop_duplicates()

    cancellation_rate = (
        df["cancelled"].sum() / len(df)
    ) * 100

    df["cancellation_rate"] = cancellation_rate

    return df


def output_results(df, output_path):
    """
    Save processed data.

    Input:
        DataFrame and output path

    Returns:
        None
    """

    df.to_csv(output_path, index=False)

    print("Data successfully processed")
    print(f"Rows processed: {len(df)}")
    print(f"Output saved to {output_path}")


if __name__ == "__main__":

    data = ingest_data(
        "data/raw/sample.csv",
        delimiter=","
    )

    document_ingestion(
        data,
        "data/raw/sample.csv"
    )

    profile_nulls_and_duplicates(data)

    profile_numerical(data)

    identify_issues(data)

    processed = process_data(data)

    output_results(
        processed,
        "output/processed.csv"
    )