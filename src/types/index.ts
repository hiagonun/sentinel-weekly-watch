
export type EventSeverity = 'high' | 'medium' | 'low' | 'info';

export type EventType = 'motion' | 'person' | 'vehicle' | 'animal' | 'tamper' | 'offline' | 'online' | 'system';

export interface SecurityEvent {
  id: string;
  timestamp: string;
  cameraId: string;
  cameraName: string;
  eventType: EventType;
  severity: EventSeverity;
  description: string;
  location?: string;
  thumbnail?: string;
  acknowledged: boolean;
}

export interface DailySummary {
  date: string;
  totalEvents: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  infoPriority: number;
}

export interface WeeklySummary {
  startDate: string;
  endDate: string;
  totalEvents: number;
  dailySummaries: DailySummary[];
  byCamera: Record<string, number>;
  byEventType: Record<EventType, number>;
  bySeverity: Record<EventSeverity, number>;
}
