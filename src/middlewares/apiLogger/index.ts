/* eslint-disable no-underscore-dangle */
import { get } from 'lodash';
import flatted from 'flatted';
import logger from './log';

const breakCircular = (obj: any) => {
  return flatted.parse(flatted.stringify(obj));
};

const loggerMiddleWare = (name: any) => (req: any, res: any, next: any) => {
  const start = Date.now();
  const oldWrite = res.write;
  const oldEnd = res.end;
  const dataChunks: any[] = [];
  req.log = logger;

  res.write = function write(chunk: any) {
    dataChunks.push(Buffer.from(chunk));

    // eslint-disable-next-line prefer-rest-params
    oldWrite.apply(res, arguments);
  };

  res.end = function end(chunk: any) {
    if (chunk) dataChunks.push(Buffer.from(chunk));

    res._body = Buffer.concat(dataChunks).toString('utf8');
    // eslint-disable-next-line prefer-rest-params
    oldEnd.apply(res, arguments);
  };

  res.on('finish', () => {
    logger.info(
      {
        method: req.method,
        caller: get(req.identity, ''),
        req: breakCircular(req),
        res: breakCircular(res),
        duration: `${Date.now() - start} ms`,
        path: req.path,
        name,
      },
      name
    );
  });

  next();
};

export default loggerMiddleWare;
