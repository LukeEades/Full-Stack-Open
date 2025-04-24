"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const diagnoses_1 = __importDefault(require("./diagnoses"));
const patients_1 = __importDefault(require("./patients"));
const patientService_1 = require("./services/patientService");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/api/ping", (_req, res) => {
    res.send("pong").end();
});
app.get("/api/diagnoses", (_req, res) => {
    res.send(diagnoses_1.default);
});
app.get("/api/patients", (_req, res) => {
    res.send(patients_1.default.map(patient => {
        return {
            id: patient.id,
            dateOfBirth: patient.dateOfBirth,
            name: patient.name,
            gender: patient.gender,
            occupation: patient.occupation,
        };
    }));
});
app.get("/api/patients/:id", (req, res) => {
    const id = req.params.id;
    const patient = patients_1.default.find(patient => {
        return patient.id === id;
    });
    res.send(patient);
});
app.post("/api/patients", (req, res) => {
    try {
        const patient = (0, patientService_1.parseToPatient)(req.body);
        patients_1.default.push(patient);
        res.send(patient).end();
    }
    catch (err) {
        res.send({
            error: "error"
        }).end();
    }
});
app.post("/api/patients/:id/entries", (req, res) => {
});
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`live at port ${PORT}`);
});
