import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Plus, ShieldAlert } from "lucide-react";
import { allergies } from "@/lib/mock-data";

const severityMap = {
  alta: { label: "Alta", className: "bg-destructive text-destructive-foreground" },
  média: { label: "Média", className: "bg-warning text-warning-foreground" },
  baixa: { label: "Baixa", className: "bg-success text-success-foreground" },
};

const typeMap = {
  medicamentosa: "Medicamentosa",
  alimentar: "Alimentar",
};

export default function Allergies() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Alergias</h1>
          <p className="text-muted-foreground text-sm">Registro de alergias conhecidas</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nova Alergia</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Alergia</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Substância / Alimento</Label>
                <Input placeholder="Ex: Dipirona" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Input placeholder="Medicamentosa ou Alimentar" />
                </div>
                <div className="space-y-2">
                  <Label>Gravidade</Label>
                  <Input placeholder="Alta, Média ou Baixa" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Reação</Label>
                <Input placeholder="Descreva a reação..." />
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

      {/* High severity warning */}
      {allergies.some((a) => a.severity === "alta") && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 flex items-center gap-3">
            <ShieldAlert className="h-6 w-6 text-destructive shrink-0" />
            <div>
              <p className="font-semibold text-destructive text-sm">Atenção: Alergias de alta gravidade</p>
              <p className="text-xs text-muted-foreground">
                {allergies.filter((a) => a.severity === "alta").map((a) => `${a.name} (${a.reaction})`).join(" • ")}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {allergies.map((allergy) => {
          const severity = severityMap[allergy.severity];
          return (
            <Card key={allergy.id} className={allergy.severity === "alta" ? "border-destructive/20" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      allergy.severity === "alta" ? "bg-destructive/10" : "bg-warning/10"
                    }`}>
                      <AlertTriangle className={`h-5 w-5 ${
                        allergy.severity === "alta" ? "text-destructive" : "text-warning"
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{allergy.name}</p>
                      <p className="text-sm text-muted-foreground">{allergy.reaction}</p>
                      {allergy.notes && <p className="text-xs text-muted-foreground mt-1">{allergy.notes}</p>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={severity.className}>{severity.label}</Badge>
                    <Badge variant="outline" className="text-xs">{typeMap[allergy.type]}</Badge>
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
