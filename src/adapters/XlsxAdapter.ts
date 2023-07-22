import xlsx from "xlsx";
import type { WorkSheet, Sheet2JSONOpts } from "xlsx";

/**
 * XlsxAdapter is a wrapper class that provides utility functions for working with Excel (.xlsx) files
 * using the "SheetJS/xlsx" library.
 */
export default class XlsxAdapter {
  private xlsx: typeof xlsx;

  constructor() {
    this.xlsx = xlsx;
  }

  /**
   * Calculates the dynamic range of a given sheet. The dynamic range is determined based on the actual
   * data present in the sheet, excluding any empty cells or unused areas.
   *
   * @param sheet - The Excel sheet object to calculate the range from.
   * @returns A range string in the format 'A1:C10' representing the dynamic range of the sheet.
   */
  private calculateDynamicRange(sheet: any): string {
    // should be larger than any possible range
    let startRow = Infinity;
    let startCol = Infinity;

    // should be smaller than any possible range
    let endRow = -1;
    let endCol = -1;

    for (const cellAddress in sheet) {
      // keys that start with "!" are not cells
      const isCellAddress = !cellAddress.startsWith("!");

      if (isCellAddress) {
        // c is the column letter, r is the row number
        const { c, r } = this.xlsx.utils.decode_cell(cellAddress);

        // reduce upper left corner
        if (c < startCol) startCol = c;
        if (r < startRow) startRow = r;

        // increase lower right corner
        if (c > endCol) endCol = c;
        if (r > endRow) endRow = r;
      }
    }

    // create a new range object
    return this.xlsx.utils.encode_range({
      s: { r: startRow, c: startCol },
      e: { r: endRow, c: endCol },
    });
  }

  /**
   * Loads a specific sheet from the provided source (file or array) using the "SheetJS/xlsx" library.
   *
   * @param src - The source of the Excel file, which can be a file path (string) or an array buffer (Uint8Array).
   * @param type - The type of the source, either "file" or "array" (default is "file").
   * @returns The Excel sheet object (WorkSheet) loaded from the given source.
   */
  loadSheet(src: any, type: "file" | "array" = "file"): WorkSheet {
    const workbook = this.xlsx.read(src, { type });
    // the first name is the sheet name
    const sheetName = workbook.SheetNames[0];
    // sheet name is the key to the sheet object
    const worksheet = workbook.Sheets[sheetName];

    return worksheet;
  }

  /**
   * Serializes an Excel sheet to a JSON object using the "SheetJS/xlsx" library.
   * The dynamic range of the sheet is calculated to exclude empty cells and unused areas during serialization.
   *
   * @param sheet - The Excel sheet object (WorkSheet) to be serialized to JSON.
   * @param opts - Options for serializing the sheet to JSON (e.g., header, dateNF, etc.).
   * @returns A JSON representation of the sheet data.
   */

  serialize(sheet: WorkSheet, opts: Sheet2JSONOpts): any {
    const dinamicRange = this.calculateDynamicRange(sheet);
    const options = {
      range: dinamicRange,
      ...opts,
    };

    // convert the sheet to JSON
    const data = this.xlsx.utils.sheet_to_json(sheet, options);

    return data;
  }
}
