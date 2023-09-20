/* eslint-disable no-underscore-dangle */
import bunyan from 'bunyan';
import { Writable } from 'stream';
import ApiLog from '../../db/models/apiLog.model';

class CustomWritable extends Writable {
  // eslint-disable-next-line class-methods-use-this
  _write(chunk: any, enc: string, cb: any) {
    return ApiLog.create(JSON.parse(chunk.toString())).then(() => cb());
  }
}

const reqSerializer = (req: any) => {
  return {
    method: req.method,
    url: req.url,
    headers: req.headers,
    params: req.params,
    query: req.query,
    body: req.body,
  };
};

const resSerializer = (res: any) => {
  return {
    statusCode: res.statusCode,
    statusMessage: res.statusMessage,
    header: res._header,
    body: res._body,
  };
};

export default bunyan.createLogger({
  name: 'API-logger',
  serializers: {
    req: reqSerializer,
    res: resSerializer,
  },
  streams: [
    {
      stream: new CustomWritable(),
    },
  ],
});
