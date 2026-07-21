import type { DashboardData, RevenueData, BookingsData, CustomersData, ChurnData, ReportsData, DataQualityData } from "@/types/analytics";

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const mockDashboardData: DashboardData = {
  kpis: [
    { title: "Revenue", value: "$1.24M", change: "+12.4% vs last month", changeType: "positive" },
    { title: "Occupancy", value: "84.2%", change: "+3.1% vs target", changeType: "positive" },
    { title: "Bookings", value: "1,284", change: "+8.7% this week", changeType: "positive" },
    { title: "Customers", value: "8,942", change: "-1.2% churn risk", changeType: "neutral" },
  ],
  revenueSeries: [
    { month: "Jan", revenue: 180000, target: 160000 },
    { month: "Feb", revenue: 195000, target: 170000 },
    { month: "Mar", revenue: 210000, target: 190000 },
    { month: "Apr", revenue: 232000, target: 205000 },
    { month: "May", revenue: 248000, target: 220000 },
    { month: "Jun", revenue: 268000, target: 230000 },
  ],
  bookingMix: [
    { name: "Direct", value: 42, color: "#4F46E5" },
    { name: "OTA", value: 31, color: "#10B981" },
    { name: "Corporate", value: 27, color: "#F59E0B" },
  ],
  occupancyData: [
    { name: "Mon", occupied: 72 },
    { name: "Tue", occupied: 78 },
    { name: "Wed", occupied: 81 },
    { name: "Thu", occupied: 86 },
    { name: "Fri", occupied: 91 },
    { name: "Sat", occupied: 95 },
    { name: "Sun", occupied: 89 },
  ],
  cancellationMetrics: [
    { label: "Weekend cancellations", value: 74, color: "#F59E0B" },
    { label: "Refund compliance", value: 92, color: "#10B981" },
    { label: "Recovery rate", value: 68, color: "#4F46E5" },
  ],
  customerSummary: [
    { label: "Repeat guests", value: "61%", badge: "+9.3%" },
    { label: "High-value accounts", value: "184", badge: "Priority" },
    { label: "At-risk customers", value: "12", badge: "Watchlist" },
  ],
};

const mockRevenueData: RevenueData = {
  kpis: [
    { title: "Net revenue", value: "$1.24M", change: "+12.4%", changeType: "positive" },
    { title: "ADR", value: "$241", change: "+4.1%", changeType: "positive" },
    { title: "RevPAR", value: "$203", change: "+6.2%", changeType: "positive" },
    { title: "Seasonal lift", value: "18.6%", change: "Peak", changeType: "neutral" },
  ],
  revenueSeries: [
    { month: "Jan", revenue: 180000 },
    { month: "Feb", revenue: 195000 },
    { month: "Mar", revenue: 210000 },
    { month: "Apr", revenue: 232000 },
    { month: "May", revenue: 248000 },
    { month: "Jun", revenue: 268000 },
  ],
  seasonData: [
    { name: "Peak", value: 38, color: "#4F46E5" },
    { name: "Shoulder", value: 34, color: "#10B981" },
    { name: "Low", value: 28, color: "#F59E0B" },
  ],
  segmentBreakdown: [
    { segment: "B2B", revenue: 420000 },
    { segment: "SMB", revenue: 310000 },
    { segment: "Leisure", revenue: 286000 },
  ],
  insights: [
    { title: "Peak season lift", value: "+18.6%", detail: "Strongest months concentrated in the summer shoulder period." },
    { title: "B2B accounts", value: "Highest", detail: "Corporate accounts contribute the largest share of net revenue." },
    { title: "Distribution", value: "Balanced", detail: "Revenue is spread across segments, reducing concentration risk." },
  ],
};

const mockBookingsData: BookingsData = {
  kpis: [
    { title: "Total bookings", value: "1,284", change: "+8.7%", changeType: "positive" },
    { title: "Peak day", value: "Saturday", change: "244 bookings", changeType: "neutral" },
    { title: "Occupancy window", value: "Fri–Sun", change: "Best demand", changeType: "positive" },
    { title: "Avg. lead time", value: "3.2 days", change: "+0.4 days", changeType: "neutral" },
  ],
  dailySeries: [
    { day: "Mon", bookings: 138 },
    { day: "Tue", bookings: 156 },
    { day: "Wed", bookings: 172 },
    { day: "Thu", bookings: 188 },
    { day: "Fri", bookings: 221 },
    { day: "Sat", bookings: 244 },
    { day: "Sun", bookings: 214 },
  ],
  monthlySeries: [
    { month: "Jan", bookings: 910 },
    { month: "Feb", bookings: 956 },
    { month: "Mar", bookings: 1020 },
    { month: "Apr", bookings: 1088 },
    { month: "May", bookings: 1165 },
    { month: "Jun", bookings: 1240 },
  ],
  demandMix: [
    { name: "Weekend", value: 58, color: "#4F46E5" },
    { name: "Weekday", value: 42, color: "#10B981" },
  ],
  peakPeriods: [
    { title: "Friday evening", detail: "Strongest late-week demand and premium ADR." },
    { title: "Summer shoulder", detail: "Steady booking growth with lower volatility." },
    { title: "Holiday weekends", detail: "Highest conversion and absolute booking volume." },
  ],
};

