import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface KpiCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
}

export function KpiCard({ title, value, change, changeType = "neutral", icon }: KpiCardProps) {
  const isPositive = changeType === "positive";
  const isNegative = changeType === "negative";

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Card className="h-full">
        <CardContent className="flex items-start justify-between gap-3 px-5 py-5">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
            {change ? (
              <Badge variant={isPositive ? "success" : isNegative ? "destructive" : "secondary"} className="mt-3">
                {isPositive ? <ArrowUpRight className="mr-1 h-3.5 w-3.5" /> : isNegative ? <ArrowDownRight className="mr-1 h-3.5 w-3.5" /> : null}
                {change}
              </Badge>
            ) : null}
          </div>
          {icon ? <div className="rounded-2xl bg-primary/10 p-3 text-primary">{icon}</div> : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}
