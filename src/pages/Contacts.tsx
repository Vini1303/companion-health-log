import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Phone, Ambulance, Shield, Flame, UserRound } from "lucide-react";

const contacts = [
  { name: "SAMU", number: "192", icon: Ambulance },
  { name: "Polícia", number: "190", icon: Shield },
  { name: "Bombeiros", number: "193", icon: Flame },
  { name: "Ambulância Particular", number: "(11) 3000-0000", icon: Ambulance },
  { name: "Filho", number: "(11) 98888-1111", icon: UserRound },
  { name: "Marido", number: "(11) 97777-2222", icon: UserRound },
  { name: "Neto", number: "(11) 96666-3333", icon: UserRound },
];

export default function Contacts() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return contacts;
    return contacts.filter((c) => c.name.toLowerCase().includes(query) || c.number.includes(query));
  }, [search]);

  return (
    <div className="space-y-4 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Ligações</h1>
        <p className="text-muted-foreground text-sm">Contatos importantes para urgências e familiares</p>
      </div>

      <Input
        placeholder="Buscar contato ou número"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="space-y-3">
        {filtered.map((contact) => (
          <Card key={contact.name}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <contact.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.number}</p>
                </div>
              </div>
              <a
                href={`tel:${contact.number.replace(/[^\d+]/g, "")}`}
                className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-accent"
              >
                <Phone className="h-4 w-4" /> Ligar
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Dica rápida</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Em situação de emergência, use primeiro os números oficiais (SAMU, Polícia e Bombeiros).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
