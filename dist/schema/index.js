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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var fs = __importStar(require("fs"));
var mkdirp_1 = __importDefault(require("mkdirp"));
var introspectionQuery_1 = require("graphql/utilities/introspectionQuery");
var buildClientSchema_1 = require("graphql/utilities/buildClientSchema");
var schemaPrinter_1 = require("graphql/utilities/schemaPrinter");
var C = __importStar(require("../types/constants"));
function schemaGQL(configFile) {
    return __awaiter(this, void 0, void 0, function () {
        var config, defaultHeaders, headers, schema, e_1, printedFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = configFile.config;
                    if (!config.url) {
                        return [2 /*return*/, C.responseFactory('err', 'message', 'No endpoint provided')];
                    }
                    defaultHeaders = {
                        'Content-Type': 'application/json',
                    };
                    headers = __assign(__assign({}, config.headers), defaultHeaders);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, getRemoteSchema(config.url, {
                            method: config.schema.method,
                            headers: headers,
                            json: config.schema.json,
                        })];
                case 2:
                    schema = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    return [2 /*return*/, C.responseFactory('err', 'message', e_1)];
                case 4:
                    if (!schema || schema.status === 'err') {
                        return [2 /*return*/, C.responseFactory('err', 'message', schema.message)];
                    }
                    else {
                        if (config.schema.filename && schema.schema) {
                            printedFile = printToFile(config.schema.filename, schema.schema);
                            return [2 /*return*/, C.responseFactory('ok', 'path', printedFile)];
                        }
                        else {
                            return [2 /*return*/, C.responseFactory('err', 'message', 'Error: ' + JSON.stringify(schema))];
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.schemaGQL = schemaGQL;
function getRemoteSchema(endpoint, options) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, errors, schema;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, node_fetch_1.default(endpoint, {
                        method: options.method,
                        headers: options.headers,
                        body: JSON.stringify({ query: introspectionQuery_1.introspectionQuery }),
                    }).then(function (res) { return res.json(); })];
                case 1:
                    _a = _b.sent(), data = _a.data, errors = _a.errors;
                    if (errors) {
                        return [2 /*return*/, C.responseFactory('err', 'message', JSON.stringify(errors, null, 2))];
                    }
                    if (options.json) {
                        return [2 /*return*/, C.responseFactory('ok', 'schema', JSON.stringify(data, null, 2))];
                    }
                    else {
                        schema = buildClientSchema_1.buildClientSchema(data);
                        return [2 /*return*/, C.responseFactory('ok', 'schema', schemaPrinter_1.printSchema(schema))];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function printToFile(filename, schema) {
    try {
        var output = path.join(C.SANDBOX_PATH, C.SCHEMA_FOLDER);
        var filePath = path.join(C.SANDBOX_PATH, C.SCHEMA_FOLDER, filename);
        if (!fs.existsSync(filePath)) {
            mkdirp_1.default.sync(output);
        }
        fs.writeFileSync(filePath, schema);
        return C.responseFactory('ok', 'path', filePath, false);
    }
    catch (e) {
        return C.responseFactory('err', 'message', e, false);
    }
}
//# sourceMappingURL=index.js.map