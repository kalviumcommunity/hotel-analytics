import pandas as pd


# Sample messy dataset
data = {
    "product": [" Electronics ", "electronics", "ELECTRONICS", " Product_C ", None],
    "segment": ["B2B", "b2b", "B 2 B", "business-to-business", " SME "],
    "location": ["São Paulo", "Montréal", " New York ", "Bengaluru!", None],
    "customer_name": [" JOHN ", "john", "John", " Alice ", "BOB"]
}

df = pd.DataFrame(data)

print("ORIGINAL DATA:\n")
print(df)


# =========================
# TASK 1 - Strip Whitespace
# =========================

def strip_all_strings(df):
    """Strip whitespace from all string columns."""
    string_cols = df.select_dtypes(include=['object']).columns
    total_fixed = 0

    print("\nTASK 1: STRIPPING WHITESPACE")

    for col in string_cols:
        before = df[col].nunique(dropna=True)

        # Count values with whitespace
        whitespace_count = df[col].dropna().str.contains(r'^\s+|\s+$').sum()
        total_fixed += whitespace_count

        # Apply strip
        df[col] = df[col].str.strip()

        after = df[col].nunique(dropna=True)

        print(f"{col}: {before} → {after} unique values")

    print("Total whitespace issues fixed:", total_fixed)
    return df


df = strip_all_strings(df)

print("\nValue counts after stripping:")
print(df["product"].value_counts())
print(df["customer_name"].value_counts())


# ==================================
# TASK 2 - Normalize Text Casing
# ==================================

def normalize_casing(df, columns_to_lower):
    """Normalize casing for specified columns."""
    print("\nTASK 2: NORMALIZING CASE")

    for col in columns_to_lower:
        df[col] = df[col].str.lower()
        print(f"Normalized {col} to lowercase")

    return df


print("\nBefore case normalization:")
print(df.head())

df = normalize_casing(df, ["product", "segment", "customer_name"])

print("\nAfter case normalization:")
print(df.head())

print("\nBusiness Decision: Using lowercase for consistency in analytics.")


# ==========================================
# TASK 3 - Remove Special Characters Regex
# ==========================================

def remove_special_characters(df, columns):
    """Remove special characters from specified columns."""
    print("\nTASK 3: REMOVING SPECIAL CHARACTERS")

    for col in columns:
        df[col] = df[col].str.replace('[^a-zA-Z0-9 ]', '', regex=True)
        print(f"Removed special characters from {col}")

    return df


print("\nBefore removing special chars:")
print(df[["location"]])

df = remove_special_characters(df, ["location", "product"])

print("\nAfter removing special chars:")
print(df[["location"]])

print("\nRegex Used: [^a-zA-Z0-9 ]")
print("Meaning: removes everything except letters, numbers and spaces")


# =================================================
# TASK 4 - Standardize Labels Using Mapping Dict
# =================================================

segment_map = {
    'b2b': 'B2B',
    'b 2 b': 'B2B',
    'business-to-business': 'B2B',
    'sme': 'SMB',
    'small medium enterprise': 'SMB',
    'enterprise': 'Enterprise'
}

print("\nTASK 4: CATEGORY STANDARDIZATION")

print("\nBefore mapping:")
print(df["segment"].value_counts())

df["segment"] = df["segment"].replace(segment_map)

print("\nAfter mapping:")
print(df["segment"].value_counts())

print("\nBusiness Decisions:")
print("Using B2B because CRM system uses uppercase labels")
print("Using SMB instead of SME for company standard")
print("Using Enterprise as final enterprise label")


# ==========================================
# TASK 5 - Reusable Cleaning Function
# ==========================================

def clean_text_column(series, lowercase=True, strip=True,
                      remove_special=False, mapping=None):
    """Reusable text cleaning function."""
    result = series.copy()

    # Handle null values
    if result.isna().any():
        print(f"Warning: {result.isna().sum()} null values found")

    if strip:
        result = result.str.strip()

    if lowercase:
        result = result.str.lower()

    if remove_special:
        result = result.str.replace('[^a-zA-Z0-9 ]', '', regex=True)

    if mapping:
        result = result.replace(mapping)

    return result


print("\nTASK 5: REUSABLE FUNCTION")

# Apply different parameter combinations
df["customer_name"] = clean_text_column(
    df["customer_name"],
    lowercase=True,
    strip=True
)

df["product"] = clean_text_column(
    df["product"],
    lowercase=True,
    strip=True,
    remove_special=True
)

df["segment"] = clean_text_column(
    df["segment"],
    lowercase=False,
    strip=True
)

print("\nFinal cleaned dataset:")
print(df)


# ==========================================
# EDGE CASE TESTING
# ==========================================

print("\nEDGE CASE TESTING")

test_cases = [
    '  Product A  ',
    'PRODUCT B',
    'Product_C',
    None,
    ''
]

test_series = pd.Series(test_cases)

result = clean_text_column(
    test_series,
    lowercase=True,
    strip=True,
    remove_special=True
)

print(result)