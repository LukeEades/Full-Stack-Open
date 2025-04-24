interface ExerciseStats {
  target: number;
  numDays: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  average: number;
}
const targetMessages = [
  "you didn't even exercise",
  "pretty good but not great",
  "you met your goal!",
];
const calculateExercises = (days: number[], target: number): ExerciseStats => {
  const numDays = days.length;
  const trainingDays = days.filter((day) => day > 0).length;
  const average =
    days.reduce((acc, curr) => {
      return acc + curr;
    }, 0) / (days.length || 1);
  const success = average >= target;
  const rating = average >= target ? 3 : average <= 0 ? 1 : 2;
  const ratingDescription = targetMessages[rating - 1];
  const stats = {
    target,
    numDays,
    trainingDays,
    success,
    rating,
    ratingDescription,
    average,
  };
  return stats;
};

if (require.main == module) {
  const [target, ...rest] = process.argv.slice(2);
  const days = rest.map(Number);
  console.log(calculateExercises(days, Number(target)));
}

export default calculateExercises;
