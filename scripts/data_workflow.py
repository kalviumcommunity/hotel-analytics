import pandas as pd

def ingest_data(filepath):
    """
    Load data from a CSV file.

    Input:
        filepath - path to CSV file

    Returns:
        Pandas DataFrame
    """
    df = pd.read_csv(filepath)
    return df


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

    data = ingest_data("data/raw/sample.csv")

    processed = process_data(data)

    output_results(
        processed,
        "output/processed.csv"
    )