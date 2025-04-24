"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseToPatient = void 0;
const types_1 = require("../types");
const uuid_1 = require("uuid");
const zod_1 = require("zod");
const parseToPatient = (data) => {
    if (!data || !(typeof data === "object" || data instanceof Object)) {
        throw new Error("body is not a valid object");
    }
    if (!("ssn" in data && "name" in data && "dateOfBirth" in data && "occupation" in data && "gender" in data)) {
        throw new Error("body does not contain all fields");
    }
    const { ssn, name, dateOfBirth, occupation, gender } = data;
    return {
        ssn: zod_1.z.string().parse(ssn),
        name: zod_1.z.string().parse(name),
        dateOfBirth: zod_1.z.string().date().parse(dateOfBirth),
        occupation: zod_1.z.string().parse(occupation),
        gender: zod_1.z.nativeEnum(types_1.Gender).parse(gender),
        id: (0, uuid_1.v1)(),
        entries: []
    };
};
exports.parseToPatient = parseToPatient;
