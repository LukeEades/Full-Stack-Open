function calculateBmi(weight: number, height: number) {
  const bmi = weight / height ** 2;
  return bmi < 18.5 ? "underweight" : bmi > 25 ? "overweight" : "normal weight";
}
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log("not enough parameters");
  } else if (args.length > 2) {
    console.log("too many parameters");
  }
  console.log(calculateBmi(Number(args[0]), Number(args[1])));
}

export default calculateBmi;
