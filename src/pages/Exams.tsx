import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FlaskConical, Plus, Calendar, User } from "lucide-react";
import { exams } from "@/lib/mock-data";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusMap = {
  pendente: { label: "Pendente", className: "bg-warning text-warning-foreground" },
  agendado: { label: "Agendado", className: "bg-primary text-primary-foreground" },
  concluído: { label: "Concluído", className: "bg-success text-success-foreground" },
};

export default function Exams() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Exames</h1>
          <p className="text-muted-foreground text-sm">Controle de exames e resultados</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Novo Exame</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Exame</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Tipo de Exame</Label>
                <Input placeholder="Ex: Hemograma Completo" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data Prevista</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Médico Solicitante</Label>
                  <Input placeholder="Ex: Dr. Roberto" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Input placeholder="Notas adicionais..." />
              </div>
            </div>
            <Button className="w-full" onClick={() => setOpen(false)}>Salvar</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {exams.map((exam) => {
          const status = statusMap[exam.status as keyof typeof statusMap];
          return (
            <Card key={exam.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <FlaskConical className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">{exam.type}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{format(new Date(exam.expectedDate), "dd/MM/yyyy", { locale: ptBR })}</span>
                        <span className="flex items-center gap-1"><User className="h-3 w-3" />{exam.doctor}</span>
                      </div>
                      {exam.notes && <p className="text-xs text-muted-foreground mt-1">{exam.notes}</p>}
                    </div>
                  </div>
                  <Badge className={status.className}>{status.label}</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
