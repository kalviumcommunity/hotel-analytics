import { motion } from "framer-motion";
import { Users, Wallet, Repeat, CalendarClock } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts";

const segmentData = [
  { segment: "B2B", customers: 320, spend: 480000 },
  { segment: "SMB", customers: 510, spend: 370000 },
  { segment: "Leisure", customers: 760, spend: 290000 },
];

const retentionData = [
  { month: "Jan", retained: 72 },
  { month: "Feb", retained: 74 },
  { month: "Mar", retained: 77 },
  { month: "Apr", retained: 79 },
  { month: "May", retained: 81 },
  { month: "Jun", retained: 83 },
];

const customers = [
  { name: "Alicia Chen", segment: "B2B", spend: "$18.2k", visits: 12, retained: "Yes" },
  { name: "Noah Patel", segment: "SMB", spend: "$12.4k", visits: 8, retained: "Yes" },
  { name: "Mina Alvarez", segment: "Leisure", spend: "$9.8k", visits: 6, retained: "No" },
];

export default function CustomersShell() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <h1 className="text-2xl font-semibold tracking-tight">Customer segmentation</h1>
        <p className="text-sm text-muted-foreground">Understand customer value, retention, and booking behavior by segment.</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Active customers" value="1,590" change="+5.1%" changeType="positive" icon={<Users className="h-5 w-5" />} />
        <KpiCard title="Avg. spend" value="$11.8k" change="+3.4%" changeType="positive" icon={<Wallet className="h-5 w-5" />} />
        <KpiCard title="Retention" value="83%" change="Improving" changeType="positive" icon={<Repeat className="h-5 w-5" />} />
        <KpiCard title="Booking frequency" value="6.1x" change="Steady" changeType="neutral" icon={<CalendarClock className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard title="Customers by segment" description="Volume and spend by customer segment.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={segmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="segment" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="customers" fill="#4F46E5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <Card>
          <CardHeader>
            <CardTitle>Segment highlights</CardTitle>
            <CardDescription>Most valuable cohorts and their habits.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-border p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Leisure segment</p>
                <Badge variant="secondary">Largest base</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Highest volume and strong repeat potential.</p>
            </div>
            <div className="rounded-xl border border-border p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">B2B segment</p>
                <Badge variant="success">Highest spend</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Most valuable accounts with premium booking behavior.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ChartCard title="Retention trend" description="Retention improvement over recent months.">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="retained" stroke="#10B981" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <Card>
        <CardHeader>
          <CardTitle>Customer table</CardTitle>
          <CardDescription>Representative customers from key segments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead>Spend</TableHead>
                <TableHead>Visits</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.name}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.segment}</TableCell>
                  <TableCell>{customer.spend}</TableCell>
                  <TableCell>{customer.visits}</TableCell>
                  <TableCell>
                    <Badge variant={customer.retained === "Yes" ? "success" : "warning"}>{customer.retained}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
