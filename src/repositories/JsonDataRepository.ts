import { promises as fs } from "fs";

/**
 * Represents a JSON data repository that allows saving data to a file in JSON format.
 */
export default class JsonDataRepository {
  constructor() {}

  /**
   * Saves the provided data to a JSON file.
   *
   * @param data - The data to be saved. It can be of any type, as long as it can be converted to JSON.
   * @returns A Promise that resolves when the data is successfully saved to the file, or rejects with an error if there is a failure during the saving process.
   * @throws If there is an error during the file write operation.
   */
  async save(data: any): Promise<void> {
    await fs.writeFile("./data.json", JSON.stringify(data, null, 2));
  }
}
