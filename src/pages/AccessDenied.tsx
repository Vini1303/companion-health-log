import { ShieldAlert } from "lucide-react";

export default function AccessDenied() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center space-y-3">
        <ShieldAlert className="mx-auto h-8 w-8 text-destructive" />
        <h1 className="text-2xl font-semibold">Acesso negado</h1>
        <p className="text-sm text-muted-foreground">
          Seu perfil não possui permissão para acessar esta página.
        </p>
      </div>
    </div>
  );
}
