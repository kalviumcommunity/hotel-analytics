import os
import sys
import pandas as pd
import matplotlib.pyplot as plt
from scipy import stats


def main():
    src = os.path.join("output", "feature_engineered_data.csv")
    if not os.path.exists(src):
        print(f"Data file not found: {src}")
        sys.exit(1)

    df = pd.read_csv(src)
    if "revenue" not in df.columns:
        print("Column 'revenue' not found in the data.")
        sys.exit(1)

    revenue = pd.to_numeric(df["revenue"], errors="coerce").dropna()

    # Compute skewness and kurtosis (both Fisher and Pearson forms)
    skewness = float(stats.skew(revenue))
    kurt_fisher = float(stats.kurtosis(revenue, fisher=True))
    kurt_pearson = float(stats.kurtosis(revenue, fisher=False))

    # Create output folder if missing
    out_dir = "output"
    os.makedirs(out_dir, exist_ok=True)

    # Task 1: Distribution plots (histogram + KDE)
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    axes[0].hist(revenue, bins=50, edgecolor="black")
    axes[0].set_title("Revenue Distribution (Histogram)")
    axes[0].set_xlabel("Revenue")

    revenue.plot(kind="density", ax=axes[1])
    axes[1].set_title("Revenue Distribution (KDE)")

    plt.tight_layout()
    dist_path = os.path.join(out_dir, "revenue_distribution.png")
    fig.savefig(dist_path)
    plt.close(fig)

    # Task 3: Percentiles and abnormal patterns
    percentiles = revenue.quantile([0.25, 0.5, 0.75, 0.9, 0.95, 0.99]).to_dict()
    gap_75_90 = percentiles[0.9] - percentiles[0.75]

    # Task 4: Compare segments (high vs low)
    q25 = percentiles[0.25]
    q75 = percentiles[0.75]
    high_value = revenue[revenue > q75]
    low_value = revenue[revenue < q25]

    fig2, ax2 = plt.subplots(1, 1, figsize=(8, 5))
    ax2.hist(high_value, bins=30, alpha=0.7, label="High-Value")
    ax2.hist(low_value, bins=30, alpha=0.7, label="Low-Value")
    ax2.legend()
    ax2.set_title("Revenue: High vs Low Value Customers")
    seg_path = os.path.join(out_dir, "segment_comparison.png")
    fig2.savefig(seg_path)
    plt.close(fig2)

    hv_mean, hv_median = high_value.mean(), high_value.median()
    lv_mean, lv_median = low_value.mean(), low_value.median()

    # Top 1% and max
    top_1_pct = revenue.quantile(0.99)
    maximum = revenue.max()

    # Task 5: Business interpretation (short report)
    interpretation = []
    interpretation.append("Revenue Distribution Analysis:")
    interpretation.append(f"Skewness: {skewness:.2f}")
    interpretation.append(
        f"Kurtosis (Fisher): {kurt_fisher:.2f} (normal=0). Pearson: {kurt_pearson:.2f} (normal=3)"
    )
    interpretation.append(f"Mean: ${revenue.mean():.0f}")
    interpretation.append(f"Median: ${revenue.median():.0f}")
    interpretation.append(f"Max: ${maximum:.0f}")
    interpretation.append(f"Top 1% threshold: ${top_1_pct:.0f}")
    interpretation.append("")

    if abs(skewness) > 1:
        interpretation.append("Interpretation: Highly right-skewed — mean inflated by few large customers.")
        interpretation.append("Business action: Segment small vs enterprise accounts; use median for central tendency.")
    else:
        interpretation.append("Interpretation: Distribution reasonably symmetric.")
        interpretation.append("Business action: Uniform customer strategy may be acceptable.")

    if kurt_pearson > 3:
        interpretation.append("Kurtosis note: Heavy tails detected — expect outliers.")

    interpretation.append("")
    interpretation.append("Percentiles:")
    for p, v in percentiles.items():
        interpretation.append(f"  {int(p*100)}%: ${v:.0f}")

    interpretation.append("")
    interpretation.append("Segment comparison:")
    interpretation.append(f"  High-value count: {len(high_value)}; mean=${hv_mean:.0f}; median=${hv_median:.0f}")
    interpretation.append(f"  Low-value count: {len(low_value)}; mean=${lv_mean:.0f}; median=${lv_median:.0f}")
    interpretation.append(f"  Gap between 75% and 90%: ${gap_75_90:.0f}")

    report_path = os.path.join(out_dir, "revenue_report.txt")
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("\n".join(interpretation))

    # Also print a short summary to stdout
    print("Written:")
    print(f" - Distribution plot: {dist_path}")
    print(f" - Segment plot: {seg_path}")
    print(f" - Report: {report_path}")


if __name__ == "__main__":
    main()
