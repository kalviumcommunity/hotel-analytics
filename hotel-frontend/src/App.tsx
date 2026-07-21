import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import DashboardPage from "@/pages/Dashboard";
import RevenuePage from "@/pages/Revenue";
import BookingsPage from "@/pages/Bookings";
import CustomersPage from "@/pages/Customers";
import ChurnPage from "@/pages/Churn";
import ReportsPage from "@/pages/Reports";
import DataQualityPage from "@/pages/DataQuality";

/**
 * All page routes are nested under AppShell, which renders the persistent
 * sidebar + topbar and puts the matched page into its <Outlet />.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/revenue" element={<RevenuePage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/churn" element={<ChurnPage />} />
        <Route path="/reports" element={<ReportsPage />} />
    <Route path="/data-quality" element={<DataQualityPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
