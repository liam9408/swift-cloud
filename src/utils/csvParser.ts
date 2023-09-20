/**
 * Type Parser Class
 * Convert raw string to a specific format
 */
import stream from 'stream';
import { parse as csvParse } from 'csv-parse';
import { isNil, zipObject } from 'lodash';

import TypeParser from './typeParser';

export type Json = { [name: string]: any };

const typeParser = new TypeParser();

/**
 * Parse CSV file into header array and row arrays.
 * No transformations applied on the raw fields.
 *
 * output: {
 *   header: [],
 *   rows: [[],[],..]
 * }
 *
 * @param {blob} buffer The csv file in buffer format
 * @returns {Promise} The promise object for parsing the csv data into header and rows
 */
const parseCsvBuffer = async (buffer: Buffer) => {
  return new Promise((resolve, reject) => {
    let lineCount = 0;
    let csvHeader: string[] = [];
    const csvRows: any[] = [];

    const parser = csvParse();

    // create readStream
    const readStream = new stream.PassThrough();
    readStream.end(buffer);
    readStream
      .pipe(parser)
      .on('data', (data: string[]) => {
        lineCount += 1;
        if (lineCount === 1) {
          csvHeader = data;
        } else {
          csvRows.push(data);
        }
      })
      .on('end', () => {
        resolve({
          header: csvHeader,
          rows: csvRows,
        });
      })
      .on('error', (err: Error) => {
        console.error(err.stack);
        reject(new Error('Unable to parse CSV data'));
      });
  });
};

const validateSchema = (csvHeader: string[], schemaDef: Json) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const key in schemaDef) {
    if ({}.hasOwnProperty.call(schemaDef, key)) {
      const fieldDef = schemaDef[key];
      const { name } = fieldDef;

      if (!csvHeader.includes(name)) {
        console.log(csvHeader, name);
        return false;
      }
    }
  }
  return true;
};

const parseCsvRow = (
  csvRow: any[],
  schemaDef: Json,
  byName: boolean = false
): { [name: string]: any } => {
  const result: Json = {};

  let colIndex = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const key in schemaDef) {
    if ({}.hasOwnProperty.call(schemaDef, key)) {
      const fieldDef: Json = schemaDef[key];

      const { name, type, required, options } = fieldDef;
      const colKey = byName ? name : colIndex;

      if (required && isNil(csvRow[colKey])) {
        throw new Error(`Requried field missing: ${name}`);
      }

      const parsedVal = typeParser.parse(csvRow[colKey], type, options);

      result[key] = parsedVal;
      colIndex += 1;
    }
  }

  return result;
};

class CsvParser {
  static async parse(
    buffer: Buffer,
    schemaDef: object,
    options: { [name: string]: any } = {}
  ) {
    const { parsedBy = 'ORDER' } = options;

    const { header: csvHeader, rows: csvRows }: Json =
      await parseCsvBuffer(buffer);

    if (parsedBy === 'NAME') {
      const isValidSchema = validateSchema(csvHeader, schemaDef);
      if (!isValidSchema) {
        throw new Error('Invalid CSV Schema.');
      }
    }

    const results = csvRows.map((csvRow: any[]) => {
      if (parsedBy === 'NAME') {
        const csvRowObj: any = zipObject(csvHeader, csvRow);
        return parseCsvRow(csvRowObj, schemaDef, true);
      }
      return parseCsvRow(csvRow, schemaDef, false);
    });

    return {
      header: csvHeader,
      rows: results,
    };
  }
}

export default CsvParser;
