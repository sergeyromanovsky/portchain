import { IVessel } from 'pages/VesselList';

export interface LogEntry {
  arrival: string;
  createdDate: string;
  departure: string;
  isOmitted: boolean | null;
  updatedField: 'arrival' | 'departure';
}
export interface IPortCall {
  arrival: string;
  createdDate: string;
  departure: string;
  isOmitted: boolean;
  logEntries: LogEntry[];
  port: { id: string; name: string };
  service: string;
}

export interface IVesselDetails {
  vessel: IVessel;
  portCalls: IPortCall[];
}
