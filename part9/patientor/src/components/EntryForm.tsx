import {
  Entry as EntryType,
  EntryType as EntryTypes,
  Diagnosis,
  HealthCheckRating,
} from "../types";
import { useState } from "react";
import { apiBaseUrl } from "../constants";
import axios, { isAxiosError } from "axios";
interface EntryFormProps {
  patientID: string;
  addEntry: (entry: EntryType) => void;
  diagnoses: Array<Diagnosis>;
}
const EntryForm = ({ patientID, addEntry, diagnoses }: EntryFormProps) => {
  const [notification, setNotification] = useState<string>("");
  const [entryType, setEntryType] = useState<string>(EntryTypes.HealthCheck);
  const style = {
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "black",
    padding: 5,
  };
  const submitEntry = async (entry: EntryType) => {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/patients/${patientID}/entries`,
        entry
      );
      addEntry(response.data);
    } catch (err) {
      if (isAxiosError(err)) {
        if (!("response" in err && err.response)) {
          return;
        }
        if (!("data" in err.response)) {
          return;
        }
        if (!("error" in err.response.data)) {
          return;
        }
        setNotification(err.response.data.error);
        setTimeout(() => {
          setNotification("");
        }, 4000);
      }
    }
  };
  return (
    <div style={style}>
      <div>{notification !== "" && notification}</div>
      <label>
        Entry Type:
        <select name="entryType" onChange={e => setEntryType(e.target.value)}>
          <option value={EntryTypes.HealthCheck} defaultChecked>
            {EntryTypes.HealthCheck}
          </option>
          <option value={EntryTypes.OccupationalHealthcare}>
            {EntryTypes.OccupationalHealthcare}
          </option>
          <option value={EntryTypes.Hospital}>{EntryTypes.Hospital}</option>
        </select>
      </label>
      {entryType === EntryTypes.HealthCheck && (
        <HealthCheckForm addEntry={submitEntry} diagnoses={diagnoses} />
      )}
      {entryType === EntryTypes.Hospital && (
        <HospitalForm addEntry={submitEntry} diagnoses={diagnoses} />
      )}
      {entryType === EntryTypes.OccupationalHealthcare && (
        <OccupationalHealthcareForm
          addEntry={submitEntry}
          diagnoses={diagnoses}
        />
      )}
    </div>
  );
};

interface OccupationalHealthCareFormProps {
  addEntry: (entry: EntryType) => void;
  diagnoses: Array<Diagnosis>;
}

const OccupationalHealthcareForm = ({
  addEntry,
  diagnoses,
}: OccupationalHealthCareFormProps) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [codes, setCodes] = useState<string[]>([]);
  const [code, setCode] = useState<string>("");
  const [employerName, setEmployerName] = useState("");
  const [sickStart, setSickStart] = useState("");
  const [sickEnd, setSickEnd] = useState("");
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const entry: EntryType = {
      description,
      date,
      specialist,
      diagnosisCodes: codes,
      employerName,
      sickLeave: {
        startDate: sickStart,
        endDate: sickEnd,
      },
      id: "",
      type: EntryTypes.OccupationalHealthcare,
    };
    addEntry(entry);
  };
  return (
    <form onSubmit={handleSubmit}>
      <BaseEntryForm
        description={description}
        setDescription={setDescription}
        setDate={setDate}
        date={date}
        setSpecialist={setSpecialist}
        specialist={specialist}
        setCodes={setCodes}
        codes={codes}
        setCode={setCode}
        code={code}
        diagnoses={diagnoses}
      />
      <br />
      <label>
        Employer:{" "}
        <input
          type="text"
          onChange={e => setEmployerName(e.target.value)}
          value={employerName}
        />
      </label>
      <br />
      <label>
        Sick Leave:
        <label>
          Start:{" "}
          <input
            type="date"
            onChange={e => setSickStart(e.target.value)}
            value={sickStart}
          />
        </label>
        <label>
          End:{" "}
          <input
            type="date"
            onChange={e => setSickEnd(e.target.value)}
            value={sickEnd}
          />
        </label>
      </label>
      <br />
      <button type="submit">Create</button>
    </form>
  );
};

interface HospitalFormProps {
  addEntry: (entry: EntryType) => void;
  diagnoses: Array<Diagnosis>;
}

const HospitalForm = ({ addEntry, diagnoses }: HospitalFormProps) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [codes, setCodes] = useState<string[]>([]);
  const [code, setCode] = useState<string>("");
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeReason, setDischargeReason] = useState("");
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const entry: EntryType = {
      description,
      date,
      specialist,
      diagnosisCodes: codes,
      id: "",
      type: EntryTypes.Hospital,
      discharge: {
        date: dischargeDate,
        criteria: dischargeReason,
      },
    };
    addEntry(entry);
  };
  return (
    <form onSubmit={handleSubmit}>
      <BaseEntryForm
        description={description}
        setDescription={setDescription}
        setDate={setDate}
        date={date}
        setSpecialist={setSpecialist}
        specialist={specialist}
        setCodes={setCodes}
        codes={codes}
        setCode={setCode}
        code={code}
        diagnoses={diagnoses}
      />
      <br />
      <label>
        Discharge:
        <label>
          Date:
          <input
            type="date"
            onChange={e => setDischargeDate(e.target.value)}
            value={dischargeDate}
          />
        </label>
        <label>
          Criteria:
          <input
            type="text"
            onChange={e => setDischargeReason(e.target.value)}
            value={dischargeReason}
          />
        </label>
      </label>
      <br />
      <button type="submit">Create</button>
    </form>
  );
};

interface HealthCheckFormProps {
  addEntry: (entry: EntryType) => void;
  diagnoses: Array<Diagnosis>;
}

const HealthCheckForm = ({ addEntry, diagnoses }: HealthCheckFormProps) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [healthCheckRating, setHealthcheckRating] = useState<number>(0);
  const [codes, setCodes] = useState<string[]>([]);
  const [code, setCode] = useState("");
  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const entry: EntryType = {
      description,
      date,
      specialist,
      healthCheckRating,
      diagnosisCodes: codes,
      id: "",
      type: EntryTypes.HealthCheck,
    };
    addEntry(entry);
  };
  return (
    <form onSubmit={onSubmit}>
      <BaseEntryForm
        description={description}
        setDescription={setDescription}
        setDate={setDate}
        date={date}
        setSpecialist={setSpecialist}
        specialist={specialist}
        setCodes={setCodes}
        codes={codes}
        setCode={setCode}
        code={code}
        diagnoses={diagnoses}
      />
      <br />
      <label>
        Healthcheck Rating:{" "}
        <select
          name="rating"
          onChange={e => setHealthcheckRating(Number(e.target.value))}
          value={healthCheckRating}
        >
          {Object.values(HealthCheckRating).map((value, index) => {
            if (!isNaN(Number(value))) return;
            return (
              <option key={value} value={index}>
                {value}
              </option>
            );
          })}
        </select>
      </label>
      <br />
      <button type="submit">Create</button>
    </form>
  );
};

interface BaseEntryFormProps {
  setDescription: (val: string) => void;
  description: string;
  setDate: (val: string) => void;
  date: string;
  setSpecialist: (val: string) => void;
  specialist: string;
  setCodes: (val: string[]) => void;
  codes: string[];
  setCode: (val: string) => void;
  code: string;
  diagnoses: Array<Diagnosis>;
}

const BaseEntryForm = ({
  description,
  setDescription,
  date,
  setDate,
  setSpecialist,
  specialist,
  setCodes,
  codes,
  setCode,
  code,
  diagnoses,
}: BaseEntryFormProps) => {
  return (
    <>
      <label>
        Description:{" "}
        <input
          type="text"
          onChange={e => setDescription(e.target.value)}
          value={description}
        />
      </label>
      <br />
      <label>
        Date:{" "}
        <input
          type="date"
          onChange={e => setDate(e.target.value)}
          value={date}
        />
      </label>
      <br />
      <label>
        Specialist:{" "}
        <input
          type="text"
          onChange={e => setSpecialist(e.target.value)}
          value={specialist}
        />
      </label>
      <br />
      <label>
        Diagnoses Codes:{" "}
        <select name="codes" onChange={e => setCode(e.target.value)}>
          <option value="">Select</option>
          {diagnoses.map(diagnosis => {
            return (
              <option key={diagnosis.code} value={diagnosis.code}>
                {diagnosis.code}
              </option>
            );
          })}
        </select>
        <button
          type="button"
          onClick={() => code !== "" && setCodes(codes.concat(code))}
        >
          add
        </button>
        {codes.length !== 0 && (
          <ul>
            {codes.map(code => {
              return <li key={code}>{code}</li>;
            })}
          </ul>
        )}
      </label>
    </>
  );
};

export default EntryForm;
