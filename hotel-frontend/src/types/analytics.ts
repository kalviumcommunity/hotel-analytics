export interface KpiMetric {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

export interface DashboardData {
  kpis: KpiMetric[];
  revenueSeries: Array<{ month: string; revenue: number; target: number }>;
  bookingMix: Array<{ name: string; value: number; color: string }>;
  occupancyData: Array<{ name: string; occupied: number }>;
  cancellationMetrics: Array<{ label: string; value: number; color: string }>;
  customerSummary: Array<{ label: string; value: string; badge: string }>;
}

export interface RevenueData {
  kpis: KpiMetric[];
  revenueSeries: Array<{ month: string; revenue: number }>;
  seasonData: Array<{ name: string; value: number; color: string }>;
  segmentBreakdown: Array<{ segment: string; revenue: number }>;
  insights: Array<{ title: string; value: string; detail: string }>;
}

export interface BookingsData {
  kpis: KpiMetric[];
  dailySeries: Array<{ day: string; bookings: number }>;
  monthlySeries: Array<{ month: string; bookings: number }>;
  demandMix: Array<{ name: string; value: number; color: string }>;
  peakPeriods: Array<{ title: string; detail: string }>;
}

export interface CustomersData {
  kpis: KpiMetric[];
  segmentData: Array<{ segment: string; customers: number; spend: number }>;
  retentionData: Array<{ month: string; retained: number }>;
  customers: Array<{ name: string; segment: string; spend: string; visits: number; retained: string }>;
}

export interface ChurnData {
  kpis: KpiMetric[];
  riskData: Array<{ name: string; risk: number; spend: number }>;
  factors: Array<{ factor: string; value: number }>;
  highRisk: Array<{ name: string; risk: string; lastStay: string }>;
}

export interface ReportsData {
  kpis: KpiMetric[];
  reports: Array<{ title: string; type: string; updated: string; status: string }>;
}

export interface DataQualityData {
  qualityScore: number;
  missingValues: Array<{ name: string; missing: number; severity: string }>;
  duplicateRecords: Array<{ name: string; count: number }>;
  validationReports: Array<{ label: string; count: number }>;
  auditTimeline: Array<{ title: string; detail: string }>;
  healthIndicators: Array<{ label: string; value: string; status: string }>;
}
