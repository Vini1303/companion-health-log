import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, NotebookPen } from "lucide-react";
import { saveAuthProfile } from "@/lib/auth";

const STORAGE_KEY = "care:elder-info";

type ElderInfoData = {
  name: string;
  age: string;
  phone: string;
  sex: string;
  address: string;
  birthDate: string;
};

const initialData: ElderInfoData = {
  name: "Maria da Silva",
  age: "85",
  phone: "(11) 99999-8888",
  sex: "Feminino",
  address: "Rua das Flores, 123 - São Paulo/SP",
  birthDate: "1940-03-15",
};

const emptyData: ElderInfoData = { name: "", age: "", phone: "", sex: "", address: "", birthDate: "" };

export default function ElderInfo() {
  const [data, setData] = useState<ElderInfoData>(initialData);
  const [form, setForm] = useState<ElderInfoData>(initialData);
  const [open, setOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setData(parsed);
      setForm(parsed);
    }
  }, []);

  const onSave = () => {
    setData(form);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    if (form.name && form.birthDate) {
      saveAuthProfile({ elderName: form.name, birthDate: form.birthDate });
    }
    setOpen(false);
    setIsNew(false);
  };

  const openEdit = () => {
    setIsNew(false);
    setForm(data);
    setOpen(true);
  };

  const openNew = () => {
    setIsNew(true);
    setForm(emptyData);
    setOpen(true);
  };

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Dados do Idoso</h1>
          <p className="text-muted-foreground text-sm">Cadastro com informações principais do paciente</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" aria-label="Editar dados" onClick={openEdit}><NotebookPen className="h-4 w-4" /></Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="icon" aria-label="Adicionar cadastro" onClick={openNew}><Plus className="h-4 w-4" /></Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{isNew ? "Novo cadastro" : "Editar cadastro"}</DialogTitle></DialogHeader>
              <div className="space-y-3 py-2">
                <div className="space-y-1.5"><Label>Nome do idoso</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Idade</Label><Input value={form.age} onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))} /></div>
                  <div className="space-y-1.5"><Label>Sexo</Label><Input value={form.sex} onChange={(e) => setForm((p) => ({ ...p, sex: e.target.value }))} /></div>
                </div>
                <div className="space-y-1.5"><Label>Telefone</Label><Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Data de nascimento</Label><Input type="date" value={form.birthDate} onChange={(e) => setForm((p) => ({ ...p, birthDate: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Endereço</Label><Input value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} /></div>
                <Button className="w-full" onClick={onSave}>Salvar dados</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Informações cadastrais</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p><span className="font-medium">Nome:</span> {data.name || "-"}</p>
          <p><span className="font-medium">Idade:</span> {data.age || "-"}</p>
          <p><span className="font-medium">Sexo:</span> {data.sex || "-"}</p>
          <p><span className="font-medium">Telefone:</span> {data.phone || "-"}</p>
          <p><span className="font-medium">Data de nascimento:</span> {data.birthDate || "-"}</p>
          <p><span className="font-medium">Endereço:</span> {data.address || "-"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
