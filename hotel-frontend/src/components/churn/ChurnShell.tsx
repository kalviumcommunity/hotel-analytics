import { motion } from "framer-motion";
import { AlertTriangle, Gauge, TrendingDown, Sparkles } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, ScatterChart, Scatter, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";

const riskData = [
  { name: "Alicia", risk: 82, spend: 18200 },
  { name: "Noah", risk: 68, spend: 12400 },
  { name: "Mina", risk: 74, spend: 9800 },
  { name: "Jules", risk: 58, spend: 15400 },
];

const factors = [
  { factor: "Low recent activity", value: 36 },
  { factor: "Cancellation rate", value: 24 },
  { factor: "Declining spend", value: 19 },
  { factor: "Support volume", value: 21 },
];

const highRisk = [
  { name: "Mina Alvarez", risk: "High", lastStay: "14 days ago" },
  { name: "Noah Patel", risk: "Medium", lastStay: "22 days ago" },
  { name: "Evan Brooks", risk: "High", lastStay: "17 days ago" },
];

export default function ChurnShell() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <h1 className="text-2xl font-semibold tracking-tight">Churn analysis</h1>
        <p className="text-sm text-muted-foreground">Highlight at-risk customers and the strongest churn indicators.</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="At-risk customers" value="124" change="+6.2%" changeType="negative" icon={<AlertTriangle className="h-5 w-5" />} />
        <KpiCard title="Risk score" value="68/100" change="Elevated" changeType="neutral" icon={<Gauge className="h-5 w-5" />} />
        <KpiCard title="Recent drop" value="-11%" change="Spend decline" changeType="negative" icon={<TrendingDown className="h-5 w-5" />} />
        <KpiCard title="Signals" value="4" change="Strong factors" changeType="neutral" icon={<Sparkles className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard title="Risk gauge" description="Risk severity versus recent spending.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" dataKey="spend" name="Spend" tickLine={false} axisLine={false} />
                <YAxis type="number" dataKey="risk" name="Risk" tickLine={false} axisLine={false} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter data={riskData} fill="#F43F5E" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <Card>
          <CardHeader>
            <CardTitle>Top churn factors</CardTitle>
            <CardDescription>The clearest signals behind elevated churn risk.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {factors.map((item) => (
              <div key={item.factor} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{item.factor}</p>
                  <Badge variant="destructive">{item.value}%</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <ChartCard title="Correlation signals" description="Behavioral drivers of churn risk.">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={factors}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="factor" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#4F46E5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <Card>
        <CardHeader>
          <CardTitle>High-risk customer table</CardTitle>
          <CardDescription>Customers that need immediate intervention.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Risk level</TableHead>
                <TableHead>Last stay</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {highRisk.map((customer) => (
                <TableRow key={customer.name}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>
                    <Badge variant={customer.risk === "High" ? "destructive" : "warning"}>{customer.risk}</Badge>
                  </TableCell>
                  <TableCell>{customer.lastStay}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
