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
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Início" },
  { to: "/sinais-vitais", icon: Heart, label: "Sinais Vitais" },
  { to: "/medicamentos", icon: Pill, label: "Medicamentos" },
  { to: "/exames", icon: FlaskConical, label: "Exames" },
  { to: "/alergias", icon: AlertTriangle, label: "Alergias" },
  { to: "/ligacoes", icon: Phone, label: "Ligações" },
  { to: "/dados-idoso", icon: User, label: "Dados do Idoso" },
  { to: "/nutricao", icon: Apple, label: "Nutrição" },
  { to: "/perfil", icon: User, label: "Perfil" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto min-h-screen max-w-md bg-background border-x border-border shadow-sm flex flex-col">
        <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-card/95 backdrop-blur border-b border-border">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto px-2 py-1.5 text-lg font-bold text-primary flex items-center gap-2"
                aria-label="Abrir menu lateral"
              >
                <Menu className="h-5 w-5" />
                <Heart className="h-5 w-5" />
                CuidarBem
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[88%] sm:max-w-sm px-4 py-6">
              <SheetHeader>
                <SheetTitle className="text-primary">Menu</SheetTitle>
              </SheetHeader>

              <nav className="mt-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.to;

                  return (
                    <SheetClose key={item.to} asChild>
                      <NavLink
                        to={item.to}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                          isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent",
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </NavLink>
                    </SheetClose>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>

          <button className="relative p-2" aria-label="Notificações">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-4">{children}</main>
      </div>
    </div>
  );
}
