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

    processed = process_data(data)

    output_results(
        processed,
        "output/processed.csv"
    )