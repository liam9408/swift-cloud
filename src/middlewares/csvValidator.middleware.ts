import { Response, NextFunction } from 'express';
import HttpException from '../exceptions/HttpException';
import { RequestWithFile } from '../types/request.type';

// Whitelist csv mimetype. Some csv from windows may have vnd.ms-excel mimetype even when its extension is csv
const MIME_WHITELIST = [
  'text/plain',
  'text/csv',
  'text/x-csv',
  'application/csv',
  'application/x-csv',
  'text/comma-separated-values',
  'text/x-comma-separated-values',
  'text/tab-separated-values',
  'application/vnd.ms-excel',
  'application/octet-stream',
];

/**
 * CSV Middleware - Check if the uploaded file is in CSV format
 */
const csvValidator = (
  req: RequestWithFile,
  res: Response,
  next: NextFunction
) => {
  const file = req.files.file[0];
  const fileExtension = file.originalname.split('.').pop();

  if (fileExtension !== 'csv' || MIME_WHITELIST.indexOf(file.mimetype) <= -1) {
    next(
      new HttpException(
        415,
        30012,
        'Incorrect file format. Please upload a valid CSV file.'
      )
    );
  }

  next();
};

export default csvValidator;
