
import React from 'react';
import { EventType, EventSeverity } from '../types';
import { CheckIcon, Camera, Activity, User, Car, Dog, AlertTriangle, WifiOff, Wifi, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cameras } from '../data/mockEvents';

interface EventFiltersProps {
  selectedCameras: string[];
  setSelectedCameras: (cameras: string[]) => void;
  selectedEventTypes: EventType[];
  setSelectedEventTypes: (types: EventType[]) => void;
  selectedSeverities: EventSeverity[];
  setSelectedSeverities: (severities: EventSeverity[]) => void;
  acknowledgedFilter: 'all' | 'acknowledged' | 'unacknowledged';
  setAcknowledgedFilter: (filter: 'all' | 'acknowledged' | 'unacknowledged') => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  selectedCameras,
  setSelectedCameras,
  selectedEventTypes,
  setSelectedEventTypes,
  selectedSeverities,
  setSelectedSeverities,
  acknowledgedFilter,
  setAcknowledgedFilter,
}) => {
  const toggleCamera = (cameraId: string) => {
    if (selectedCameras.includes(cameraId)) {
      setSelectedCameras(selectedCameras.filter(id => id !== cameraId));
    } else {
      setSelectedCameras([...selectedCameras, cameraId]);
    }
  };

  const toggleEventType = (type: EventType) => {
    if (selectedEventTypes.includes(type)) {
      setSelectedEventTypes(selectedEventTypes.filter(t => t !== type));
    } else {
      setSelectedEventTypes([...selectedEventTypes, type]);
    }
  };

  const toggleSeverity = (severity: EventSeverity) => {
    if (selectedSeverities.includes(severity)) {
      setSelectedSeverities(selectedSeverities.filter(s => s !== severity));
    } else {
      setSelectedSeverities([...selectedSeverities, severity]);
    }
  };

  const eventTypeLabels: Record<EventType, { icon: JSX.Element, label: string }> = {
    motion: { icon: <Activity className="h-4 w-4" />, label: 'Movimento' },
    person: { icon: <User className="h-4 w-4" />, label: 'Pessoa' },
    vehicle: { icon: <Car className="h-4 w-4" />, label: 'Veículo' },
    animal: { icon: <Dog className="h-4 w-4" />, label: 'Animal' },
    tamper: { icon: <AlertTriangle className="h-4 w-4" />, label: 'Violação' },
    offline: { icon: <WifiOff className="h-4 w-4" />, label: 'Offline' },
    online: { icon: <Wifi className="h-4 w-4" />, label: 'Online' },
    system: { icon: <Settings className="h-4 w-4" />, label: 'Sistema' },
  };

  const severityLabels: Record<EventSeverity, { colorClass: string, label: string }> = {
    high: { colorClass: 'bg-red-500', label: 'Alta' },
    medium: { colorClass: 'bg-orange-500', label: 'Média' },
    low: { colorClass: 'bg-yellow-500', label: 'Baixa' },
    info: { colorClass: 'bg-blue-500', label: 'Informativa' },
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Câmeras</h3>
        <div className="flex flex-wrap gap-2">
          {cameras.map(camera => (
            <Badge
              key={camera.id}
              variant={selectedCameras.includes(camera.id) ? "default" : "outline"}
              className="cursor-pointer flex items-center gap-1"
              onClick={() => toggleCamera(camera.id)}
            >
              <Camera className="h-3 w-3" />
              {camera.name}
              {selectedCameras.includes(camera.id) && (
                <CheckIcon className="h-3 w-3 ml-1" />
              )}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Tipo de Evento</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(eventTypeLabels).map(([type, { icon, label }]) => (
            <Badge
              key={type}
              variant={selectedEventTypes.includes(type as EventType) ? "default" : "outline"}
              className="cursor-pointer flex items-center gap-1"
              onClick={() => toggleEventType(type as EventType)}
            >
              {icon}
              {label}
              {selectedEventTypes.includes(type as EventType) && (
                <CheckIcon className="h-3 w-3 ml-1" />
              )}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Severidade</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(severityLabels).map(([severity, { colorClass, label }]) => (
            <Badge
              key={severity}
              variant={selectedSeverities.includes(severity as EventSeverity) ? "default" : "outline"}
              className="cursor-pointer flex items-center gap-1"
              onClick={() => toggleSeverity(severity as EventSeverity)}
            >
              <span className={`w-2 h-2 rounded-full ${colorClass}`}></span>
              {label}
              {selectedSeverities.includes(severity as EventSeverity) && (
                <CheckIcon className="h-3 w-3 ml-1" />
              )}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Status</h3>
        <div className="flex gap-2">
          <Badge
            variant={acknowledgedFilter === 'all' ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setAcknowledgedFilter('all')}
          >
            Todos
            {acknowledgedFilter === 'all' && (
              <CheckIcon className="h-3 w-3 ml-1" />
            )}
          </Badge>
          <Badge
            variant={acknowledgedFilter === 'acknowledged' ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setAcknowledgedFilter('acknowledged')}
          >
            Confirmados
            {acknowledgedFilter === 'acknowledged' && (
              <CheckIcon className="h-3 w-3 ml-1" />
            )}
          </Badge>
          <Badge
            variant={acknowledgedFilter === 'unacknowledged' ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setAcknowledgedFilter('unacknowledged')}
          >
            Não Confirmados
            {acknowledgedFilter === 'unacknowledged' && (
              <CheckIcon className="h-3 w-3 ml-1" />
            )}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
