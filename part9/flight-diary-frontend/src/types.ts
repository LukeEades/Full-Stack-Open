interface Diary {
  id: number;
  date: string;
  weather: string;
  visibility: string;
  comment?: string;
}

type NewDiary = Omit<Diary, "id">;

export enum Weather {
  Sunny = "sunny",
  Rainy = "rainy",
  Cloudy = "cloudy",
  Stormy = "stormy",
  Windy = "windy",
}

export enum Visibility {
  Great = "great",
  Good = "good",
  Ok = "ok",
  Poor = "poor",
}

export type { Diary, NewDiary };
