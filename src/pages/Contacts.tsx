import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Phone, Ambulance, Shield, Flame, UserRound, Plus, NotebookPen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Contact = {
  id: string;
  name: string;
  number: string;
  icon: "ambulance" | "shield" | "flame" | "user";
};

const STORAGE_KEY = "care:contacts";

const initialContacts: Contact[] = [
  { id: "1", name: "SAMU", number: "192", icon: "ambulance" },
  { id: "2", name: "Polícia", number: "190", icon: "shield" },
  { id: "3", name: "Bombeiros", number: "193", icon: "flame" },
  { id: "4", name: "Ambulância Particular", number: "(11) 3000-0000", icon: "ambulance" },
];

function IconByType({ type }: { type: Contact["icon"] }) {
  if (type === "ambulance") return <Ambulance className="h-5 w-5 text-primary" />;
  if (type === "shield") return <Shield className="h-5 w-5 text-primary" />;
  if (type === "flame") return <Flame className="h-5 w-5 text-primary" />;
  return <UserRound className="h-5 w-5 text-primary" />;
}

export default function Contacts() {
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [form, setForm] = useState({ name: "", number: "" });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setContacts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return contacts;
    return contacts.filter((c) => c.name.toLowerCase().includes(query) || c.number.includes(query));
  }, [contacts, search]);

  const addContact = () => {
    if (!form.name || !form.number) return;

    const newContact: Contact = {
      id: Date.now().toString(),
      name: form.name,
      number: form.number,
      icon: "user",
    };

    setContacts((prev) => [newContact, ...prev]);
    setForm({ name: "", number: "" });
    setAddOpen(false);
  };

  const saveEdit = () => {
    if (!editing || !form.name || !form.number) return;

    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === editing.id ? { ...contact, name: form.name, number: form.number } : contact,
      ),
    );

    setEditing(null);
    setForm({ name: "", number: "" });
  };

  const removeContact = (contactId: string) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== contactId));
    if (editing?.id === contactId) {
      setEditing(null);
      setForm({ name: "", number: "" });
    }
  };

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Ligações</h1>
          <p className="text-muted-foreground text-sm">Contatos importantes para urgências e familiares</p>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="icon" aria-label="Adicionar número">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo contato</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Nome</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Cuidadora"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Número</Label>
                <Input
                  value={form.number}
                  onChange={(e) => setForm((prev) => ({ ...prev, number: e.target.value }))}
                  placeholder="Ex: (11) 95555-4444"
                />
              </div>
              <Button className="w-full" onClick={addContact}>
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Input placeholder="Buscar contato ou número" value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="space-y-3">
        {filtered.map((contact) => (
          <Card key={contact.id}>
            <CardContent className="p-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <IconByType type={contact.icon} />
                </div>
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.number}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Editar contato"
                  onClick={() => {
                    setEditing(contact);
                    setForm({ name: contact.name, number: contact.number });
                  }}
                >
                  <NotebookPen className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" aria-label="Excluir contato" onClick={() => removeContact(contact.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                <a
                  href={`tel:${contact.number.replace(/[^\d+]/g, "")}`}
                  className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-accent"
                >
                  <Phone className="h-4 w-4" /> Ligar
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar contato</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nome</Label>
              <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Número</Label>
              <Input value={form.number} onChange={(e) => setForm((prev) => ({ ...prev, number: e.target.value }))} />
            </div>
            <Button className="w-full" onClick={saveEdit}>
              Salvar alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
