import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Plus, ShieldAlert, NotebookPen } from "lucide-react";

type Allergy = {
  id: string;
  name: string;
  type: "medicamentosa" | "alimentar";
  severity: "alta" | "média" | "baixa";
  reaction: string;
  notes?: string;
};

const STORAGE_KEY = "care:allergies";
const UPDATED_KEY = "care:allergies:updated-at";
const severityMap = {
  alta: { label: "Alta", className: "bg-destructive text-destructive-foreground" },
  média: { label: "Média", className: "bg-warning text-warning-foreground" },
  baixa: { label: "Baixa", className: "bg-success text-success-foreground" },
};

const typeMap = {
  medicamentosa: "Medicamentosa",
  alimentar: "Alimentar",
};

const emptyForm = { name: "", type: "medicamentosa", severity: "média", reaction: "", notes: "" };

export default function Allergies() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Allergy | null>(null);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setAllergies(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allergies));
  }, [allergies]);

  const saveAllergy = () => {
    if (!form.name || !form.reaction) return;

    const payload = {
      name: form.name,
      type: form.type as Allergy["type"],
      severity: form.severity as Allergy["severity"],
      reaction: form.reaction,
      notes: form.notes,
    };

    if (editing) {
      setAllergies((prev) => prev.map((a) => (a.id === editing.id ? { ...a, ...payload } : a)));
      setEditing(null);
    } else {
      setAllergies((prev) => [{ id: Date.now().toString(), ...payload }, ...prev]);
    }

    localStorage.setItem(UPDATED_KEY, new Date().toISOString());

    setForm(emptyForm);
    setOpen(false);
  };

  const openEdit = (allergy: Allergy) => {
    setEditing(allergy);
    setForm({
      name: allergy.name,
      type: allergy.type,
      severity: allergy.severity,
      reaction: allergy.reaction,
      notes: allergy.notes || "",
    });
    setOpen(true);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Alergias</h1>
          <p className="text-muted-foreground text-sm">Registro de alergias conhecidas</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" aria-label="Editar alergia" onClick={() => allergies[0] && openEdit(allergies[0])}>
            <NotebookPen className="h-4 w-4" />
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="icon" aria-label="Adicionar alergia"><Plus className="h-4 w-4" /></Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? "Editar Alergia" : "Registrar Alergia"}</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2"><Label>Substância / Alimento</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Ex: Dipirona" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Tipo</Label><Input value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} placeholder="medicamentosa ou alimentar" /></div>
                  <div className="space-y-2"><Label>Gravidade</Label><Input value={form.severity} onChange={(e) => setForm((p) => ({ ...p, severity: e.target.value }))} placeholder="alta, média ou baixa" /></div>
                </div>
                <div className="space-y-2"><Label>Reação</Label><Input value={form.reaction} onChange={(e) => setForm((p) => ({ ...p, reaction: e.target.value }))} placeholder="Descreva a reação..." /></div>
                <div className="space-y-2"><Label>Observações</Label><Input value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Notas adicionais..." /></div>
              </div>
              <Button className="w-full" onClick={saveAllergy}>{editing ? "Salvar alterações" : "Salvar"}</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {allergies.some((a) => a.severity === "alta") && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 flex items-center gap-3">
            <ShieldAlert className="h-6 w-6 text-destructive shrink-0" />
            <div>
              <p className="font-semibold text-destructive text-sm">Atenção: Alergias de alta gravidade</p>
              <p className="text-xs text-muted-foreground">{allergies.filter((a) => a.severity === "alta").map((a) => `${a.name} (${a.reaction})`).join(" • ")}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {allergies.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma alergia cadastrada.</p>}
        {allergies.map((allergy) => {
          const severity = severityMap[allergy.severity];
          return (
            <Card key={allergy.id} className={allergy.severity === "alta" ? "border-destructive/20" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${allergy.severity === "alta" ? "bg-destructive/10" : "bg-warning/10"}`}>
                      <AlertTriangle className={`h-5 w-5 ${allergy.severity === "alta" ? "text-destructive" : "text-warning"}`} />
                    </div>
                    <div>
                      <p className="font-medium">{allergy.name}</p>
                      <p className="text-sm text-muted-foreground">{allergy.reaction}</p>
                      {allergy.notes && <p className="text-xs text-muted-foreground mt-1">{allergy.notes}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" aria-label="Editar alergia" onClick={() => openEdit(allergy)}><NotebookPen className="h-4 w-4" /></Button>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={severity.className}>{severity.label}</Badge>
                      <Badge variant="outline" className="text-xs">{typeMap[allergy.type]}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
