
import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { SecurityEvent, EventType, EventSeverity } from '../types';
import { generateMockEvents, generateWeeklySummary } from '../data/mockEvents';
import EventCard from '../components/EventCard';
import DailySummary from '../components/DailySummary';
import EventFilters from '../components/EventFilters';
import WeeklySummaryChart from '../components/WeeklySummaryChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar,
  ChevronDown, 
  Filter, 
  RefreshCw, 
  SlidersHorizontal, 
  ChartBar, 
  AlertCircle, 
  Check, 
  X
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<SecurityEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedCameras, setSelectedCameras] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<EventSeverity[]>([]);
  const [acknowledgedFilter, setAcknowledgedFilter] = useState<'all' | 'acknowledged' | 'unacknowledged'>('all');

  // Load data on mount
  useEffect(() => {
    const mockEvents = generateMockEvents();
    setEvents(mockEvents);
    
    // Set initial selected date to today or the most recent day with events
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  // Filter events when filters or selected date changes
  useEffect(() => {
    let filtered = [...events];
    
    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(event => event.timestamp.startsWith(selectedDate));
    }
    
    // Apply camera filter
    if (selectedCameras.length > 0) {
      filtered = filtered.filter(event => selectedCameras.includes(event.cameraId));
    }
    
    // Apply event type filter
    if (selectedEventTypes.length > 0) {
      filtered = filtered.filter(event => selectedEventTypes.includes(event.eventType));
    }
    
    // Apply severity filter
    if (selectedSeverities.length > 0) {
      filtered = filtered.filter(event => selectedSeverities.includes(event.severity));
    }
    
    // Apply acknowledged filter
    if (acknowledgedFilter !== 'all') {
      filtered = filtered.filter(event => 
        acknowledgedFilter === 'acknowledged' ? event.acknowledged : !event.acknowledged
      );
    }
    
    setFilteredEvents(filtered);
  }, [
    events, 
    selectedDate, 
    selectedCameras, 
    selectedEventTypes, 
    selectedSeverities, 
    acknowledgedFilter
  ]);

  const handleAcknowledge = (id: string) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === id ? { ...event, acknowledged: true } : event
      )
    );
    
    toast({
      title: "Evento confirmado",
      description: "O evento foi marcado como confirmado.",
      duration: 3000,
    });
  };

  const refreshData = () => {
    const newEvents = generateMockEvents();
    setEvents(newEvents);
    
    toast({
      title: "Dados atualizados",
      description: "Os eventos da semana foram atualizados.",
      duration: 3000,
    });
  };

  const clearFilters = () => {
    setSelectedCameras([]);
    setSelectedEventTypes([]);
    setSelectedSeverities([]);
    setAcknowledgedFilter('all');
    
    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram removidos.",
      duration: 3000,
    });
  };
  
  const weeklySummary = generateWeeklySummary(events);
  const hasActiveFilters = selectedCameras.length > 0 || 
                         selectedEventTypes.length > 0 || 
                         selectedSeverities.length > 0 || 
                         acknowledgedFilter !== 'all';

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    const date = parseISO(selectedDate);
    return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="container mx-auto py-4 px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                Relatório Semanal de Segurança
              </h1>
              <p className="text-muted-foreground">
                {format(parseISO(weeklySummary.startDate), "d 'de' MMMM", { locale: ptBR })} - 
                {format(parseISO(weeklySummary.endDate), " d 'de' MMMM, yyyy", { locale: ptBR })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        {/* Week Summary (7 days) */}
        <section className="mb-6">
          <div className="grid grid-cols-7 gap-2">
            {weeklySummary.dailySummaries.map((day) => (
              <DailySummary
                key={day.date}
                summary={day}
                isSelected={day.date === selectedDate}
                onSelect={setSelectedDate}
              />
            ))}
          </div>
        </section>

        <div className="mb-4">
          <Tabs defaultValue="events">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="events" className="flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Eventos
                </TabsTrigger>
                <TabsTrigger value="statistics" className="flex items-center gap-1">
                  <ChartBar className="h-4 w-4" />
                  Estatísticas
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Limpar filtros
                  </Button>
                )}
                <Button
                  variant={showFilters ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1"
                >
                  {showFilters ? <Check className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
                  Filtros
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1">
                      {selectedCameras.length + selectedEventTypes.length + 
                       selectedSeverities.length + (acknowledgedFilter !== 'all' ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
            
            {showFilters && (
              <Card className="mb-4">
                <CardContent className="pt-4">
                  <EventFilters
                    selectedCameras={selectedCameras}
                    setSelectedCameras={setSelectedCameras}
                    selectedEventTypes={selectedEventTypes}
                    setSelectedEventTypes={setSelectedEventTypes}
                    selectedSeverities={selectedSeverities}
                    setSelectedSeverities={setSelectedSeverities}
                    acknowledgedFilter={acknowledgedFilter}
                    setAcknowledgedFilter={setAcknowledgedFilter}
                  />
                </CardContent>
              </Card>
            )}

            <TabsContent value="events" className="mt-0">
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {formatSelectedDate()}
                    </CardTitle>
                    <CardDescription>
                      {filteredEvents.length} eventos {hasActiveFilters && "(filtrados)"}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredEvents.length > 0 ? (
                    <div className="space-y-3">
                      {filteredEvents.map(event => (
                        <EventCard 
                          key={event.id} 
                          event={event} 
                          onAcknowledge={handleAcknowledge}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Nenhum evento encontrado para esta data/filtros.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="statistics" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo da Semana</CardTitle>
                  <CardDescription>
                    Total de {events.length} eventos registrados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <WeeklySummaryChart summary={weeklySummary} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
