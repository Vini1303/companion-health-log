import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Heart, Phone, Calendar, Droplets, FileText } from "lucide-react";
import { patient } from "@/lib/mock-data";
import { format, differenceInYears } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function PatientProfile() {
  const birthDate = new Date(patient.birthDate);
  const age = differenceInYears(new Date(), birthDate);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Perfil do Paciente</h1>
        <p className="text-muted-foreground text-sm">Informações gerais e médicas</p>
      </div>

      {/* Basic info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{patient.name}</h2>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(birthDate, "dd/MM/yyyy", { locale: ptBR })} ({age} anos)
                </span>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Droplets className="h-3 w-3" />
                  {patient.bloodType}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency contact */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Phone className="h-4 w-4 text-destructive" />
            Contato de Emergência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{patient.emergencyContact}</p>
        </CardContent>
      </Card>

      {/* Comorbidities */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            Comorbidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {patient.comorbidities.map((c, i) => (
              <Badge key={i} variant="secondary">{c}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medical history */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-accent" />
            Histórico Médico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{patient.medicalHistory}</p>
        </CardContent>
      </Card>
    </div>
  );
}
