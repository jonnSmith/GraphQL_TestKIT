"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var observers_1 = require("./observers");
exports.ResultMessage = messageFactory('ok');
exports.ErrorMessage = messageFactory('err');
function messageFactory(status) {
    var builder = {};
    builder.status = status;
    return builder;
}
function responseFactory(status, key, value, promise) {
    var _a;
    if (status === void 0) { status = 'ok'; }
    if (promise === void 0) { promise = true; }
    if (value && typeof value === "object") {
        if (value.status) {
            return promise ? Promise.resolve(value) : value;
        }
    }
    if (key && key === 'message' && !value) {
        value = 'Unknown ' + key;
    }
    var messageObject = messageFactory(status);
    var responseObject;
    if (key && value) {
        responseObject = __assign(__assign({}, messageObject), (_a = {}, _a[key] = value.toString(), _a));
    }
    if (status === 'err') {
        observers_1.ping.emit('error', responseObject && responseObject.message ? responseObject.message : JSON.stringify(messageObject));
    }
    return promise ? Promise.resolve(responseObject) : responseObject;
}
exports.responseFactory = responseFactory;
exports.ROOT = path.resolve();
exports.ARTILLERY_BIN = path.join(exports.ROOT, 'node_modules/.bin/artillery');
exports.ARTILLERY_SCHEMA = 'artillery.schema.gql';
exports.ARTILLERY_CONFIG = 'config.json';
exports.ARTILLERY_SETTINGS = 'artillery.yml';
exports.OUTPUT_FILE_DATE = 'YYYY_MM_DD_HH_MM_SS';
exports.SANDBOX_PATH = path.join(__dirname, '..', '..', 'sandbox');
exports.ARTILLERY_FOLDER = 'artillery';
exports.SCHEMA_FOLDER = 'schema';
exports.QUERIES_REPORT_FILENAME = 'easygraphql-load-tester-queries';
exports.MEOW_TESTKIT_FLAGS = {
    flags: {
        config: {
            type: 'string',
            alias: 'c'
        },
        schema: {
            type: 'string',
            alias: 's'
        },
        update: {
            type: 'boolean',
            alias: 'u',
            default: false
        },
        report: {
            type: 'boolean',
            alias: 'r',
            default: false
        },
        file: {
            type: 'string',
            alias: 'f'
        }
    }
};
exports.MEOW_TESTKIT_HELP = "\nUsage: \n  $ gql-testkit --c=graphql.test.config.json --s=schema.gql --u=true\n\nTestKit for GraphQL server endpoints testing\n\nOptions:\n  --config, -c    JSON config file path\n  --schema, -s    GraphQL Schema file path\n  --update  -u    Schema update flag\n  --report  -r    Report flag, check if only report needed\n  --file    -f    JSON report file name, works only with -r flag\n";
//# sourceMappingURL=constants.js.map