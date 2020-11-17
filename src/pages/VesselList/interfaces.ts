export interface IVessel {
  imo: number;
  name: string;
}

export interface IPortMetadata {
  name: string;
  arrivalsCount: number;
  portCallsCount: number;
  callDuration: number;
}

export interface LogEntry {
  arrival: string | null;
  createdDate: string;
  departure: string | null;
  isOmitted: boolean | null;
  updatedField: string;
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
