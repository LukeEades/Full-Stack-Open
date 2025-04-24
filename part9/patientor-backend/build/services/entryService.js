"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseToEntry = void 0;
const types_1 = require("../types");
const uuid_1 = require("uuid");
const zod_1 = require("zod");
const parseToEntry = (data) => {
    if (!data || !(typeof data == "object" || data instanceof Object)) {
        throw new Error("isn't a valid object");
    }
    if (!("date" in data && "specialist" in data && "type" in data && "description" in data)) {
        throw new Error("entry missing required parameters");
    }
    const { date, specialist, type, description } = data;
    const entry = {
        date: zod_1.z.string().date().parse(date),
        specialist: zod_1.z.string().parse(specialist),
        type: zod_1.z.nativeEnum(types_1.EntryType).parse(type),
        description: zod_1.z.string().parse(description),
        id: (0, uuid_1.v1)()
    };
    if ("diagnosisCodes" in data) {
        entry.diagnosisCodes = zod_1.z.array(zod_1.z.string()).parse(data.diagnosisCodes);
    }
    switch (entry.type) {
        case types_1.EntryType.HealthCheck: {
            if (!("healthCheckRating" in data)) {
                throw new Error("entry missing required parameters");
            }
            entry.healthCheckRating = zod_1.z.number().parse(data.healthCheckRating);
            break;
        }
        case types_1.EntryType.Hospital: {
            if (!("discharge" in data)) {
                throw new Error("entry missing required parameters");
            }
            entry.discharge = zod_1.z.object({ date: zod_1.z.string(), criteria: zod_1.z.string() }).parse(data.discharge);
            break;
        }
        case types_1.EntryType.OccupationalHealthcare: {
            if (!("employerName" in data)) {
                throw new Error("entry missing required parameters");
            }
            if ("sickLeave" in data) {
                entry.sickLeave = zod_1.z.object({ startDate: zod_1.z.string(), endDate: zod_1.z.string() }).parse(data.sickLeave);
            }
            entry.employerName = zod_1.z.string().parse(data.employerName);
            break;
        }
        default: {
            (0, types_1.assertNever)(entry);
            break;
        }
    }
    return entry;
};
exports.parseToEntry = parseToEntry;
