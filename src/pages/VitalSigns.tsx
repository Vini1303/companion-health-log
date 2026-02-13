import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Activity, Droplets, Plus } from "lucide-react";
import { vitals } from "@/lib/mock-data";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type VitalRecord = {
  id: string;
  date: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  glucose: number;
  recordedBy: string;
};

const STORAGE_KEY = "care:vitals";

function getStatusBadge(systolic: number, diastolic: number) {
  if (systolic >= 140 || diastolic >= 90) return <Badge variant="destructive" className="text-xs">Elevada</Badge>;
  if (systolic >= 130 || diastolic >= 85) return <Badge className="text-xs bg-warning text-warning-foreground">Atenção</Badge>;
  return <Badge className="text-xs bg-success text-success-foreground">Normal</Badge>;
}

export default function VitalSigns() {
  const [open, setOpen] = useState(false);
  const [records, setRecords] = useState<VitalRecord[]>(vitals);
  const [form, setForm] = useState({
    systolic: "",
    diastolic: "",
    heartRate: "",
    temperature: "",
    glucose: "",
    recordedBy: "Equipe",
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setRecords(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const chartData = useMemo(
    () =>
      [...records]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((v) => ({
          date: format(new Date(v.date), "dd/MM", { locale: ptBR }),
          sistólica: v.systolic,
          diastólica: v.diastolic,
          glicemia: v.glucose,
        })),
    [records],
  );

  const history = useMemo(
    () => [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [records],
  );

  const saveRecord = () => {
    if (!form.systolic || !form.diastolic || !form.heartRate || !form.temperature || !form.glucose) return;

    const newRecord: VitalRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      systolic: Number(form.systolic),
      diastolic: Number(form.diastolic),
      heartRate: Number(form.heartRate),
      temperature: Number(form.temperature),
      glucose: Number(form.glucose),
      recordedBy: form.recordedBy || "Equipe",
    };

    setRecords((prev) => [newRecord, ...prev]);
    setForm({ systolic: "", diastolic: "", heartRate: "", temperature: "", glucose: "", recordedBy: "Equipe" });
    setOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sinais Vitais</h1>
          <p className="text-muted-foreground text-sm">Pressão, glicemia e demais registros diários do idoso</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Novo Registro</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Sinais Vitais</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Pressão Sistólica</Label>
                <Input type="number" value={form.systolic} onChange={(e) => setForm((p) => ({ ...p, systolic: e.target.value }))} placeholder="120" />
              </div>
              <div className="space-y-2">
                <Label>Pressão Diastólica</Label>
                <Input type="number" value={form.diastolic} onChange={(e) => setForm((p) => ({ ...p, diastolic: e.target.value }))} placeholder="80" />
              </div>
              <div className="space-y-2">
                <Label>Freq. Cardíaca (bpm)</Label>
                <Input type="number" value={form.heartRate} onChange={(e) => setForm((p) => ({ ...p, heartRate: e.target.value }))} placeholder="72" />
              </div>
              <div className="space-y-2">
                <Label>Temperatura (°C)</Label>
                <Input type="number" step="0.1" value={form.temperature} onChange={(e) => setForm((p) => ({ ...p, temperature: e.target.value }))} placeholder="36.5" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Glicemia (mg/dL)</Label>
                <Input type="number" value={form.glucose} onChange={(e) => setForm((p) => ({ ...p, glucose: e.target.value }))} placeholder="100" />
              </div>
            </div>
            <Button className="w-full" onClick={saveRecord}>Salvar Registro</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Pressão Arterial</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[60, 180]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="sistólica" stroke="hsl(199, 89%, 48%)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="diastólica" stroke="hsl(172, 66%, 50%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Droplets className="h-4 w-4 text-secondary" /> Glicemia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[70, 220]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="glicemia" stroke="hsl(172, 66%, 50%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico de Registros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {history.map((v) => (
              <div key={v.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="text-sm">
                  <p className="font-medium">{format(new Date(v.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                  <p className="text-xs text-muted-foreground">Por {v.recordedBy}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center"><p className="font-semibold">{v.systolic}/{v.diastolic}</p><p className="text-xs text-muted-foreground">mmHg</p></div>
                  <div className="text-center"><p className="font-semibold">{v.heartRate}</p><p className="text-xs text-muted-foreground">bpm</p></div>
                  <div className="text-center"><p className="font-semibold">{v.temperature}°</p><p className="text-xs text-muted-foreground">°C</p></div>
                  <div className="text-center"><p className="font-semibold">{v.glucose}</p><p className="text-xs text-muted-foreground">mg/dL</p></div>
                  {getStatusBadge(v.systolic, v.diastolic)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
