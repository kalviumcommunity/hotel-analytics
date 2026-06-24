# Missing Value Handling Report

## Dataset Overview

Rows: 6

Columns:
- booking_id
- customer_segment
- season
- room_nights
- cancelled

---

## Missing Values Before Treatment

| Column | Missing Values |
|----------|---------------|
| booking_id | 0 |
| customer_segment | 0 |
| season | 0 |
| room_nights | 0 |
| cancelled | 0 |

No missing values were found.

---

## Strategies

### booking_id
Strategy: Drop rows if null

Reason:
Primary identifiers cannot be imputed.

---

### room_nights
Strategy: Median

Reason:
Median is robust to outliers.

No imputation was required.

---

### customer_segment
Strategy: Mode

Reason:
Preserves category distribution.

No imputation was required.

---

### season
Strategy: Mode

Reason:
Maintains categorical consistency.

No imputation was required.

---

### cancelled
Strategy: No action required

Reason:
No missing values present.

---

## Missing Values After Treatment

| Column | Missing Values |
|----------|---------------|
| booking_id | 0 |
| customer_segment | 0 |
| season | 0 |
| room_nights | 0 |
| cancelled | 0 |

No rows were removed and no values were imputed.

---

## Conclusion

The dataset contained no missing values. Null-handling logic was implemented to ensure robustness for future datasets.