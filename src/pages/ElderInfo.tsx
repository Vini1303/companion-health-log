import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, NotebookPen } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const STORAGE_KEY = "care:elder-info";

type LegacyElderInfoData = {
  name?: string;
  age?: string;
  phone?: string;
  sex?: string;
  address?: string;
  birthDate?: string;
};

type ElderInfoData = {
  details: string;
};

const initialData: ElderInfoData = {
  details:
    "Nome completo: Maria da Silva\nTelefone: (11) 99999-8888\nIdade: 85\nCPF: 000.000.000-00\nRG: 00.000.000-0\nAltura: 1,58 m\nPeso: 62 kg\nEndereço: Rua das Flores, 123 - São Paulo/SP\nTipo sanguíneo: O+",
};

const emptyData: ElderInfoData = { details: "" };

function legacyDataToText(data: LegacyElderInfoData) {
  const lines = [
    data.name ? `Nome completo: ${data.name}` : "",
    data.phone ? `Telefone: ${data.phone}` : "",
    data.age ? `Idade: ${data.age}` : "",
    data.sex ? `Sexo: ${data.sex}` : "",
    data.birthDate ? `Data de nascimento: ${data.birthDate}` : "",
    data.address ? `Endereço: ${data.address}` : "",
  ].filter(Boolean);

  return lines.join("\n");
}

function normalizeStoredData(saved: string): ElderInfoData {
  const parsed = JSON.parse(saved);

  if (parsed && typeof parsed.details === "string") {
    return { details: parsed.details };
  }

  return { details: legacyDataToText(parsed as LegacyElderInfoData) };
}

export default function ElderInfo() {
  const [data, setData] = useState<ElderInfoData>(initialData);
  const [form, setForm] = useState<ElderInfoData>(initialData);
  const [open, setOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const normalized = normalizeStoredData(saved);
      setData(normalized);
      setForm(normalized);
    }
  }, []);

  const onSave = () => {
    setData(form);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
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
          <p className="text-muted-foreground text-sm">Escreva os dados do idoso em um único campo (nome, telefone, idade, CPF, RG, altura, peso, endereço, tipo sanguíneo etc.)</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" aria-label="Editar dados" onClick={openEdit}><NotebookPen className="h-4 w-4" /></Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="icon" aria-label="Adicionar cadastro" onClick={openNew}><Plus className="h-4 w-4" /></Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{isNew ? "Novo cadastro" : "Editar cadastro"}</DialogTitle></DialogHeader>
              <div className="space-y-3 py-2">
                <Textarea
                  rows={12}
                  value={form.details}
                  onChange={(e) => setForm({ details: e.target.value })}
                  placeholder="Exemplo:\nNome completo: \nTelefone: \nIdade: \nCPF: \nRG: \nAltura e Peso: \nEndereço: \nTipo sanguíneo:"
                />
                <Button className="w-full" onClick={onSave}>Salvar dados</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Informações cadastrais</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="whitespace-pre-line">{data.details || "-"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
