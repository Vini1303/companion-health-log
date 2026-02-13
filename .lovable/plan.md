

## Sistema de Gestão de Cuidados para Idosos - Home Care

### Visão Geral
Um aplicativo completo para cuidadores e auxiliares acompanharem todos os aspectos da saúde e bem-estar de um idoso sob sua responsabilidade, com registros de sinais vitais, medicamentos, exames, nutrição e alergias, além de notificações automáticas para horários de medicação.

### Estrutura Principal

#### 1. **Autenticação e Acesso**
- Login para cuidadores/auxiliares
- Cada cuidador está vinculado a um único idoso
- Possibilidade de múltiplos cuidadores para o mesmo idoso (com código de convite)
- Dashboard personalizado após login

#### 2. **Perfil do Idoso**
- Cadastro completo: nome, data de nascimento, foto, contatos de emergência
- Informações médicas: tipo sanguíneo, comorbidades, histórico médico
- Visualização central de todas as informações do paciente

#### 3. **Sinais Vitais** (Pressão Arterial, Frequência Cardíaca, Temperatura, Glicemia)
- Registro diário com data, hora e valores
- Gráficos de evolução temporal
- Alertas para valores fora dos limites normais (configuráveis)
- Histórico completo com opção de editar registros passados

#### 4. **Medicamentos**
- Cadastro de medicamentos com dosagem, descrição, frequência
- Agendamento de horários de medicação (diários, semanais, específicos)
- Notificações automáticas nos horários agendados
- Marcação de "medicamento tomado" com timestamp
- Histórico de administração

#### 5. **Exames**
- Registro de exames solicitados (tipo, data esperada, médico)
- Upload de resultado de exames (PDF, imagem)
- Visualização e arquivo de resultados
- Anotações sobre interpretação dos resultados

#### 6. **Alergias**
- Registro de alergias conhecidas (medicamentosas e alimentares)
- Descrição de reações e gravidade
- Destaque visual para avisar cuidadores

#### 7. **Nutrição**
- Plano nutricional do idoso (refeições recomendadas)
- Restrições alimentares
- Registro de refeições consumidas
- Anotações sobre apetite e preferências

#### 8. **Dashboard Principal**
- Resumo do dia: próximos medicamentos, sinais vitais recentes, alertas
- Gráficos rápidos de tendências de sinais vitais
- Próximos compromissos e exames
- Notificações pendentes

#### 9. **Notificações e Lembretes**
- Alertas push/notificações para horários de medicação
- Alertas para valores anormais de sinais vitais
- Lembrete de exames próximos
- Histórico de notificações

#### 10. **Relatórios**
- Relatório semanal/mensal de sinais vitais
- Resumo de medicamentos administrados
- Histórico de exames e resultados
- Exportação de dados para médicos

### User Experience
- Interface limpa e intuitiva, fácil de usar mesmo para usuários sem experiência
- Navegação clara com abas principais para cada seção
- Cards informativos com dados essenciais destacados
- Formulários simples e validados
- Visualização de históricos em listas com filtros
- Ícones e cores para distinguir tipos de dados

### Fluxo de Usuário Principal
1. Login → Dashboard
2. Visualizar sinais vitais/alertas/próximos medicamentos
3. Registrar sinais vitais ou marcar medicamento como tomado
4. Acessar seções específicas (medicamentos, exames, nutrição, alergias)
5. Adicionar ou editar informações
6. Receber notificações automáticas em horários configurados

### Funcionalidades de Segurança
- Autenticação segura
- Cada cuidador acessa apenas seu idoso associado
- Histórico de ações (quem registrou o quê e quando)
- Backup automático de dados

