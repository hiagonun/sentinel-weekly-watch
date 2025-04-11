
import React from 'react';
import { WeeklySummary } from '../types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface WeeklySummaryChartProps {
  summary: WeeklySummary;
}

const WeeklySummaryChart: React.FC<WeeklySummaryChartProps> = ({ summary }) => {
  // Format data for charts
  const dailyEventData = summary.dailySummaries.map(day => ({
    date: format(parseISO(day.date), 'EEE', { locale: ptBR }),
    Alta: day.highPriority,
    Média: day.mediumPriority,
    Baixa: day.lowPriority,
    Info: day.infoPriority,
  }));

  const cameraData = Object.entries(summary.byCamera).map(([camera, count]) => ({
    name: camera,
    value: count,
  }));

  const eventTypeData = Object.entries(summary.byEventType)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => {
      let name = type;
      switch (type) {
        case 'motion': name = 'Movimento'; break;
        case 'person': name = 'Pessoa'; break;
        case 'vehicle': name = 'Veículo'; break;
        case 'animal': name = 'Animal'; break;
        case 'tamper': name = 'Violação'; break;
        case 'offline': name = 'Offline'; break;
        case 'online': name = 'Online'; break;
        case 'system': name = 'Sistema'; break;
      }
      return { name, value: count };
    });

  const severityData = [
    { name: 'Alta', value: summary.bySeverity.high, color: '#ef4444' },
    { name: 'Média', value: summary.bySeverity.medium, color: '#f97316' },
    { name: 'Baixa', value: summary.bySeverity.low, color: '#eab308' },
    { name: 'Info', value: summary.bySeverity.info, color: '#3b82f6' },
  ].filter(item => item.value > 0);

  const formatDate = (date: string) => {
    return format(parseISO(date), "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Eventos Diários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyEventData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  barSize={20}
                >
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Alta" stackId="a" fill="#ef4444" />
                  <Bar dataKey="Média" stackId="a" fill="#f97316" />
                  <Bar dataKey="Baixa" stackId="a" fill="#eab308" />
                  <Bar dataKey="Info" stackId="a" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Distribuição por Severidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Eventos por Câmera</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cameraData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Eventos por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventTypeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {eventTypeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeeklySummaryChart;
