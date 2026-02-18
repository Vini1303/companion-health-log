import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Thermometer, Droplets, Activity, Pill, AlertTriangle, Clock, ChevronRight } from "lucide-react";
import { getDashboardNames } from "@/lib/auth";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Link } from "react-router-dom";
import { MEDICATION_NOTIFICATIONS_STORAGE_KEY, MEDICATIONS_STORAGE_KEY } from "@/lib/storage-keys";

type VitalRecord = {
  id: string;
  date: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  glucose: number;
};

type Allergy = {
  id: string;
  name: string;
  severity: "alta" | "média" | "baixa";
};

type Medication = {
  id: string;
  name: string;
  times: string[];
};

type MedicationNotification = {
  id: string;
  message: string;
  read: boolean;
};

const VITALS_STORAGE_KEY = "care:vitals";
const ALLERGIES_STORAGE_KEY = "care:allergies";
const TAKEN_MEDICATIONS_STORAGE_KEY = "care:medications:taken";

const readJson = <T,>(key: string, fallback: T): T => {
  const value = localStorage.getItem(key);
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const formatNumber = (value: number | undefined) => (typeof value === "number" && Number.isFinite(value) ? String(value) : "Não cadastrado");

export default function Dashboard() {
  const { caregiverName, patientName } = getDashboardNames();
  const [records, setRecords] = useState<VitalRecord[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [takenMedications, setTakenMedications] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<MedicationNotification[]>([]);

  useEffect(() => {
    setRecords(readJson<VitalRecord[]>(VITALS_STORAGE_KEY, []));
    setAllergies(readJson<Allergy[]>(ALLERGIES_STORAGE_KEY, []));
    setMedications(readJson<Medication[]>(MEDICATIONS_STORAGE_KEY, []));
    setTakenMedications(readJson<string[]>(TAKEN_MEDICATIONS_STORAGE_KEY, []));
    setNotifications(readJson<MedicationNotification[]>(MEDICATION_NOTIFICATIONS_STORAGE_KEY, []));
  }, []);

  const latestVital = useMemo(
    () => [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0],
    [records],
  );

  const chartData = useMemo(
    () =>
      [...records]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((record) => ({
          date: new Date(record.date).toISOString().slice(5, 10),
          sistólica: record.systolic,
          diastólica: record.diastolic,
          glicemia: record.glucose,
        })),
    [records],
  );

  const highSeverityAllergies = useMemo(() => allergies.filter((allergy) => allergy.severity === "alta"), [allergies]);

  const pendingMedications = useMemo(
    () => medications.filter((medication) => !takenMedications.includes(medication.id)),
    [medications, takenMedications],
  );

  const unreadNotifications = useMemo(() => notifications.filter((notification) => !notification.read), [notifications]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Bom dia, {caregiverName} 👋</h1>
        <p className="text-muted-foreground mt-1">Resumo do cuidado de hoje — {patientName}</p>
      </div>

      {highSeverityAllergies.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-semibold text-destructive">Alergias graves registradas</p>
              <p className="text-xs text-muted-foreground">{highSeverityAllergies.map((allergy) => allergy.name).join(", ")}</p>
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
            <p className="text-xl font-bold">
              {latestVital ? `${formatNumber(latestVital.systolic)}/${formatNumber(latestVital.diastolic)}` : "Não cadastrado"}
            </p>
            <p className="text-xs text-muted-foreground">mmHg</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Heart className="h-4 w-4 text-destructive" />
              <span className="text-xs font-medium">Freq. Cardíaca</span>
            </div>
            <p className="text-xl font-bold">{latestVital ? formatNumber(latestVital.heartRate) : "Não cadastrado"}</p>
            <p className="text-xs text-muted-foreground">bpm</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Thermometer className="h-4 w-4 text-warning" />
              <span className="text-xs font-medium">Temperatura</span>
            </div>
            <p className="text-xl font-bold">{latestVital ? `${formatNumber(latestVital.temperature)}°` : "Não cadastrado"}</p>
            <p className="text-xs text-muted-foreground">Celsius</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Droplets className="h-4 w-4 text-secondary" />
              <span className="text-xs font-medium">Glicemia</span>
            </div>
            <p className="text-xl font-bold">{latestVital ? formatNumber(latestVital.glucose) : "Não cadastrado"}</p>
            <p className="text-xs text-muted-foreground">mg/dL</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Tendência - Pressão Arterial</CardTitle>
              <Link to="/sinais-vitais" className="text-xs text-primary hover:underline">
                Ver tudo
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <p className="text-sm text-muted-foreground">Não cadastrado</p>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[60, 160]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="sistólica" stroke="hsl(199, 89%, 48%)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="diastólica" stroke="hsl(172, 66%, 50%)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Medicamentos Pendentes</CardTitle>
              <Link to="/medicamentos" className="text-xs text-primary hover:underline">
                Ver tudo
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {medications.length === 0 ? (
              <p className="text-sm text-muted-foreground">Não cadastrado</p>
            ) : pendingMedications.length === 0 ? (
              <p className="text-sm text-success font-medium">✓ Todos os medicamentos foram administrados!</p>
            ) : (
              pendingMedications.slice(0, 4).map((medication) => (
                <div key={medication.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Pill className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{medication.name || "Não cadastrado"}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {medication.times?.[0] || "Não cadastrado"}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Marcar
                  </Button>
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
          {unreadNotifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">Não cadastrado</p>
          ) : (
            unreadNotifications.slice(0, 4).map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <p className="text-sm">{notification.message}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Remédio
                </Badge>
              </div>
            ))
          )}
          <Link to="/perfil" className="inline-flex items-center gap-1 text-xs text-primary mt-2 hover:underline">
            Ver todas <ChevronRight className="h-3 w-3" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
