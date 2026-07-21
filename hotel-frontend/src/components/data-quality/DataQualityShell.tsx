import { motion } from "framer-motion";
import { ShieldCheck, AlertCircle, SearchCheck, Activity } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDataQualityData } from "@/hooks/use-analytics-data";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function DataQualityShell() {
  const { data, loading, error } = useDataQualityData();

  if (loading) {
    return <div className="space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-24 w-full" /><Skeleton className="h-64 w-full" /></div>;
  }

  if (error || !data) {
    return <ErrorState title="Unable to load metrics" description={error ?? "Data quality metrics could not be loaded."} />;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <h1 className="text-2xl font-semibold tracking-tight">Data quality dashboard</h1>
        <p className="text-sm text-muted-foreground">Monitor completeness, validation quality, and audit health in one place.</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Quality score" value={`${data.qualityScore}%`} change="Healthy" changeType="positive" icon={<ShieldCheck className="h-5 w-5" />} />
        <KpiCard title="Missing values" value={`${data.missingValues.reduce((sum: number, item: { missing: number }) => sum + item.missing, 0)}`} change="Needs monitoring" changeType="neutral" icon={<AlertCircle className="h-5 w-5" />} />
        <KpiCard title="Validation" value={`${data.validationReports[0].count}`} change="Passed checks" changeType="positive" icon={<SearchCheck className="h-5 w-5" />} />
        <KpiCard title="Audit trail" value={`${data.auditTimeline.length}`} change="Latest runs" changeType="neutral" icon={<Activity className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard title="Data health indicators" description="Overall service health across quality dimensions.">
          <div className="space-y-4">
            {data.healthIndicators.map((item: { label: string; value: string; status: string }) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>{item.label}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
                <Progress value={item.status === "Good" ? 90 : 65} indicatorClassName="bg-emerald-500" />
              </div>
            ))}
          </div>
        </ChartCard>

        <Card>
          <CardHeader>
            <CardTitle>Missing values</CardTitle>
            <CardDescription>Highest severity gaps by field.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.missingValues.map((item: { name: string; missing: number; severity: string }) => (
              <div key={item.name} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{item.name}</p>
                  <Badge variant={item.severity === "Medium" ? "warning" : "secondary"}>{item.missing}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <ChartCard title="Validation reports" description="Pass and fail counts from the latest validation pass.">
        <div className="grid gap-4 md:grid-cols-2">
          {data.validationReports.map((item: { label: string; count: number }) => (
            <div key={item.label} className="rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold">{item.count}</p>
            </div>
          ))}
        </div>
      </ChartCard>

      <Card>
        <CardHeader>
          <CardTitle>Audit timeline</CardTitle>
          <CardDescription>Recent quality and governance events.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.auditTimeline.map((item: { title: string; detail: string }) => (
            <div key={item.title} className="rounded-xl border border-border p-3">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
