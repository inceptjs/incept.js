const required = require('./dist/server/index');
const toExport = required.default;
toExport.Framework = required.Framework;
toExport.Schema = required.Schema;
toExport.Request = required.Request;
toExport.Response = required.Response;
toExport.Exception = required.Exception;
module.exports = toExport;

module.exports = toExport;
