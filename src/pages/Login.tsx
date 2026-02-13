import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart } from "lucide-react";
import { AuthProfile, getAuthProfile, nameToUsername, saveAuthProfile } from "@/lib/auth";

type LoginProps = {
  onLoginSuccess: () => void;
};

export default function Login({ onLoginSuccess }: LoginProps) {
  const profile = useMemo(() => getAuthProfile(), []);
  const expectedUsername = useMemo(() => nameToUsername(profile.elderName), [profile.elderName]);
  const expectedPassword = profile.birthDate;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [signupOpen, setSignupOpen] = useState(false);
  const [signupData, setSignupData] = useState<AuthProfile>(profile);

  const handleLogin = () => {
    if (username.trim().toLowerCase() === expectedUsername && password.trim() === expectedPassword) {
      onLoginSuccess();
      return;
    }

    setError("Login inválido. Use nome.sobrenome e a data de nascimento (AAAA-MM-DD).");
  };

  const handleCreateLogin = () => {
    if (!signupData.elderName || !signupData.birthDate) return;
    saveAuthProfile(signupData);
    setUsername(nameToUsername(signupData.elderName));
    setPassword(signupData.birthDate);
    setSignupOpen(false);
    setError("");
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto min-h-screen max-w-md bg-background border-x border-border shadow-sm flex items-center px-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-primary"><Heart className="h-5 w-5" /> CuidarBem</CardTitle>
            <p className="text-sm text-muted-foreground">Entrar no app com o login do idoso</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Login</Label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="nome.sobrenome" />
              <p className="text-xs text-muted-foreground">Formato esperado: <strong>{expectedUsername}</strong></p>
            </div>
            <div className="space-y-1.5">
              <Label>Senha</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="AAAA-MM-DD" />
              <p className="text-xs text-muted-foreground">Use a data de nascimento do idoso (AAAA-MM-DD).</p>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button className="w-full" onClick={handleLogin}>Entrar</Button>
            <Button variant="outline" className="w-full" onClick={() => setSignupOpen(true)}>Não tenho Login</Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={signupOpen} onOpenChange={setSignupOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Criar Login do Idoso</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nome completo do idoso</Label>
              <Input value={signupData.elderName} onChange={(e) => setSignupData((p) => ({ ...p, elderName: e.target.value }))} placeholder="Ex: Maria da Silva" />
            </div>
            <div className="space-y-1.5">
              <Label>Data de nascimento</Label>
              <Input type="date" value={signupData.birthDate} onChange={(e) => setSignupData((p) => ({ ...p, birthDate: e.target.value }))} />
            </div>
            <div className="rounded-md bg-muted p-3 text-sm">
              <p><strong>Login gerado:</strong> {nameToUsername(signupData.elderName)}</p>
              <p><strong>Senha:</strong> {signupData.birthDate || "-"}</p>
            </div>
            <Button className="w-full" onClick={handleCreateLogin}>Salvar Login</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
