import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Percent, CalendarRange } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const revenueSeries = [
  { month: "Jan", revenue: 180000 },
  { month: "Feb", revenue: 195000 },
  { month: "Mar", revenue: 210000 },
  { month: "Apr", revenue: 232000 },
  { month: "May", revenue: 248000 },
  { month: "Jun", revenue: 268000 },
];

const monthlyMix = [
  { name: "Peak", value: 38, color: "#4F46E5" },
  { name: "Shoulder", value: 34, color: "#10B981" },
  { name: "Low", value: 28, color: "#F59E0B" },
];

const segmentBreakdown = [
  { segment: "B2B", revenue: 420000 },
  { segment: "SMB", revenue: 310000 },
  { segment: "Leisure", revenue: 286000 },
];

export default function RevenueShell() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <h1 className="text-2xl font-semibold tracking-tight">Revenue analytics</h1>
        <p className="text-sm text-muted-foreground">A focused view of revenue momentum, seasonal mix, and segment profitability.</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Net revenue" value="$1.24M" change="+12.4% vs last month" changeType="positive" icon={<DollarSign className="h-5 w-5" />} />
        <KpiCard title="Avg. daily rate" value="$241" change="+4.1%" changeType="positive" icon={<TrendingUp className="h-5 w-5" />} />
        <KpiCard title="RevPAR" value="$203" change="+6.2%" changeType="positive" icon={<Percent className="h-5 w-5" />} />
        <KpiCard title="Seasonal lift" value="18.6%" change="High demand" changeType="neutral" icon={<CalendarRange className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <ChartCard title="Revenue over time" description="Revenue trajectory across the last six months.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries}>
                <defs>
                  <linearGradient id="revenueFill2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#4F46E5" fill="url(#revenueFill2)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Revenue by season" description="Demand concentration by seasonal bucket.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={monthlyMix} dataKey="value" innerRadius={70} outerRadius={110} paddingAngle={3}>
                  {monthlyMix.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <ChartCard title="Revenue by customer segment" description="Profitable segments and their contribution.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={segmentBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="segment" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="revenue" radius={[8, 8, 0, 0]} fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <Card>
          <CardHeader>
            <CardTitle>Revenue insights</CardTitle>
            <CardDescription>Quick takeaways from the latest data slice.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-border p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Peak season lift</p>
                <Badge variant="success">+18.6%</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">The strongest months are concentrated in the summer shoulder period.</p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">B2B accounts</p>
                <Badge variant="secondary">Highest value</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Corporate accounts contribute the largest share of net revenue.</p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Distribution</p>
                <Badge variant="warning">Balanced</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Revenue is spread across segments, reducing concentration risk.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
