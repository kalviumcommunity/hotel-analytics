import { NavLink } from "react-router-dom";
import { BedDouble, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/data/nav";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

function Logo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-2 px-4 py-5">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary">
        <BedDouble size={16} className="text-primary-foreground" />
      </div>
      {!collapsed && (
        <span className="font-display font-semibold text-sm truncate">
          Meridian Analytics
        </span>
      )}
    </div>
  );
}

function NavLinks({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 px-2 flex flex-col gap-0.5">
      {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )
          }
        >
          <Icon size={17} className="shrink-0" />
          {!collapsed && <span className="truncate">{label}</span>}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar — in document flow, collapses width */}
      <aside
        className={cn(
          "hidden md:flex flex-col shrink-0 border-r bg-card transition-[width] duration-200",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <Logo collapsed={collapsed} />
        <NavLinks collapsed={collapsed} />
      </aside>

      {/* Mobile sidebar — fixed overlay, slides in */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-50 transition-opacity",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className="absolute inset-0 bg-foreground/30"
          onClick={onCloseMobile}
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 w-64 bg-card border-r flex flex-col transition-transform duration-200",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between">
            <Logo collapsed={false} />
            <button
              onClick={onCloseMobile}
              aria-label="Close menu"
              className="mr-3 p-2 rounded-lg text-muted-foreground hover:bg-muted"
            >
              <X size={18} />
            </button>
          </div>
          <NavLinks collapsed={false} onNavigate={onCloseMobile} />
        </aside>
      </div>
    </>
  );
}
