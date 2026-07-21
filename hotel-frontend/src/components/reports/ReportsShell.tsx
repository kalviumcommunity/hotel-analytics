import { motion } from "framer-motion";
import { FileText, Download, Search, Filter } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const reports = [
  { title: "Revenue performance", type: "Executive", updated: "2h ago", status: "Ready" },
  { title: "Occupancy outlook", type: "Ops", updated: "4h ago", status: "Ready" },
  { title: "Churn review", type: "Risk", updated: "Yesterday", status: "Queued" },
];

export default function ReportsShell() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <h1 className="text-2xl font-semibold tracking-tight">Reports module</h1>
        <p className="text-sm text-muted-foreground">Browse, preview, and export hotel analytics reports.</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Reports" value="24" change="Updated today" changeType="positive" icon={<FileText className="h-5 w-5" />} />
        <KpiCard title="Exports" value="182" change="This month" changeType="positive" icon={<Download className="h-5 w-5" />} />
        <KpiCard title="Pending" value="3" change="Queued" changeType="neutral" icon={<Filter className="h-5 w-5" />} />
        <KpiCard title="Search" value="Live" change="Fast filtering" changeType="neutral" icon={<Search className="h-5 w-5" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report listing</CardTitle>
          <CardDescription>Use the search and filter controls to find the right report quickly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <Input placeholder="Search reports" className="max-w-sm" />
            <Button variant="outline">Filter</Button>
            <Button>Export selected</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.title}>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{report.updated}</TableCell>
                  <TableCell>
                    <Badge variant={report.status === "Ready" ? "success" : "warning"}>{report.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">Preview</Button>
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
