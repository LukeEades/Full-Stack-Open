interface Diagnosis {
    code: string;
    name: string;
    latin?: string;
}

export enum EntryType {
    HealthCheck = "HealthCheck",
    OccupationalHealthcare = "OccupationalHealthcare",
    Hospital = "Hospital",
}

export interface BaseEntry {
    id: string;
    date: string;
    specialist: string;
    type: EntryType;
    diagnosisCodes?: Array<string>;
    description: string;
}

interface HealthCheckEntry extends BaseEntry{
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

enum Gender {
    Male = "male",
    Female = "female",
    Other = "other",
}

interface Patient {
    id: string;
    name: string;
    dateOfBirth: string;
    ssn: string;
    gender: Gender;
    occupation: string;
    entries: Entry[];
}
export const assertNever = (data: never) => {
    throw new Error(`type unused: ${JSON.stringify(data)}`)
}

type PatientWithoutSSN = Omit<Patient, "ssn">;
type NonSensitivePatient = Omit<Patient, "ssn" | "entries">;

export { Diagnosis, Patient, PatientWithoutSSN, NonSensitivePatient, Gender, Entry}