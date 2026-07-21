import { motion } from "framer-motion";
import { CalendarDays, TrendingUp, BedDouble, Clock3 } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const dailySeries = [
  { day: "Mon", bookings: 138 },
  { day: "Tue", bookings: 156 },
  { day: "Wed", bookings: 172 },
  { day: "Thu", bookings: 188 },
  { day: "Fri", bookings: 221 },
  { day: "Sat", bookings: 244 },
  { day: "Sun", bookings: 214 },
];

const monthlySeries = [
  { month: "Jan", bookings: 910 },
  { month: "Feb", bookings: 956 },
  { month: "Mar", bookings: 1020 },
  { month: "Apr", bookings: 1088 },
  { month: "May", bookings: 1165 },
  { month: "Jun", bookings: 1240 },
];

const demandMix = [
  { name: "Weekend", value: 58, color: "#4F46E5" },
  { name: "Weekday", value: 42, color: "#10B981" },
];

export default function BookingsShell() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <h1 className="text-2xl font-semibold tracking-tight">Booking trends</h1>
        <p className="text-sm text-muted-foreground">Track booking activity, seasonal demand, and peak stay patterns.</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Total bookings" value="1,284" change="+8.7% this week" changeType="positive" icon={<CalendarDays className="h-5 w-5" />} />
        <KpiCard title="Peak day" value="Saturday" change="244 bookings" changeType="neutral" icon={<TrendingUp className="h-5 w-5" />} />
        <KpiCard title="Occupancy window" value="Fri–Sun" change="Best demand" changeType="positive" icon={<BedDouble className="h-5 w-5" />} />
        <KpiCard title="Avg. lead time" value="3.2 days" change="+0.4 days" changeType="neutral" icon={<Clock3 className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartCard title="Daily bookings" description="Short-term booking volume by day of week.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="bookings" radius={[8, 8, 0, 0]} fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Weekend vs weekday" description="Demand split across the calendar.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={demandMix} dataKey="value" innerRadius={70} outerRadius={110} paddingAngle={3}>
                  {demandMix.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Monthly bookings" description="Momentum across the last six months.">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlySeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="bookings" stroke="#10B981" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <Card>
        <CardHeader>
          <CardTitle>Peak booking periods</CardTitle>
          <CardDescription>High-demand windows to prioritize pricing and staffing.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-border p-3">
            <p className="text-sm font-medium">Friday evening</p>
            <p className="mt-1 text-sm text-muted-foreground">Strongest late-week demand and premium ADR.</p>
          </div>
          <div className="rounded-xl border border-border p-3">
            <p className="text-sm font-medium">Summer shoulder</p>
            <p className="mt-1 text-sm text-muted-foreground">Steady booking growth with lower volatility.</p>
          </div>
          <div className="rounded-xl border border-border p-3">
            <p className="text-sm font-medium">Holiday weekends</p>
            <p className="mt-1 text-sm text-muted-foreground">Highest conversion and absolute booking volume.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
