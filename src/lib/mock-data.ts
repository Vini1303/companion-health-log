export const patient = {
  id: "1",
  name: "Maria da Silva",
  birthDate: "1940-03-15",
  age: 85,
  photo: "",
  bloodType: "O+",
  emergencyContact: "João da Silva - (11) 99999-8888",
  comorbidities: ["Hipertensão", "Diabetes Tipo 2", "Artrite"],
  medicalHistory: "Cirurgia de quadril em 2019. Acompanhamento cardiológico regular.",
};

export const vitals = [
  { id: "1", date: "2026-02-13T08:00", systolic: 130, diastolic: 85, heartRate: 72, temperature: 36.2, glucose: 110, recordedBy: "Ana" },
  { id: "2", date: "2026-02-12T08:00", systolic: 125, diastolic: 80, heartRate: 70, temperature: 36.5, glucose: 105, recordedBy: "Ana" },
  { id: "3", date: "2026-02-11T08:00", systolic: 140, diastolic: 90, heartRate: 78, temperature: 36.8, glucose: 130, recordedBy: "Carlos" },
  { id: "4", date: "2026-02-10T08:00", systolic: 135, diastolic: 88, heartRate: 75, temperature: 36.3, glucose: 115, recordedBy: "Ana" },
  { id: "5", date: "2026-02-09T08:00", systolic: 128, diastolic: 82, heartRate: 71, temperature: 36.4, glucose: 108, recordedBy: "Carlos" },
  { id: "6", date: "2026-02-08T08:00", systolic: 145, diastolic: 95, heartRate: 80, temperature: 37.1, glucose: 140, recordedBy: "Ana" },
  { id: "7", date: "2026-02-07T08:00", systolic: 132, diastolic: 84, heartRate: 73, temperature: 36.6, glucose: 112, recordedBy: "Ana" },
];

export const medications = [
  { id: "1", name: "Losartana 50mg", dosage: "1 comprimido", frequency: "2x ao dia", times: ["08:00", "20:00"], description: "Anti-hipertensivo", active: true },
  { id: "2", name: "Metformina 850mg", dosage: "1 comprimido", frequency: "2x ao dia", times: ["07:00", "19:00"], description: "Controle de glicemia", active: true },
  { id: "3", name: "AAS 100mg", dosage: "1 comprimido", frequency: "1x ao dia", times: ["12:00"], description: "Antiagregante plaquetário", active: true },
  { id: "4", name: "Omeprazol 20mg", dosage: "1 cápsula", frequency: "1x ao dia", times: ["06:30"], description: "Protetor gástrico", active: true },
  { id: "5", name: "Cálcio + Vitamina D", dosage: "1 comprimido", frequency: "1x ao dia", times: ["10:00"], description: "Suplementação óssea", active: true },
];

export const medicationLog = [
  { id: "1", medicationId: "1", takenAt: "2026-02-13T08:05", takenBy: "Ana" },
  { id: "2", medicationId: "4", takenAt: "2026-02-13T06:35", takenBy: "Ana" },
  { id: "3", medicationId: "2", takenAt: "2026-02-13T07:10", takenBy: "Ana" },
];

export const exams = [
  { id: "1", type: "Hemograma Completo", requestedDate: "2026-02-01", expectedDate: "2026-02-15", doctor: "Dr. Roberto", status: "pendente", notes: "" },
  { id: "2", type: "Glicemia em Jejum", requestedDate: "2026-01-20", expectedDate: "2026-01-25", doctor: "Dra. Fernanda", status: "concluído", notes: "Resultado dentro da normalidade", resultUrl: "" },
  { id: "3", type: "Ecocardiograma", requestedDate: "2026-02-05", expectedDate: "2026-02-20", doctor: "Dr. Roberto", status: "agendado", notes: "Agendar no Hospital São Paulo" },
];

export const allergies = [
  { id: "1", name: "Dipirona", type: "medicamentosa" as const, severity: "alta" as const, reaction: "Edema de glote", notes: "Contraindicação absoluta" },
  { id: "2", name: "Camarão", type: "alimentar" as const, severity: "média" as const, reaction: "Urticária e coceira", notes: "Evitar frutos do mar em geral" },
  { id: "3", name: "Penicilina", type: "medicamentosa" as const, severity: "alta" as const, reaction: "Anafilaxia", notes: "Usar alternativas como azitromicina" },
];

export const nutrition = {
  plan: [
    { meal: "Café da manhã", time: "07:00", description: "Pão integral, frutas, chá sem açúcar" },
    { meal: "Lanche da manhã", time: "09:30", description: "Iogurte natural com aveia" },
    { meal: "Almoço", time: "12:00", description: "Arroz integral, feijão, proteína magra, salada verde" },
    { meal: "Lanche da tarde", time: "15:00", description: "Frutas picadas ou biscoito integral" },
    { meal: "Jantar", time: "18:30", description: "Sopa leve ou refeição similar ao almoço (porção menor)" },
    { meal: "Ceia", time: "20:30", description: "Chá de camomila com torrada" },
  ],
  restrictions: ["Açúcar refinado", "Sal em excesso", "Frituras", "Embutidos"],
  notes: "Hidratação: mínimo 1,5L de água por dia. Preferir alimentos ricos em fibras.",
};

export const notifications = [
  { id: "1", type: "medication" as const, message: "Hora de tomar Losartana 50mg", time: "08:00", read: false },
  { id: "2", type: "medication" as const, message: "Hora de tomar Metformina 850mg", time: "07:00", read: true },
  { id: "3", type: "exam" as const, message: "Hemograma Completo marcado para 15/02", time: "2026-02-13", read: false },
  { id: "4", type: "vital" as const, message: "Pressão arterial elevada: 145/95 mmHg", time: "2026-02-08", read: true },
];
