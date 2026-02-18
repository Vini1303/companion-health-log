import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus } from "lucide-react";
import { COMORBIDITIES_STORAGE_KEY } from "@/lib/storage-keys";
import { SwipeToDeleteItem } from "@/components/SwipeToDeleteItem";

export default function Comorbidities() {
  const [comorbidities, setComorbidities] = useState<string[]>([]);
  const [newComorbidity, setNewComorbidity] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(COMORBIDITIES_STORAGE_KEY);
    if (saved) {
      setComorbidities(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(COMORBIDITIES_STORAGE_KEY, JSON.stringify(comorbidities));
  }, [comorbidities]);

  const addComorbidity = () => {
    const value = newComorbidity.trim();
    if (!value) return;

    setComorbidities((prev) => {
      if (prev.some((item) => item.toLowerCase() === value.toLowerCase())) {
        return prev;
      }

      return [value, ...prev];
    });

    setNewComorbidity("");
  };

  const removeComorbidity = (itemToRemove: string) => {
    setComorbidities((prev) => prev.filter((item) => item !== itemToRemove));
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Comorbidades</h1>
        <p className="text-muted-foreground text-sm">Cadastre todas as doenças e condições do paciente</p>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex gap-2">
            <Input
              value={newComorbidity}
              onChange={(event) => setNewComorbidity(event.target.value)}
              placeholder="Ex: Hipertensão"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addComorbidity();
                }
              }}
            />
            <Button onClick={addComorbidity} className="shrink-0">
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">As comorbidades salvas aqui aparecem automaticamente no Perfil do Paciente.</p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {comorbidities.length === 0 && (
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">Nenhuma comorbidade cadastrada.</CardContent>
          </Card>
        )}

        {comorbidities.map((item) => (
          <SwipeToDeleteItem key={item} onDelete={() => removeComorbidity(item)} deleteLabel={`Apagar ${item}`}>
            <Card>
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Heart className="h-4 w-4 text-primary" />
                  </div>
                  <Badge variant="secondary">{item}</Badge>
                </div>
              </CardContent>
            </Card>
          </SwipeToDeleteItem>
        ))}
      </div>
    </div>
  );
}
