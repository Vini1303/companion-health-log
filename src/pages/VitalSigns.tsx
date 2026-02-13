import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Activity, Heart, Thermometer, Droplets, Plus } from "lucide-react";
import { vitals } from "@/lib/mock-data";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const chartData = [...vitals].reverse().map((v) => ({
  date: format(new Date(v.date), "dd/MM", { locale: ptBR }),
  sistólica: v.systolic,
  diastólica: v.diastolic,
  fc: v.heartRate,
  glicemia: v.glucose,
  temp: v.temperature,
}));

function getStatusBadge(systolic: number, diastolic: number) {
  if (systolic >= 140 || diastolic >= 90) return <Badge variant="destructive" className="text-xs">Elevada</Badge>;
  if (systolic >= 130 || diastolic >= 85) return <Badge className="text-xs bg-warning text-warning-foreground">Atenção</Badge>;
  return <Badge className="text-xs bg-success text-success-foreground">Normal</Badge>;
}

export default function VitalSigns() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sinais Vitais</h1>
          <p className="text-muted-foreground text-sm">Registros e acompanhamento</p>
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
                <Input type="number" placeholder="120" />
              </div>
              <div className="space-y-2">
                <Label>Pressão Diastólica</Label>
                <Input type="number" placeholder="80" />
              </div>
              <div className="space-y-2">
                <Label>Freq. Cardíaca (bpm)</Label>
                <Input type="number" placeholder="72" />
              </div>
              <div className="space-y-2">
                <Label>Temperatura (°C)</Label>
                <Input type="number" step="0.1" placeholder="36.5" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Glicemia (mg/dL)</Label>
                <Input type="number" placeholder="100" />
              </div>
            </div>
            <Button className="w-full" onClick={() => setOpen(false)}>Salvar Registro</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Charts */}
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
            <CardTitle className="text-sm flex items-center gap-2"><Droplets className="h-4 w-4 text-secondary" /> Glicemia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[70, 160]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="glicemia" stroke="hsl(172, 66%, 50%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico de Registros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vitals.map((v) => (
              <div key={v.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <p className="font-medium">{format(new Date(v.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                    <p className="text-xs text-muted-foreground">Por {v.recordedBy}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-semibold">{v.systolic}/{v.diastolic}</p>
                    <p className="text-xs text-muted-foreground">mmHg</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{v.heartRate}</p>
                    <p className="text-xs text-muted-foreground">bpm</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{v.temperature}°</p>
                    <p className="text-xs text-muted-foreground">°C</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{v.glucose}</p>
                    <p className="text-xs text-muted-foreground">mg/dL</p>
                  </div>
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
