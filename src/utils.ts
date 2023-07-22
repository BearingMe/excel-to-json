import chalk from "chalk";
/**
 * A utility function for benchmarking the execution time of a provided function.
 *
 * @param name - The name or description of the benchmark to be displayed in the console output.
 * @param fn - The function to be benchmarked. It should not take any parameters and doesn't return anything.
 *            It is expected to contain the code to be measured for execution time.
 */
export function benchmark(name: string, fn: () => void): void {
  console.log(chalk.yellow(`Running ${name}...`));

  const start = Date.now();
  fn();
  const end = Date.now();

  const elapsed = end - start;
  const emoji = elapsed > 1000 ? "🐌" : "🚀";

  console.log(chalk.green("•"), `Elapsed time: ${elapsed}ms`, emoji, "\n");
}
