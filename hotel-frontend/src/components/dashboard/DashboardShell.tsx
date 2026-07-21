import { motion } from "framer-motion";
import { DollarSign, CalendarDays, BedDouble, Users } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const kpis = [
  { title: "Revenue", value: "$1.24M", change: "+12.4% vs last month", changeType: "positive" as const, icon: <DollarSign className="h-5 w-5" /> },
  { title: "Occupancy", value: "84.2%", change: "+3.1% vs target", changeType: "positive" as const, icon: <BedDouble className="h-5 w-5" /> },
  { title: "Bookings", value: "1,284", change: "+8.7% this week", changeType: "positive" as const, icon: <CalendarDays className="h-5 w-5" /> },
  { title: "Customers", value: "8,942", change: "-1.2% churn risk", changeType: "neutral" as const, icon: <Users className="h-5 w-5" /> },
];

const revenueSeries = [
  { month: "Jan", revenue: 180000, target: 160000 },
  { month: "Feb", revenue: 195000, target: 170000 },
  { month: "Mar", revenue: 210000, target: 190000 },
  { month: "Apr", revenue: 232000, target: 205000 },
  { month: "May", revenue: 248000, target: 220000 },
  { month: "Jun", revenue: 268000, target: 230000 },
];

const bookingMix = [
  { name: "Direct", value: 42, color: "#4F46E5" },
  { name: "OTA", value: 31, color: "#10B981" },
  { name: "Corporate", value: 27, color: "#F59E0B" },
];

const occupancyData = [
  { name: "Mon", occupied: 72 },
  { name: "Tue", occupied: 78 },
  { name: "Wed", occupied: 81 },
  { name: "Thu", occupied: 86 },
  { name: "Fri", occupied: 91 },
  { name: "Sat", occupied: 95 },
  { name: "Sun", occupied: 89 },
];

export default function DashboardShell() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Hotel Revenue Analytics</h1>
        <p className="text-sm text-muted-foreground">A polished, data-first overview of revenue, bookings, occupancy, and customer performance.</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <ChartCard title="Revenue overview" description="Rolling performance compared with target plan.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#4F46E5" fill="url(#revenueFill)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="target" stroke="#10B981" strokeDasharray="5 5" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Booking mix" description="Distribution of bookings by acquisition channel.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bookingMix} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={2}>
                  {bookingMix.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ChartCard title="Occupancy metrics" description="Weekday booking pressure by day of week.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="occupied" radius={[8, 8, 0, 0]} fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cancellation metrics</CardTitle>
              <CardDescription>Risk remains controlled, but weekend cancellations need attention.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Weekend cancellation rate</span>
                  <span className="font-semibold">14.8%</span>
                </div>
                <Progress value={74} indicatorClassName="bg-amber-500" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Refund compliance</span>
                  <span className="font-semibold">92%</span>
                </div>
                <Progress value={92} indicatorClassName="bg-emerald-500" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Customer recovery rate</span>
                  <span className="font-semibold">68%</span>
                </div>
                <Progress value={68} indicatorClassName="bg-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer summary</CardTitle>
              <CardDescription>Healthy mix across loyalty and transient guests.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm font-medium">Repeat guests</p>
                  <p className="text-xs text-muted-foreground">61% of total bookings</p>
                </div>
                <Badge variant="success">+9.3%</Badge>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm font-medium">High-value accounts</p>
                  <p className="text-xs text-muted-foreground">184 accounts above $10k annual spend</p>
                </div>
                <Badge variant="secondary">Priority</Badge>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm font-medium">At-risk customers</p>
                  <p className="text-xs text-muted-foreground">12 flagged for immediate outreach</p>
                </div>
                <Badge variant="warning">Watchlist</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
