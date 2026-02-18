import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Heart, Calendar, Droplets, FileText } from "lucide-react";
import { patient } from "@/lib/mock-data";
import { ELDER_INFO_KEY, getAuthProfile } from "@/lib/auth";
import { format, differenceInYears, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

type ElderInfoStored = {
  name?: string;
  age?: string;
  phone?: string;
  sex?: string;
  address?: string;
  birthDate?: string;
};

function getPatientViewData() {
  const profile = getAuthProfile();

  const saved = localStorage.getItem(ELDER_INFO_KEY);
  const elderData = saved ? (JSON.parse(saved) as ElderInfoStored) : null;

  const name = elderData?.name?.trim() || profile.elderName || patient.name;
  const birthDateValue = elderData?.birthDate || profile.birthDate || patient.birthDate;
  const birthDate = new Date(birthDateValue);
  const validBirthDate = isValid(birthDate) ? birthDate : new Date(patient.birthDate);

  const age = elderData?.age?.trim() ? Number(elderData.age) : differenceInYears(new Date(), validBirthDate);

  return {
    name,
    birthDate: validBirthDate,
    age,
    bloodType: patient.bloodType,
    comorbidities: patient.comorbidities,
    medicalHistory: patient.medicalHistory,
  };
}

export default function PatientProfile() {
  const patientData = getPatientViewData();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Perfil do Paciente</h1>
        <p className="text-muted-foreground text-sm">Informações gerais e médicas</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{patientData.name}</h2>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(patientData.birthDate, "dd/MM/yyyy", { locale: ptBR })} ({patientData.age} anos)
                </span>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Droplets className="h-3 w-3" />
                  {patientData.bloodType}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            Comorbidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {patientData.comorbidities.map((c, i) => (
              <Badge key={i} variant="secondary">
                {c}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-accent" />
            Histórico Médico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{patientData.medicalHistory}</p>
        </CardContent>
      </Card>
    </div>
  );
}
