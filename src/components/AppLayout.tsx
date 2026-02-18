import { useMemo, useState } from "react";
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
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMedicationNotifications } from "@/hooks/use-medication-notifications";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Início" },
  { to: "/sinais-vitais", icon: Heart, label: "Sinais Vitais" },
  { to: "/medicamentos", icon: Pill, label: "Medicamentos" },
  { to: "/exames", icon: FlaskConical, label: "Exames" },
  { to: "/alergias", icon: AlertTriangle, label: "Alergias" },
  { to: "/comorbidades", icon: Heart, label: "Comorbidades" },
  { to: "/ligacoes", icon: Phone, label: "Ligações" },
  { to: "/dados-idoso", icon: User, label: "Dados do Idoso" },
  { to: "/nutricao", icon: Apple, label: "Nutrição" },
  { to: "/perfil", icon: User, label: "Perfil" },
];

const notificationDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export function AppLayout({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { notifications, unreadCount, markAllAsRead } = useMedicationNotifications();

  const sortedNotifications = useMemo(
    () => [...notifications].sort((a, b) => new Date(b.alertedAt).getTime() - new Date(a.alertedAt).getTime()),
    [notifications],
  );

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto min-h-screen max-w-md bg-background border-x border-border shadow-sm flex flex-col relative overflow-hidden">
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-card/95 backdrop-blur border-b border-border">
          <Button
            variant="ghost"
            className="h-auto px-2 py-1.5 text-lg font-bold text-primary flex items-center gap-2"
            aria-label="Abrir menu lateral"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <Heart className="h-5 w-5" />
            CuidarBem
          </Button>

          <Popover
            open={isNotificationsOpen}
            onOpenChange={(open) => {
              setIsNotificationsOpen(open);
              if (open) markAllAsRead();
            }}
          >
            <PopoverTrigger asChild>
              <button className="relative p-2" aria-label="Notificações">
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-semibold">Notificações de medicamentos</p>
                <p className="text-xs text-muted-foreground">Alertas enviados e os dias em que ocorreram.</p>
              </div>
              <ScrollArea className="max-h-80">
                <div className="space-y-2 p-3">
                  {sortedNotifications.length === 0 && (
                    <p className="text-sm text-muted-foreground px-1 py-2">Nenhuma notificação até agora.</p>
                  )}

                  {sortedNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "rounded-md border p-3",
                        notification.read ? "border-border bg-card" : "border-destructive/30 bg-destructive/5",
                      )}
                    >
                      <p className="text-sm font-medium leading-snug">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">Horário do remédio: {notification.scheduledTime}</p>
                      <p className="text-xs text-muted-foreground">
                        Alertado em: {notificationDateFormatter.format(new Date(notification.alertedAt))}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-4">{children}</main>

        <div
          className={cn(
            "absolute inset-0 z-40 bg-black/40 transition-opacity duration-200",
            isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />

        <aside
          className={cn(
            "absolute inset-y-0 left-0 z-50 w-[86%] max-w-[320px] border-r border-border bg-background p-4 shadow-xl transition-transform duration-200",
            isMenuOpen ? "translate-x-0" : "-translate-x-full",
          )}
          role="dialog"
          aria-label="Menu lateral"
          aria-modal="true"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary">Menu</h2>
            <Button variant="ghost" size="icon" aria-label="Fechar menu" onClick={() => setIsMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-4 border-t border-border pt-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => {
                setIsMenuOpen(false);
                onLogout();
              }}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
