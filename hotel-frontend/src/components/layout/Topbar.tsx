import { useLocation } from "react-router-dom";
import { Menu, ChevronLeft, ChevronRight, Search, Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { NAV_ITEMS } from "@/data/nav";

interface TopbarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onOpenMobile: () => void;
}

export default function Topbar({ collapsed, onToggleCollapsed, onOpenMobile }: TopbarProps) {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const pageTitle = NAV_ITEMS.find((n) => n.path === pathname)?.label ?? "Dashboard";

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 px-4 md:px-6 py-3 border-b bg-background/85 backdrop-blur">
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onOpenMobile}
          aria-label="Open menu"
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted"
        >
          <Menu size={18} />
        </button>
        <button
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden md:flex p-2 rounded-lg text-muted-foreground hover:bg-muted"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <h1 className="text-lg font-display font-semibold truncate">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-card w-56">
          <Search size={14} className="text-muted-foreground shrink-0" />
          <input
            placeholder="Search reports, customers…"
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
          />
        </div>

        <button
          aria-label="Notifications"
          className="p-2 rounded-lg relative text-muted-foreground hover:bg-muted"
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-destructive" />
        </button>

        <button
          onClick={toggleTheme}
          aria-label="Toggle color theme"
          className="p-2 rounded-lg text-muted-foreground hover:bg-muted"
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 bg-secondary text-secondary-foreground">
          RA
        </div>
      </div>
    </header>
  );
}
