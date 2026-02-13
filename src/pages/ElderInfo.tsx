import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "care:elder-info";

type ElderInfoData = {
  name: string;
  age: string;
  phone: string;
  sex: string;
  address: string;
};

const initialData: ElderInfoData = {
  name: "Maria da Silva",
  age: "85",
  phone: "(11) 99999-8888",
  sex: "Feminino",
  address: "Rua das Flores, 123 - São Paulo/SP",
};

export default function ElderInfo() {
  const [data, setData] = useState<ElderInfoData>(initialData);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setData(JSON.parse(saved));
  }, []);

  const onSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  return (
    <div className="space-y-4 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Dados do Idoso</h1>
        <p className="text-muted-foreground text-sm">Cadastro com informações principais do paciente</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações cadastrais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nome do idoso</Label>
            <Input value={data.name} onChange={(e) => setData((p) => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Idade</Label>
              <Input value={data.age} onChange={(e) => setData((p) => ({ ...p, age: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Sexo</Label>
              <Input value={data.sex} onChange={(e) => setData((p) => ({ ...p, sex: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input value={data.phone} onChange={(e) => setData((p) => ({ ...p, phone: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Endereço</Label>
            <Input value={data.address} onChange={(e) => setData((p) => ({ ...p, address: e.target.value }))} />
          </div>
          <Button className="w-full" onClick={onSave}>Salvar dados</Button>
        </CardContent>
      </Card>
    </div>
  );
}
