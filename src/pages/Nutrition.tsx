import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Apple, Clock, AlertTriangle, UtensilsCrossed } from "lucide-react";
import { nutrition } from "@/lib/mock-data";

export default function Nutrition() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Nutrição</h1>
        <p className="text-muted-foreground text-sm">Plano alimentar e restrições</p>
      </div>

      {/* Restrictions alert */}
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <p className="text-sm font-semibold text-warning">Restrições Alimentares</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {nutrition.restrictions.map((r, i) => (
              <Badge key={i} variant="outline" className="border-warning/30 text-warning">{r}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meal plan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            Plano de Refeições
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {nutrition.plan.map((meal, i) => (
            <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                <Apple className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{meal.meal}</p>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {meal.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{meal.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Observações Nutricionais</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{nutrition.notes}</p>
        </CardContent>
      </Card>
    </div>
  );
}
