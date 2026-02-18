import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Apple, Clock, AlertTriangle, UtensilsCrossed, Plus, NotebookPen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Meal = { meal: string; time: string; description: string };
type NutritionData = { restrictions: string[]; plan: Meal[]; notes: string };

const STORAGE_KEY = "care:nutrition";
const initialData: NutritionData = { restrictions: [], plan: [], notes: "" };

export default function Nutrition() {
  const [data, setData] = useState<NutritionData>(initialData);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Meal | null>(null);
  const [form, setForm] = useState({ meal: "", time: "", description: "" });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const saveMeal = () => {
    if (!form.meal || !form.time || !form.description) return;
    if (editing) {
      setData((prev) => ({ ...prev, plan: prev.plan.map((item) => (item.meal === editing.meal && item.time === editing.time ? { ...form } : item)) }));
      setEditing(null);
    } else {
      setData((prev) => ({ ...prev, plan: [{ ...form }, ...prev.plan] }));
    }
    setForm({ meal: "", time: "", description: "" });
    setOpen(false);
  };

  const openEdit = (meal: Meal) => {
    setEditing(meal);
    setForm(meal);
    setOpen(true);
  };

  const removeMeal = (mealToRemove: Meal) => {
    setData((prev) => ({
      ...prev,
      plan: prev.plan.filter((item) => !(item.meal === mealToRemove.meal && item.time === mealToRemove.time && item.description === mealToRemove.description)),
    }));

    if (editing && editing.meal === mealToRemove.meal && editing.time === mealToRemove.time) {
      setEditing(null);
      setForm({ meal: "", time: "", description: "" });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Nutrição</h1>
          <p className="text-muted-foreground text-sm">Plano alimentar e restrições</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" aria-label="Editar refeição" onClick={() => data.plan[0] && openEdit(data.plan[0])}><NotebookPen className="h-4 w-4" /></Button>
          <Button size="icon" variant="outline" aria-label="Excluir refeição" onClick={() => data.plan[0] && removeMeal(data.plan[0])}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="icon" aria-label="Adicionar refeição"><Plus className="h-4 w-4" /></Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? "Editar refeição" : "Adicionar refeição"}</DialogTitle></DialogHeader>
              <div className="space-y-3 py-2">
                <div className="space-y-1.5"><Label>Refeição</Label><Input value={form.meal} onChange={(e) => setForm((p) => ({ ...p, meal: e.target.value }))} placeholder="Ex: Lanche da tarde" /></div>
                <div className="space-y-1.5"><Label>Horário</Label><Input value={form.time} onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))} placeholder="Ex: 15:30" /></div>
                <div className="space-y-1.5"><Label>Descrição</Label><Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Ex: Fruta + iogurte" /></div>
                <Button className="w-full" onClick={saveMeal}>{editing ? "Salvar alterações" : "Salvar"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2"><AlertTriangle className="h-4 w-4 text-warning" /><p className="text-sm font-semibold text-warning">Restrições Alimentares</p></div>
          <div className="flex flex-wrap gap-2">{data.restrictions.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma restrição cadastrada.</p> : data.restrictions.map((r, i) => (<Badge key={i} variant="outline" className="border-warning/30 text-warning">{r}</Badge>))}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><UtensilsCrossed className="h-5 w-5 text-primary" />Plano de Refeições</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {data.plan.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma refeição cadastrada.</p>}
          {data.plan.map((meal, i) => (
            <div key={`${meal.meal}-${meal.time}-${i}`} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0"><Apple className="h-5 w-5 text-secondary" /></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{meal.meal}</p>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{meal.time}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{meal.description}</p>
              </div>
              <Button size="icon" variant="outline" aria-label="Editar refeição" onClick={() => openEdit(meal)}><NotebookPen className="h-4 w-4" /></Button>
              <Button size="icon" variant="outline" aria-label="Excluir refeição" onClick={() => removeMeal(meal)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Observações Nutricionais</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">{data.notes || "Sem observações nutricionais."}</p></CardContent>
      </Card>
    </div>
  );
}
