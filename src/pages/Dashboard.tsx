import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Thermometer, Droplets, Activity, Pill, AlertTriangle, Clock, ChevronRight } from "lucide-react";
import { vitals, medications, medicationLog, allergies, notifications } from "@/lib/mock-data";
import { getDashboardNames } from "@/lib/auth";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Link } from "react-router-dom";

const latestVital = vitals[0];
const chartData = [...vitals].reverse().map((v) => ({
  date: v.date.split("T")[0].slice(5),
  sistólica: v.systolic,
  diastólica: v.diastolic,
  glicemia: v.glucose,
}));

const takenMedIds = new Set(medicationLog.map((l) => l.medicationId));
const pendingMeds = medications.filter((m) => !takenMedIds.has(m.id));
const unreadNotifications = notifications.filter((n) => !n.read);

export default function Dashboard() {
  const { caregiverName, patientName } = getDashboardNames();

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Bom dia, {caregiverName} 👋</h1>
        <p className="text-muted-foreground mt-1">Resumo do cuidado de hoje — {patientName}</p>
      </div>

      {allergies.filter((a) => a.severity === "alta").length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-semibold text-destructive">Alergias graves registradas</p>
              <p className="text-xs text-muted-foreground">
                {allergies.filter((a) => a.severity === "alta").map((a) => a.name).join(", ")}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">Pressão</span>
            </div>
            <p className="text-xl font-bold">{latestVital.systolic}/{latestVital.diastolic}</p>
            <p className="text-xs text-muted-foreground">mmHg</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Heart className="h-4 w-4 text-destructive" />
              <span className="text-xs font-medium">Freq. Cardíaca</span>
            </div>
            <p className="text-xl font-bold">{latestVital.heartRate}</p>
            <p className="text-xs text-muted-foreground">bpm</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Thermometer className="h-4 w-4 text-warning" />
              <span className="text-xs font-medium">Temperatura</span>
            </div>
            <p className="text-xl font-bold">{latestVital.temperature}°</p>
            <p className="text-xs text-muted-foreground">Celsius</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Droplets className="h-4 w-4 text-secondary" />
              <span className="text-xs font-medium">Glicemia</span>
            </div>
            <p className="text-xl font-bold">{latestVital.glucose}</p>
            <p className="text-xs text-muted-foreground">mg/dL</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Tendência - Pressão Arterial</CardTitle>
              <Link to="/sinais-vitais" className="text-xs text-primary hover:underline">Ver tudo</Link>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[60, 160]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="sistólica" stroke="hsl(199, 89%, 48%)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="diastólica" stroke="hsl(172, 66%, 50%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Medicamentos Pendentes</CardTitle>
              <Link to="/medicamentos" className="text-xs text-primary hover:underline">Ver tudo</Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingMeds.length === 0 ? (
              <p className="text-sm text-success font-medium">✓ Todos os medicamentos foram administrados!</p>
            ) : (
              pendingMeds.slice(0, 4).map((med) => (
                <div key={med.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Pill className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{med.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {med.times[0]}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Marcar</Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notificações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {unreadNotifications.slice(0, 4).map((n) => (
            <div key={n.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <p className="text-sm">{n.message}</p>
              </div>
              <Badge variant="outline" className="text-xs">{n.type === "medication" ? "Remédio" : n.type === "exam" ? "Exame" : "Vital"}</Badge>
            </div>
          ))}
          <Link to="/perfil" className="inline-flex items-center gap-1 text-xs text-primary mt-2 hover:underline">
            Ver todas <ChevronRight className="h-3 w-3" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
