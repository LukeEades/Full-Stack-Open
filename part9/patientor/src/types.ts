export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}
export enum EntryType {
  HealthCheck = "HealthCheck",
  OccupationalHealthcare = "OccupationalHealthcare",
  Hospital = "Hospital",
}

interface BaseEntry {
  id: string;
  date: string;
  description: string;
  specialist: string;
  type: EntryType;
  diagnosisCodes?: Array<string>;
}

interface HealthCheckEntry extends BaseEntry {
  healthCheckRating: number;
  type: EntryType.HealthCheck;
}

interface OccupationalHealthcareEntry extends BaseEntry {
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
  type: EntryType.OccupationalHealthcare;
}

interface HospitalEntry extends BaseEntry {
  discharge: {
    date: string;
    criteria: string;
  };
  type: EntryType.Hospital;
}

type Entry = HealthCheckEntry | OccupationalHealthcareEntry | HospitalEntry;

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: Entry[];
}

export const assertNever = (item: never) => {
  throw new Error(`Unused type error: ${JSON.stringify(item)}`);
};

export type { Entry };
export type PatientFormValues = Omit<Patient, "id" | "entries">;
