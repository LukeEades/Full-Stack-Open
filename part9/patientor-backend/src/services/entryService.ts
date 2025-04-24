import { Entry, EntryType, BaseEntry, Diagnosis } from "../types"
import { v1 as uuid } from "uuid"
import { z } from "zod"
const parseToEntry = (data: unknown): Entry => {
  if (!data || !(typeof data == "object" || data instanceof Object)) {
    throw new Error("isn't a valid object")
  }
  if (!("date" in data && "specialist" in data && "type" in data && "description" in data)) {
    throw new Error("entry missing required parameters")
  }
  data.type = z.nativeEnum(EntryType).parse(data.type)
  switch (data.type) {
    case EntryType.HealthCheck: {
      return parseHealthCheckEntry(data)
    }
    case EntryType.Hospital: {
      return parseHospitalEntry(data)
    }
    case EntryType.OccupationalHealthcare: {
      return parseOccupationalHealthcareEntry(data)
    }
    default: {
      throw new Error("unsupported entry type")
    }
  }
}

const parseOccupationalHealthcareEntry = (data: object) => {
  if (!("employerName" in data)) {
    throw new Error("entry missing required parameters")
  }
  const baseEntry = parseBaseEntry(data)
  const entry: Entry = {
    ...baseEntry,
    type: EntryType.OccupationalHealthcare,
    employerName: z.string().parse(data.employerName)
  }
  if ("sickLeave" in data) {
    entry.sickLeave = z.object({startDate: z.string(), endDate: z.string()}).parse(data.sickLeave)
  }
  return entry
}

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> =>  {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const parseBaseEntry = (data: object): BaseEntry => {
  if (!("date" in data && "specialist" in data && "type" in data && "description" in data)) {
    throw new Error("entry missing required parameters")
  }
  const {specialist, date, type, description} = data
  const entry: BaseEntry = {
    specialist: z.string().parse(specialist),
    date: z.string().date().parse(date),
    type: z.nativeEnum(EntryType).parse(type),
    description: z.string().parse(description),
    id: uuid()
  }
  
  if ("diagnosisCodes" in data) {
    entry.diagnosisCodes = parseDiagnosisCodes(data)
  }
  return entry
}

const parseHealthCheckEntry = (data: object): Entry => {
  if (!("healthCheckRating" in data)) {
    throw new Error("entry missing required parameters")
  }
  const baseEntry = parseBaseEntry(data)
  return {
    ...baseEntry,
    type: EntryType.HealthCheck,
    healthCheckRating: z.number().parse(data.healthCheckRating)
  }
}

const parseHospitalEntry = (data: object): Entry => {
  if (!("discharge" in data)) {
    throw new Error("missing required parameters")
  }
  const baseEntry = parseBaseEntry(data)
  return {
    ...baseEntry,
    type: EntryType.Hospital,
    discharge: z.object({date: z.string(), criteria: z.string()}).parse(data.discharge)
  }
}

export { parseToEntry }