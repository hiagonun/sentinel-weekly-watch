
import React from 'react';
import { DailySummary as DailySummaryType } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DailySummaryProps {
  summary: DailySummaryType;
  isSelected: boolean;
  onSelect: (date: string) => void;
}

const DailySummary: React.FC<DailySummaryProps> = ({ 
  summary, 
  isSelected,
  onSelect
}) => {
  const { date, totalEvents, highPriority, mediumPriority, lowPriority, infoPriority } = summary;
  
  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString);
    return {
      day: format(dateObj, 'dd', { locale: ptBR }),
      weekday: format(dateObj, 'EEE', { locale: ptBR })
    };
  };
  
  const formattedDate = formatDate(date);
  const hasEvents = totalEvents > 0;
  
  return (
    <Card 
      className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : 'hover:bg-accent'}`}
      onClick={() => onSelect(date)}
    >
      <CardHeader className="p-3 pb-0 text-center">
        <CardTitle className="text-lg font-semibold capitalize">{formattedDate.weekday}</CardTitle>
        <p className="text-2xl font-bold">{formattedDate.day}</p>
      </CardHeader>
      <CardContent className="p-3">
        {hasEvents ? (
          <>
            <div className="text-center mb-2">
              <span className="text-sm font-medium">{totalEvents} eventos</span>
            </div>
            <div className="space-y-1">
              {highPriority > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <Progress value={(highPriority / totalEvents) * 100} className="h-1 bg-red-100" />
                  <span>{highPriority}</span>
                </div>
              )}
              {mediumPriority > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <Progress value={(mediumPriority / totalEvents) * 100} className="h-1 bg-orange-100" />
                  <span>{mediumPriority}</span>
                </div>
              )}
              {lowPriority > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <Progress value={(lowPriority / totalEvents) * 100} className="h-1 bg-yellow-100" />
                  <span>{lowPriority}</span>
                </div>
              )}
              {infoPriority > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <Progress value={(infoPriority / totalEvents) * 100} className="h-1 bg-blue-100" />
                  <span>{infoPriority}</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground text-sm">
            Sem eventos
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailySummary;
