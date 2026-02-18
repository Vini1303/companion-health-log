import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NotebookPen } from "lucide-react";
import { ELDER_INFO_KEY, getAuthProfile } from "@/lib/auth";
import { differenceInYears, isValid } from "date-fns";

type ElderInfoData = {
  schemaVersion?: number;
  name: string;
  age: string;
  sex: string;
  height: string;
  weight: string;
  phone: string;
  birthDate: string;
  address: string;
};

const emptyManualData = {
  height: "",
  weight: "",
  phone: "",
  address: "",
};

function buildAutoData() {
  const profile = getAuthProfile();
  const birthDate = profile.birthDate || "";
  const parsedBirthDate = new Date(birthDate);
  const age = isValid(parsedBirthDate) ? String(differenceInYears(new Date(), parsedBirthDate)) : "";

  return {
    name: profile.elderName || "",
    age,
    sex: profile.sex || "",
    birthDate,
  };
}

const ELDER_INFO_SCHEMA_VERSION = 2;

function mergeWithAutoData(saved: Partial<ElderInfoData> | null): ElderInfoData {
  const autoData = buildAutoData();
  const isLegacyData = !saved || !saved.schemaVersion || saved.schemaVersion < ELDER_INFO_SCHEMA_VERSION;

  const manualData = isLegacyData
    ? emptyManualData
    : {
        height: saved.height || "",
        weight: saved.weight || "",
        phone: saved.phone || "",
        address: saved.address || "",
      };

  return {
    schemaVersion: ELDER_INFO_SCHEMA_VERSION,
    ...autoData,
    ...manualData,
  };
}

export default function ElderInfo() {
  const [data, setData] = useState<ElderInfoData>(mergeWithAutoData(null));
  const [form, setForm] = useState<ElderInfoData>(mergeWithAutoData(null));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(ELDER_INFO_KEY);
    const parsed = saved ? (JSON.parse(saved) as Partial<ElderInfoData>) : null;
    const merged = mergeWithAutoData(parsed);
    setData(merged);
    setForm(merged);
    localStorage.setItem(ELDER_INFO_KEY, JSON.stringify(merged));
  }, []);

  const onSave = () => {
    const nextData = {
      ...data,
      schemaVersion: ELDER_INFO_SCHEMA_VERSION,
      height: form.height,
      weight: form.weight,
      phone: form.phone,
      address: form.address,
    };

    setData(nextData);
    setForm(nextData);
    localStorage.setItem(ELDER_INFO_KEY, JSON.stringify(nextData));
    setOpen(false);
  };

  const openEdit = () => {
    setForm(data);
    setOpen(true);
  };

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Dados do Idoso</h1>
          <p className="text-muted-foreground text-sm">Nome, idade, sexo e nascimento vêm do login. Complete apenas os dados restantes.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="icon" variant="outline" aria-label="Editar dados" onClick={openEdit}>
              <NotebookPen className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Completar dados do idoso</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Altura</Label><Input value={form.height} onChange={(e) => setForm((p) => ({ ...p, height: e.target.value }))} placeholder="Ex: 1,62 m" /></div>
                <div className="space-y-1.5"><Label>Peso</Label><Input value={form.weight} onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))} placeholder="Ex: 68 kg" /></div>
              </div>
              <div className="space-y-1.5"><Label>Telefone</Label><Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Ex: (11) 99999-8888" /></div>
              <div className="space-y-1.5"><Label>Endereço</Label><Input value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} placeholder="Ex: Rua das Flores, 123 - São Paulo/SP" /></div>
              <Button className="w-full" onClick={onSave}>Salvar dados</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Informações cadastrais</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p><span className="font-medium">Nome:</span> {data.name || "-"}</p>
          <p><span className="font-medium">Idade:</span> {data.age || "-"}</p>
          <p><span className="font-medium">Sexo:</span> {data.sex || "-"}</p>
          <p><span className="font-medium">Altura:</span> {data.height || "-"}</p>
          <p><span className="font-medium">Peso:</span> {data.weight || "-"}</p>
          <p><span className="font-medium">Telefone:</span> {data.phone || "-"}</p>
          <p><span className="font-medium">Data de nascimento:</span> {data.birthDate || "-"}</p>
          <p><span className="font-medium">Endereço:</span> {data.address || "-"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
