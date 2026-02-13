import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Heart,
  Pill,
  FlaskConical,
  AlertTriangle,
  Apple,
  User,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/sinais-vitais", icon: Heart, label: "Sinais Vitais" },
  { to: "/medicamentos", icon: Pill, label: "Medicamentos" },
  { to: "/exames", icon: FlaskConical, label: "Exames" },
  { to: "/alergias", icon: AlertTriangle, label: "Alergias" },
  { to: "/nutricao", icon: Apple, label: "Nutrição" },
  { to: "/perfil", icon: User, label: "Perfil" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <Heart className="h-6 w-6" />
            CuidarBem
          </h1>
          <p className="text-xs text-sidebar-foreground/60 mt-1">Gestão de Cuidados</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Ana Souza</p>
              <p className="text-xs text-sidebar-foreground/60">Cuidadora</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-card border-b border-border">
          <h1 className="text-lg font-bold text-primary flex items-center gap-2">
            <Heart className="h-5 w-5" />
            CuidarBem
          </h1>
          <button className="relative p-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-card border-t border-border flex justify-around py-2 z-50">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label.split(" ")[0]}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
