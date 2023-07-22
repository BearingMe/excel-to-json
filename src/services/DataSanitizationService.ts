/**
 * DataSanitizationService is responsible for sanitizing and converting data
 * from a CSV file or similar sources into a structured format with cleaned headers.
 */
export default class DataSanitizationService {
  constructor(private headers: string[]) {}

  /**
   * Sanitizes the provided header string by removing non-alphanumeric characters, spaces, and converting it to lowercase.
   *
   * @param header - The header string to be sanitized.
   * @returns The sanitized header string.
   */
  private sanitizeHeader(header: string): string {
    // TODO: do a better sanitization
    return header
      .replace(/[^\w\s]/gi, "")
      .replace(/\s/g, "")
      .toLowerCase();
  }

  /**
   * Sanitizes the provided value by formatting it as a string and replacing commas with dots (for numbers).
   *
   * @param value - The value to be sanitized.
   * @returns The sanitized value as a string.
   */
  private sanitizeValue(value: any): string {
    // TODO: implement type checking and conversion
    return value === undefined ? "-" : value.toString().replace(",", ".");
  }

  /**
   * Checks if a row is valid by ensuring it has more than 5 non-empty cells.
   *
   * @param row - An array representing a row of data.
   * @returns True if the row has more than 5 non-empty cells, otherwise false.
   */
  private isRowValid(row: any[]): boolean {
    return row.filter((cell) => cell !== "").length > 5;
  }

  /**
   * Converts a valid row into an object with cleaned headers as keys.
   *
   * @param row - An array representing a valid row of data.
   * @returns An object with sanitized headers as keys and sanitized values as values.
   */
  private convertRowToObject(row: any[]): any {
    const obj: any = {};

    this.headers.forEach((header, index) => {
      const sanitizedHeader = this.sanitizeHeader(header);
      const sanitizedValue = this.sanitizeValue(row[index]);

      obj[sanitizedHeader] = sanitizedValue;
    });

    return obj;
  }

  /**
   * Filters and converts valid rows into objects with cleaned headers.
   *
   * @param values - An array of arrays representing the raw data rows.
   * @returns An array of objects, each representing a valid row with sanitized headers.
   */
  public compose(values: any[]): object[] {
    // TODO: make it more readable
    const result = values.reduce((acc, row) => {
      if (this.isRowValid(row)) {
        const obj = this.convertRowToObject(row);
        acc.push(obj);
      }

      return acc;
    }, []);

    return result;
  }
}