const mockCustomersData: CustomersData = {
  kpis: [
    { title: "Active customers", value: "1,590", change: "+5.1%", changeType: "positive" },
    { title: "Avg. spend", value: "$11.8k", change: "+3.4%", changeType: "positive" },
    { title: "Retention", value: "83%", change: "Improving", changeType: "positive" },
    { title: "Booking frequency", value: "6.1x", change: "Steady", changeType: "neutral" },
  ],
  segmentData: [
    { segment: "B2B", customers: 320, spend: 480000 },
    { segment: "SMB", customers: 510, spend: 370000 },
    { segment: "Leisure", customers: 760, spend: 290000 },
  ],
  retentionData: [
    { month: "Jan", retained: 72 },
    { month: "Feb", retained: 74 },
    { month: "Mar", retained: 77 },
    { month: "Apr", retained: 79 },
    { month: "May", retained: 81 },
    { month: "Jun", retained: 83 },
  ],
  customers: [
    { name: "Alicia Chen", segment: "B2B", spend: "$18.2k", visits: 12, retained: "Yes" },
    { name: "Noah Patel", segment: "SMB", spend: "$12.4k", visits: 8, retained: "Yes" },
    { name: "Mina Alvarez", segment: "Leisure", spend: "$9.8k", visits: 6, retained: "No" },
  ],
};

const mockChurnData: ChurnData = {
  kpis: [
    { title: "At-risk customers", value: "124", change: "+6.2%", changeType: "negative" },
    { title: "Risk score", value: "68/100", change: "Elevated", changeType: "neutral" },
    { title: "Recent drop", value: "-11%", change: "Spend decline", changeType: "negative" },
    { title: "Signals", value: "4", change: "Strong factors", changeType: "neutral" },
  ],
  riskData: [
    { name: "Alicia", risk: 82, spend: 18200 },
    { name: "Noah", risk: 68, spend: 12400 },
    { name: "Mina", risk: 74, spend: 9800 },
    { name: "Jules", risk: 58, spend: 15400 },
  ],
  factors: [
    { factor: "Low recent activity", value: 36 },
    { factor: "Cancellation rate", value: 24 },
    { factor: "Declining spend", value: 19 },
    { factor: "Support volume", value: 21 },
  ],
  highRisk: [
    { name: "Mina Alvarez", risk: "High", lastStay: "14 days ago" },
    { name: "Noah Patel", risk: "Medium", lastStay: "22 days ago" },
    { name: "Evan Brooks", risk: "High", lastStay: "17 days ago" },
  ],
};

const mockReportsData: ReportsData = {
  kpis: [
    { title: "Reports", value: "24", change: "Updated today", changeType: "positive" },
    { title: "Exports", value: "182", change: "This month", changeType: "positive" },
    { title: "Pending", value: "3", change: "Queued", changeType: "neutral" },
    { title: "Search", value: "Live", change: "Fast filtering", changeType: "neutral" },
  ],
  reports: [
    { title: "Revenue performance", type: "Executive", updated: "2h ago", status: "Ready" },
    { title: "Occupancy outlook", type: "Ops", updated: "4h ago", status: "Ready" },
    { title: "Churn review", type: "Risk", updated: "Yesterday", status: "Queued" },
  ],
};

const mockDataQualityData: DataQualityData = {
  qualityScore: 92,
  missingValues: [
    { name: "Email", missing: 6, severity: "Low" },
    { name: "Phone", missing: 14, severity: "Medium" },
    { name: "Loyalty tier", missing: 3, severity: "Low" },
  ],
  duplicateRecords: [
    { name: "Guest profiles", count: 11 },
    { name: "Reservations", count: 4 },
  ],
  validationReports: [
    { label: "Passed checks", count: 1843 },
    { label: "Failed checks", count: 27 },
  ],
  auditTimeline: [
    { title: "Schema validation", detail: "Completed 08:10" },
    { title: "Deduplication run", detail: "Completed 09:22" },
    { title: "Imputation review", detail: "Completed 11:05" },
  ],
  healthIndicators: [
    { label: "Integrity", value: "Healthy", status: "Good" },
    { label: "Coverage", value: "94%", status: "Good" },
    { label: "Freshness", value: "Updated", status: "Good" },
  ],
};

export async function getDashboardData(): Promise<DashboardData> {
  await delay(250);
  return mockDashboardData;
}

export async function getRevenueData(): Promise<RevenueData> {
  await delay(250);
  return mockRevenueData;
}

export async function getBookingsData(): Promise<BookingsData> {
  await delay(250);
  return mockBookingsData;
}

export async function getCustomersData(): Promise<CustomersData> {
  await delay(250);
  return mockCustomersData;
}

export async function getChurnData(): Promise<ChurnData> {
  await delay(250);
  return mockChurnData;
}

export async function getReportsData(): Promise<ReportsData> {
  await delay(250);
  return mockReportsData;
}

export async function getDataQualityData(): Promise<DataQualityData> {
  await delay(250);
  return mockDataQualityData;
}
