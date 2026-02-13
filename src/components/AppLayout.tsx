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
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Início" },
  { to: "/sinais-vitais", icon: Heart, label: "Sinais" },
  { to: "/medicamentos", icon: Pill, label: "Remédios" },
  { to: "/exames", icon: FlaskConical, label: "Exames" },
  { to: "/alergias", icon: AlertTriangle, label: "Alergias" },
  { to: "/ligacoes", icon: Phone, label: "Ligações" },
  { to: "/dados-idoso", icon: User, label: "Dados" },
  { to: "/nutricao", icon: Apple, label: "Nutrição" },
  { to: "/perfil", icon: User, label: "Perfil" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto min-h-screen max-w-md bg-background border-x border-border shadow-sm flex flex-col">
        <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-card/95 backdrop-blur border-b border-border">
          <h1 className="text-lg font-bold text-primary flex items-center gap-2">
            <Heart className="h-5 w-5" />
            CuidarBem
          </h1>
          <button className="relative p-2" aria-label="Notificações">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">{children}</main>

        <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 bg-card border-t border-border">
          <div className="flex gap-1 overflow-x-auto px-1 py-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "min-w-14 flex flex-col items-center gap-0.5 rounded-md px-2 py-2 text-[11px] transition-colors",
                    isActive ? "text-primary bg-primary/10" : "text-muted-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
