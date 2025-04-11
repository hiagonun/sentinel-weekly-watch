
import { SecurityEvent, WeeklySummary, DailySummary, EventType, EventSeverity } from '../types';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, addHours, subDays } from 'date-fns';

const cameraList = [
  { id: 'cam-001', name: 'Entrada Principal' },
  { id: 'cam-002', name: 'Estacionamento' },
  { id: 'cam-003', name: 'Recepção' },
  { id: 'cam-004', name: 'Corredor 1' },
  { id: 'cam-005', name: 'Corredor 2' },
  { id: 'cam-006', name: 'Área Externa' },
];

const eventTypes: EventType[] = ['motion', 'person', 'vehicle', 'animal', 'tamper', 'offline', 'online', 'system'];
const severityLevels: EventSeverity[] = ['high', 'medium', 'low', 'info'];

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getEventDescription = (type: EventType, camera: string): string => {
  switch (type) {
    case 'motion':
      return `Movimento detectado na câmera ${camera}`;
    case 'person':
      return `Pessoa detectada na câmera ${camera}`;
    case 'vehicle':
      return `Veículo detectado na câmera ${camera}`;
    case 'animal':
      return `Animal detectado na câmera ${camera}`;
    case 'tamper':
      return `Possível violação na câmera ${camera}`;
    case 'offline':
      return `Câmera ${camera} offline`;
    case 'online':
      return `Câmera ${camera} online`;
    case 'system':
      return `Alerta de sistema na câmera ${camera}`;
    default:
      return `Evento desconhecido na câmera ${camera}`;
  }
};

const getSeverityForEventType = (type: EventType): EventSeverity => {
  switch (type) {
    case 'tamper':
      return 'high';
    case 'person':
    case 'offline':
      return 'medium';
    case 'motion':
    case 'vehicle':
      return 'low';
    default:
      return 'info';
  }
};

export const generateMockEvents = (): SecurityEvent[] => {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  
  // Generate between 50-100 events for the week
  const eventCount = Math.floor(Math.random() * 50) + 50;
  const events: SecurityEvent[] = [];
  
  for (let i = 0; i < eventCount; i++) {
    // Random date within the week
    const daysAgo = Math.floor(Math.random() * 7);
    const hoursOffset = Math.floor(Math.random() * 24);
    const minutesOffset = Math.floor(Math.random() * 60);
    
    const eventDate = addHours(subDays(now, daysAgo), -hoursOffset);
    eventDate.setMinutes(minutesOffset);
    
    const camera = getRandomElement(cameraList);
    const eventType = getRandomElement(eventTypes);
    // Some events should have predetermined severity based on type
    const severity = Math.random() > 0.7 
      ? getRandomElement(severityLevels)
      : getSeverityForEventType(eventType);
    
    events.push({
      id: `event-${i}`,
      timestamp: eventDate.toISOString(),
      cameraId: camera.id,
      cameraName: camera.name,
      eventType,
      severity,
      description: getEventDescription(eventType, camera.name),
      location: camera.name,
      thumbnail: eventType !== 'offline' && eventType !== 'online' && eventType !== 'system'
        ? `https://source.unsplash.com/100x100/?security,camera,${eventType}`
        : undefined,
      acknowledged: Math.random() > 0.7,
    });
  }
  
  // Sort events by timestamp (newest first)
  return events.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

export const generateWeeklySummary = (events: SecurityEvent[]): WeeklySummary => {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  
  // Create daily summaries
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const dailySummaries: DailySummary[] = days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayEvents = events.filter(e => e.timestamp.startsWith(dayStr));
    
    return {
      date: dayStr,
      totalEvents: dayEvents.length,
      highPriority: dayEvents.filter(e => e.severity === 'high').length,
      mediumPriority: dayEvents.filter(e => e.severity === 'medium').length,
      lowPriority: dayEvents.filter(e => e.severity === 'low').length,
      infoPriority: dayEvents.filter(e => e.severity === 'info').length,
    };
  });
  
  // Count by camera
  const byCamera: Record<string, number> = {};
  events.forEach(event => {
    byCamera[event.cameraName] = (byCamera[event.cameraName] || 0) + 1;
  });
  
  // Count by event type
  const byEventType: Record<EventType, number> = {} as Record<EventType, number>;
  eventTypes.forEach(type => {
    byEventType[type] = events.filter(e => e.eventType === type).length;
  });
  
  // Count by severity
  const bySeverity: Record<EventSeverity, number> = {} as Record<EventSeverity, number>;
  severityLevels.forEach(level => {
    bySeverity[level] = events.filter(e => e.severity === level).length;
  });
  
  return {
    startDate: format(weekStart, 'yyyy-MM-dd'),
    endDate: format(weekEnd, 'yyyy-MM-dd'),
    totalEvents: events.length,
    dailySummaries,
    byCamera,
    byEventType,
    bySeverity,
  };
};

// Export the camera list for use in filters
export const cameras = cameraList;
