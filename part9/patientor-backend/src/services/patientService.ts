import { Patient, Gender} from "../types";
import { v1 as uuid } from "uuid"
import { z } from "zod";

const parseToPatient = (data: unknown): Patient => {
    if (!data || !(typeof data === "object" || data instanceof Object)) {
        throw new Error("body is not a valid object")
    }
    if (!("ssn" in data && "name" in data && "dateOfBirth" in data && "occupation" in data && "gender" in data)) {
        throw new Error("body does not contain all fields")
    }
    const {ssn, name, dateOfBirth, occupation, gender} = data
    return {
        ssn: z.string().parse(ssn),
        name: z.string().parse(name),
        dateOfBirth: z.string().date().parse(dateOfBirth),
        occupation: z.string().parse(occupation),
        gender: z.nativeEnum(Gender).parse(gender),
        id: uuid(),
        entries: []
    }
}

export { parseToPatient }