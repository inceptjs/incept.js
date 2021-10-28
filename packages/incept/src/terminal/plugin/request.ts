import formidable from 'formidable';

import { 
  EventEmitter, 
  Request, 
  Response 
} from '@inceptjs/framework/dist/presets/http';

const emitter = new EventEmitter

/**
 * Translates response back into the original payload
 */
emitter.on('request', async function postputProcessor(
  request: Request, 
  response: Response
) {
  if (request.method !== 'POST' && request.method !== 'PUT') {
    return;
  }

  const im = request.resource;
  const form = formidable({ multiples: true });

  await new Promise((resolve, reject) => {
    form.parse(im, (error: Error, fields, files) => {
      if (error) {
        return reject(error);
      }

      //change path to N notation
      const separator = '~~' + Math.floor(Math.random() * 10000) + '~~';
      [ fields, files ].forEach(group => {
        Object.keys(group).forEach(name => {
          //change path to dot notation
          const keys = name
            .replace(/\]\[/g, separator)
            .replace('[', separator)
            .replace(/\[/g, '')
            .replace(/\]/g, '')
            .split(separator);
          //change string integer to integer
          keys.map((key: any) => {
            const index = parseInt(key);
            //if its a possible integer
            if (!isNaN(index) && key.indexOf('.') === -1) {
              return index;
            }
      
            return key;
          })
  
          const values = Array.isArray(group[name]) 
            ? group[name] as any[]
            : [ group[name] ];
  
          //now loop through each value
          values.forEach(value => {
            //and set the value
            request.set(...keys, value)
          });
        });
      });

      return resolve(true);
    });
  }); 
});

export default emitter;
