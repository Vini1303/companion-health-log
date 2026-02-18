import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FlaskConical, Plus, Calendar, User, ExternalLink, NotebookPen } from "lucide-react";
import { format } from "date-fns";
import { SwipeToDeleteItem } from "@/components/SwipeToDeleteItem";
import { ptBR } from "date-fns/locale";

type Exam = {
  id: string;
  type: string;
  requestedDate: string;
  expectedDate: string;
  doctor: string;
  status: "pendente" | "agendado" | "concluído";
  notes: string;
  resultUrl?: string;
};

const statusMap = {
  pendente: { label: "Pendente", className: "bg-warning text-warning-foreground" },
  agendado: { label: "Agendado", className: "bg-primary text-primary-foreground" },
  concluído: { label: "Concluído", className: "bg-success text-success-foreground" },
};

const EXAMS_KEY = "care:exams";
const emptyForm = { type: "", expectedDate: "", doctor: "", notes: "", resultUrl: "" };

export default function Exams() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Exam | null>(null);
  const [examList, setExamList] = useState<Exam[]>([]);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const saved = localStorage.getItem(EXAMS_KEY);
    if (saved) setExamList(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(EXAMS_KEY, JSON.stringify(examList));
  }, [examList]);

  const saveExam = () => {
    if (!form.type || !form.expectedDate || !form.doctor) return;

    const payload = {
      type: form.type,
      expectedDate: form.expectedDate,
      doctor: form.doctor,
      status: (form.resultUrl ? "concluído" : "pendente") as Exam["status"],
      notes: form.notes,
      resultUrl: form.resultUrl || undefined,
    };

    if (editing) {
      setExamList((prev) => prev.map((exam) => (exam.id === editing.id ? { ...exam, ...payload } : exam)));
      setEditing(null);
    } else {
      const newExam: Exam = { id: Date.now().toString(), requestedDate: new Date().toISOString().slice(0, 10), ...payload };
      setExamList((prev) => [newExam, ...prev]);
    }

    setForm(emptyForm);
    setOpen(false);
  };

  const openEdit = (exam: Exam) => {
    setEditing(exam);
    setForm({ type: exam.type, expectedDate: exam.expectedDate, doctor: exam.doctor, notes: exam.notes, resultUrl: exam.resultUrl || "" });
    setOpen(true);
  };

  const removeExam = (examId: string) => {
    setExamList((prev) => prev.filter((exam) => exam.id !== examId));
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Exames</h1>
          <p className="text-muted-foreground text-sm">Solicitações, resultados e links para laudos</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" aria-label="Editar exame" onClick={() => examList[0] && openEdit(examList[0])}>
            <NotebookPen className="h-4 w-4" />
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="icon" aria-label="Adicionar exame"><Plus className="h-4 w-4" /></Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? "Editar Exame" : "Registrar Exame"}</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2"><Label>Tipo de Exame</Label><Input value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} placeholder="Ex: Hemograma Completo" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Data Prevista</Label><Input type="date" value={form.expectedDate} onChange={(e) => setForm((p) => ({ ...p, expectedDate: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Médico Solicitante</Label><Input value={form.doctor} onChange={(e) => setForm((p) => ({ ...p, doctor: e.target.value }))} placeholder="Ex: Dr. Roberto" /></div>
                </div>
                <div className="space-y-2"><Label>Link do Resultado (opcional)</Label><Input value={form.resultUrl} onChange={(e) => setForm((p) => ({ ...p, resultUrl: e.target.value }))} placeholder="https://..." /></div>
                <div className="space-y-2"><Label>Observações</Label><Input value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Notas adicionais..." /></div>
              </div>
              <Button className="w-full" onClick={saveExam}>{editing ? "Salvar alterações" : "Salvar"}</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-3">
        {examList.length === 0 && <p className="text-sm text-muted-foreground">Nenhum exame cadastrado.</p>}
        {examList.map((exam) => {
          const status = statusMap[exam.status];
          return (
            <SwipeToDeleteItem key={exam.id} onDelete={() => removeExam(exam.id)} deleteLabel={`Apagar exame ${exam.type}`}>
              <Card>
                <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center"><FlaskConical className="h-5 w-5 text-accent" /></div>
                    <div>
                      <p className="font-medium">{exam.type}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{format(new Date(exam.expectedDate), "dd/MM/yyyy", { locale: ptBR })}</span>
                        <span className="flex items-center gap-1"><User className="h-3 w-3" />{exam.doctor}</span>
                      </div>
                      {exam.notes && <p className="text-xs text-muted-foreground mt-1">{exam.notes}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" aria-label="Editar exame" onClick={() => openEdit(exam)}><NotebookPen className="h-4 w-4" /></Button>
                    <Badge className={status.className}>{status.label}</Badge>
                    {exam.resultUrl && (
                      <Button asChild size="sm" variant="outline">
                        <a href={exam.resultUrl} target="_blank" rel="noreferrer"><ExternalLink className="h-3.5 w-3.5 mr-1" /> Ver resultado</a>
                      </Button>
                    )}
                  </div>
                </div>
                </CardContent>
              </Card>
            </SwipeToDeleteItem>
          );
        })}
      </div>
    </div>
  );
}
