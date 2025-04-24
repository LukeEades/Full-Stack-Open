import express from "express";
import calculateBmi from "./bmiCalculator";
import calculateExercises from "./exerciseCalculator";

const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!").end();
});

app.get("/bmi", (req, res) => {
  const params = req.query;
  if (
    !params.height ||
    !params.weight ||
    isNaN(Number(params.height)) ||
    isNaN(Number(params.weight))
  ) {
    res
      .send({
        error: "malformatted parameters",
      })
      .end();
    return;
  }
  const height = Number(params.height);
  const weight = Number(params.weight);
  const bmi = calculateBmi(weight, height);
  res
    .send({
      weight,
      height,
      bmi,
    })
    .end();
  return;
});

app.post("/exercises", (req, res) => {
  const data = req.body;
  if (!data.target || !data.daily_exercises) {
    res
      .send({
        error: "parameters missing",
      })
      .end();
    return;
  }
  const target = Number(data.target);
  if (isNaN(target)) {
    res
      .send({
        error: "malformed parameters",
      })
      .end();
    return;
  }
  const daily_exercises: number[] = [];
  for (const day of data.daily_exercises) {
    if (isNaN(Number(day))) {
      res
        .send({
          error: "malformed parameters",
        })
        .end();
      return;
    }
    daily_exercises.push(Number(day));
  }
  res.send(calculateExercises(daily_exercises, target)).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});
