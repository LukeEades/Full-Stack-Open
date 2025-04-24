import {
  assertNever,
  Entry as EntryType,
  Diagnosis,
  EntryType as EntryTypes,
} from "../types";
interface EntryDetailsProps {
  entry: EntryType;
  diagnoses: Diagnosis[];
}

const EntryDetails = ({ entry }: EntryDetailsProps) => {
  switch (entry.type) {
    case EntryTypes.Hospital: {
      return (
        <div>
          <div>
            Discharged: {entry.discharge.date} because{" "}
            {entry.discharge.criteria}
          </div>
        </div>
      );
    }
    case EntryTypes.HealthCheck: {
      return <div>HealthCheck Rating: {entry.healthCheckRating}</div>;
    }
    case EntryTypes.OccupationalHealthcare: {
      return (
        <div>
          <div>Employer: {entry.employerName}</div>
          {entry.sickLeave && (
            <div>
              Started: {entry.sickLeave.startDate} Ended{" "}
              {entry.sickLeave.endDate}
            </div>
          )}
        </div>
      );
    }
    default: {
      assertNever(entry);
      break;
    }
  }
};

interface EntryProps {
  entry: EntryType;
  diagnoses: Diagnosis[];
}

const Entry = ({ entry, diagnoses }: EntryProps) => {
  const style = {
    borderWidth: 1,
    borderColor: "black",
    borderStyle: "solid",
    padding: 5,
  };
  const getDiagnosis = (code: string) => {
    return diagnoses.find(diag => {
      return diag.code === code;
    })?.name;
  };
  const renderDiagnoses = (codes: string[]) => {
    if (!diagnoses.length) return undefined;
    return (
      <>
        <div>diagnosis codes:</div>
        <ul>
          {codes.map(code => {
            return (
              <li key={code}>
                {code} {getDiagnosis(code)}
              </li>
            );
          })}
        </ul>
      </>
    );
  };
  return (
    <div style={style}>
      Entry Type: {entry.type}
      <div style={{ fontWeight: "bold" }}>
        {entry.date} {entry.description}
      </div>
      <div>Specialist: {entry.specialist}</div>
      {entry.diagnosisCodes && renderDiagnoses(entry.diagnosisCodes)}
      <EntryDetails entry={entry} diagnoses={diagnoses} />
    </div>
  );
};

export default Entry;
