
import React from 'react';
import { SecurityEvent } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Camera, User, Car, Dog, AlertTriangle, WifiOff, Wifi, Settings, Activity } from 'lucide-react';

interface EventCardProps {
  event: SecurityEvent;
  onAcknowledge: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onAcknowledge }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const getEventIcon = () => {
    switch (event.eventType) {
      case 'motion': return <Activity className="h-4 w-4" />;
      case 'person': return <User className="h-4 w-4" />;
      case 'vehicle': return <Car className="h-4 w-4" />;
      case 'animal': return <Dog className="h-4 w-4" />;
      case 'tamper': return <AlertTriangle className="h-4 w-4" />;
      case 'offline': return <WifiOff className="h-4 w-4" />;
      case 'online': return <Wifi className="h-4 w-4" />;
      case 'system': return <Settings className="h-4 w-4" />;
      default: return <Camera className="h-4 w-4" />;
    }
  };

  const getSeverityClass = () => {
    switch (event.severity) {
      case 'high': return 'alert-high';
      case 'medium': return 'alert-medium';
      case 'low': return 'alert-low';
      default: return 'alert-info';
    }
  };

  const getSeverityLabel = () => {
    switch (event.severity) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Informativo';
    }
  };

  const getEventTypeLabel = () => {
    switch (event.eventType) {
      case 'motion': return 'Movimento';
      case 'person': return 'Pessoa';
      case 'vehicle': return 'Veículo';
      case 'animal': return 'Animal';
      case 'tamper': return 'Violação';
      case 'offline': return 'Offline';
      case 'online': return 'Online';
      case 'system': return 'Sistema';
      default: return event.eventType;
    }
  };

  return (
    <div className={`border rounded-md p-4 mb-3 ${getSeverityClass()}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="flex items-center gap-1">
              {getEventIcon()} {getEventTypeLabel()}
            </Badge>
            <Badge variant="outline">{getSeverityLabel()}</Badge>
            {event.acknowledged && (
              <Badge variant="secondary">Confirmado</Badge>
            )}
          </div>
          <h3 className="text-sm font-medium">{event.description}</h3>
          <div className="flex flex-col sm:flex-row sm:items-center text-xs mt-1 text-muted-foreground">
            <span className="mr-2"><Camera className="inline h-3 w-3 mr-1" />{event.cameraName}</span>
            <span><time dateTime={event.timestamp}>{formatDate(event.timestamp)}</time></span>
          </div>
        </div>
        
        {event.thumbnail && (
          <div className="ml-4 flex-shrink-0">
            <img 
              src={event.thumbnail} 
              alt={`Imagem de ${event.eventType}`} 
              className="h-16 w-16 object-cover rounded"
            />
          </div>
        )}
      </div>
      
      {!event.acknowledged && (
        <div className="mt-3 flex justify-end">
          <button 
            onClick={() => onAcknowledge(event.id)}
            className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
          >
            Confirmar Alerta
          </button>
        </div>
      )}
    </div>
  );
};

export default EventCard;
