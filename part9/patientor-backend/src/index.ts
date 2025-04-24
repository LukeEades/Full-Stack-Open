import express from "express"
import cors from "cors"
import diagnosesData from "./diagnoses"
import patientData from "./patients"
import { NonSensitivePatient, Patient } from "./types"
import { parseToPatient } from "./services/patientService"
import { Response } from "express"
import { parseToEntry } from "./services/entryService"
const app = express()

app.use(cors())
app.use(express.json())

app.get("/api/ping", (_req, res) => {
    res.send("pong").end()
})

app.get("/api/diagnoses", (_req, res) => {
    res.send(diagnosesData)
})

app.get("/api/patients", (_req, res: Response<NonSensitivePatient[]>) => {
    res.send(patientData.map(patient => {
        return {
            id: patient.id,
            dateOfBirth: patient.dateOfBirth,
            name: patient.name,
            gender: patient.gender,
            occupation: patient.occupation,
        }
    }))
})

app.get("/api/patients/:id", (req, res: Response<Patient | undefined>) => {
    const id = req.params.id
    const patient = patientData.find(patient => {
        return patient.id === id
    })
    if (!patient) {
        res.status(404).end()
        return
    }
    res.send(patient)
})

app.post("/api/patients", (req, res) => {
    try {
        const patient = parseToPatient(req.body)
        patientData.push(patient)
        res.send(patient).end()
    } catch (err) {
        res.status(400).send({
            error: "error"
        }).end()
    }
})

app.post("/api/patients/:id/entries", (req, res) => {
    const id = req.params.id
    try {
        const entry = parseToEntry(req.body)
        const patient = patientData.find(patient => {
            return patient.id === id
        })
        if (!patient) {
            throw new Error("patient doesn't exist")
        }
        patient.entries.push(entry)
        res.send(entry).end()
    } catch (err) {
        res.status(400).send({
            error: "error"
        }).end()
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`live at port ${PORT}`)
})