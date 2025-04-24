import axios from "axios";
import React, { useEffect, useState } from "react";
import { Diary, NewDiary, Weather, Visibility } from "./types";
const url = "http://localhost:3000/api/diaries";
function App() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [notification, setNotification] = useState("");
  useEffect(() => {
    axios.get(url).then(({ data }: { data: Diary[] }) => {
      setDiaries(data);
    });
  }, []);

  const addDiary = (diary: Diary) => {
    setDiaries(diaries.concat(diary));
  };

  const createNotification = (notif: string) => {
    setNotification(notif);
    setTimeout(() => {
      setNotification("");
    }, 4000);
  };
  return (
    <div>
      {notification !== "" && <div>{notification}</div>}
      <DiaryForm
        addDiary={addDiary}
        setNotification={createNotification}
      />
      <DiaryList diaries={diaries} />
    </div>
  );
}

interface DiaryFormProps {
  addDiary: (diary: Diary) => void;
  setNotification: (notif: string) => void;
}

const DiaryForm = ({ addDiary, setNotification }: DiaryFormProps) => {
  const [date, setDate] = useState("");
  const [weather, setWeather] = useState("");
  const [visibility, setVisibility] = useState("");
  const [comment, setComment] = useState("");
  const handleCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const diary: NewDiary = {
      date,
      weather,
      visibility,
      comment,
    };
    try {
      const response = await axios.post<Diary>(url, diary);
      console.log(response);
      addDiary(response.data);
      setDate("");
      setWeather("");
      setVisibility("");
      setComment("");
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        console.log(err.response?.data);
        setNotification(err.response?.data || "");
      }
    }
  };
  return (
    <form onSubmit={handleCreate}>
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
        Weather:{" "}
        {Object.values(Weather).map(weather => {
          return (
            <label key={weather}>
              <input
                name="weather"
                type="radio"
                onChange={e => setWeather(e.target.value)}
                value={weather}
              />
              {weather}
            </label>
          );
        })}
      </label>
      <br />
      <label>
        Visibility:{" "}
        {Object.values(Visibility).map(visibility => {
          return (
            <label key={visibility}>
              <input
                name="visibility"
                type="radio"
                onChange={e => setVisibility(e.target.value)}
                value={visibility}
              />
              {visibility}
            </label>
          );
        })}
      </label>
      <br />
      <label>
        Comment:{" "}
        <input
          type="text"
          onChange={e => setComment(e.target.value)}
          value={comment}
        />
      </label>
      <br />
      <button type="submit">Create</button>
    </form>
  );
};

const DiaryList = ({ diaries }: { diaries: Diary[] }) => {
  return (
    <ul>
      {diaries.map(diary => (
        <li key={diary.id}>
          {diary.date} {diary.weather} {diary.visibility} {diary.comment}
        </li>
      ))}
    </ul>
  );
};

export default App;
