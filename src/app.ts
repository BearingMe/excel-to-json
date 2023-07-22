/**
 * This script demonstrates the process of loading data from an Excel file (XLSX format),
 * sanitizing and structuring the data using a DataSanitizationService, and saving the
 * sanitized data to a JSON file using a JsonDataRepository. It also includes a benchmark
 * using the `benchmark` utility function to measure the performance of the data processing.
 */
import XlsxAdapter from "./adapters/XlsxAdapter";
import DataSanitizationService from "./services/DataSanitizationService";
import JsonDataRepository from "./repositories/JsonDataRepository";
import { benchmark } from "./utils";

// The path to the Excel file to be loaded.
const SHEET_FILE_PATH = "./data.xlsx";

// Create instances of the required classes.
const xl = new XlsxAdapter();
const json = new JsonDataRepository();

benchmark("DynamicParser", () => {
  // The returned `sheet` can also be a Uint8Array.
  const sheet = xl.loadSheet(SHEET_FILE_PATH);

  // Serialize the loaded sheet into a 2D array (array of array).
  const data = xl.serialize(sheet, {
    header: 1, // Use the first row as headers for column names.
    blankrows: false, // Ignore blank rows (rows without any data).
  });

  // The first row is the headers, and the rest are the values.
  const headers = data[0];
  const values = data.slice(1);

  // Sanitize the data using the DataSanitizationService.
  const sanitization = new DataSanitizationService(headers);
  const result = sanitization.compose(values);

  // Save the sanitized data to a JSON file using the JsonDataRepository.
  json
    .save(result)
    .then(() => console.log("Data saved to data.json"))
    .catch((err) => console.error(err));
});
