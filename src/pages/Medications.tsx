import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pill, Plus, Clock, Check, NotebookPen } from "lucide-react";
import { MEDICATIONS_STORAGE_KEY } from "@/lib/storage-keys";
import { SwipeToDeleteItem } from "@/components/SwipeToDeleteItem";

type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  description: string;
  active: boolean;
};

const MEDS_KEY = MEDICATIONS_STORAGE_KEY;
const TAKEN_KEY = "care:medications:taken";
const emptyForm = { name: "", dosage: "", frequency: "", times: "", description: "" };

export default function Medications() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Medication | null>(null);
  const [medList, setMedList] = useState<Medication[]>([]);
  const [takenIds, setTakenIds] = useState<string[]>([]);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const savedMeds = localStorage.getItem(MEDS_KEY);
    if (savedMeds) setMedList(JSON.parse(savedMeds));

    const savedTaken = localStorage.getItem(TAKEN_KEY);
    if (savedTaken) setTakenIds(JSON.parse(savedTaken));
  }, []);

  useEffect(() => {
    localStorage.setItem(MEDS_KEY, JSON.stringify(medList));
  }, [medList]);

  useEffect(() => {
    localStorage.setItem(TAKEN_KEY, JSON.stringify(takenIds));
  }, [takenIds]);

  const takenSet = useMemo(() => new Set(takenIds), [takenIds]);

  const toggleTaken = (medId: string) => {
    setTakenIds((prev) => (prev.includes(medId) ? prev.filter((id) => id !== medId) : [...prev, medId]));
  };

  const removeMedication = (medId: string) => {
    setMedList((prev) => prev.filter((med) => med.id !== medId));
    setTakenIds((prev) => prev.filter((id) => id !== medId));
  };

  const saveMedication = () => {
    if (!form.name || !form.dosage || !form.frequency || !form.times) return;

    const payload = {
      name: form.name,
      dosage: form.dosage,
      frequency: form.frequency,
      times: form.times.split(",").map((t) => t.trim()).filter(Boolean),
      description: form.description || "Sem descrição",
      active: true,
    };

    if (editing) {
      setMedList((prev) => prev.map((m) => (m.id === editing.id ? { ...m, ...payload } : m)));
      setEditing(null);
    } else {
      const newMed: Medication = { id: Date.now().toString(), ...payload };
      setMedList((prev) => [newMed, ...prev]);
    }

    setForm(emptyForm);
    setOpen(false);
  };

  const openEdit = (med: Medication) => {
    setEditing(med);
    setForm({
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      times: med.times.join(", "),
      description: med.description,
    });
    setOpen(true);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Medicamentos</h1>
          <p className="text-muted-foreground text-sm">Horários, dosagens e confirmação do que já foi administrado</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" aria-label="Editar medicamento" onClick={() => medList[0] && openEdit(medList[0])}>
            <NotebookPen className="h-4 w-4" />
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="icon" aria-label="Adicionar medicamento"><Plus className="h-4 w-4" /></Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? "Editar Medicamento" : "Cadastrar Medicamento"}</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2"><Label>Nome do Medicamento</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Ex: Losartana 50mg" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Dosagem</Label><Input value={form.dosage} onChange={(e) => setForm((p) => ({ ...p, dosage: e.target.value }))} placeholder="Ex: 1 comprimido" /></div>
                  <div className="space-y-2"><Label>Frequência</Label><Input value={form.frequency} onChange={(e) => setForm((p) => ({ ...p, frequency: e.target.value }))} placeholder="Ex: 2x ao dia" /></div>
                </div>
                <div className="space-y-2"><Label>Horários (separados por vírgula)</Label><Input value={form.times} onChange={(e) => setForm((p) => ({ ...p, times: e.target.value }))} placeholder="Ex: 08:00, 20:00" /></div>
                <div className="space-y-2"><Label>Descrição</Label><Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Ex: Anti-hipertensivo" /></div>
              </div>
              <Button className="w-full" onClick={saveMedication}>{editing ? "Salvar alterações" : "Salvar"}</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Agenda de Hoje</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {medList.length === 0 && <p className="text-sm text-muted-foreground">Nenhum medicamento cadastrado.</p>}
          {medList.map((med) => {
            const taken = takenSet.has(med.id);
            return (
              <SwipeToDeleteItem key={med.id} onDelete={() => removeMedication(med.id)} deleteLabel={`Apagar ${med.name}`}>
                <div className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${taken ? "bg-success/5 border-success/20" : "bg-card border-border"}`}>
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${taken ? "bg-success/10" : "bg-primary/10"}`}>
                    {taken ? <Check className="h-5 w-5 text-success" /> : <Pill className="h-5 w-5 text-primary" />}
                  </div>
                  <div>
                    <p className="font-medium">{med.name}</p>
                    <p className="text-sm text-muted-foreground">{med.dosage} — {med.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="h-3 w-3" />{med.times.join(", ")}</div>
                    <Badge variant="outline" className="text-xs mt-1">{med.frequency}</Badge>
                  </div>
                  <Button size="icon" variant="outline" onClick={() => openEdit(med)} aria-label="Editar medicamento"><NotebookPen className="h-4 w-4" /></Button>
                  <Button size="sm" variant={taken ? "outline" : "default"} className={!taken ? "bg-success hover:bg-success/90 text-success-foreground" : ""} onClick={() => toggleTaken(med.id)}><Check className="h-4 w-4" /></Button>
                </div>
              </div>
            </SwipeToDeleteItem>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
