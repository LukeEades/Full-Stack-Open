import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Diagnosis, Patient, Entry as EntryType } from "../types";
import patientService from "../services/patients";
import { useState } from "react";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import Entry from "./Entry";
import EntryForm from "./EntryForm";

const PatientPage = () => {
  const [patient, setPatient] = useState<Patient>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>();
  const id = useParams().id || "";
  useEffect(() => {
    patientService.get(id).then(patient => {
      setPatient(patient);
    });
  }, []);
  useEffect(() => {
    axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`).then(({ data }) => {
      setDiagnoses(data);
    });
  }, []);
  if (!id) return <div>invalid id</div>;
  if (!patient) return <div>patient doesn't exist</div>;
  if (!diagnoses) return <div>waiting for diagnoses</div>;

  const addEntry = (entry: EntryType) => {
    setPatient({
      ...patient,
      entries: patient.entries.concat(entry),
    });
  };

  return (
    <div>
      <h2>{patient.name}</h2>
      <div>Gender: {patient.gender}</div>
      <div>Occupation: {patient.occupation}</div>
      <div>Date of Birth: {patient.dateOfBirth}</div>
      <div>ssn: {patient.ssn}</div>
      <h3>entries:</h3>
      <EntryForm patientID={id} addEntry={addEntry} diagnoses={diagnoses} />
      <div>
        {patient.entries.map(entry => (
          <Entry key={entry.id} entry={entry} diagnoses={diagnoses} />
        ))}
      </div>
    </div>
  );
};

export default PatientPage;
