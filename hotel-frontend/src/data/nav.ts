import {
  LayoutDashboard,
  TrendingUp,
  CalendarRange,
  Users,
  AlertTriangle,
  FileText,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Revenue analytics", path: "/revenue", icon: TrendingUp },
  { label: "Booking trends", path: "/bookings", icon: CalendarRange },
  { label: "Customer segments", path: "/customers", icon: Users },
  { label: "Churn analysis", path: "/churn", icon: AlertTriangle },
  { label: "Reports", path: "/reports", icon: FileText },
  { label: "Data quality", path: "/data-quality", icon: ShieldCheck },
];
