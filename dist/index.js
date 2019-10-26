"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var schema_1 = require("./schema");
var path = __importStar(require("path"));
var fs = __importStar(require("fs-extra"));
var observers_1 = require("./types/observers");
var artillery_1 = require("./artillery");
var C = __importStar(require("./types/constants"));
function testKitGQL(cli) {
    return __awaiter(this, void 0, void 0, function () {
        var configPath, localSchema, updateSchema, configFilePath, localSchemaPath, isLocalSchema, configFile, e_1, testName, schemaFilename, schemaFilenamePath, isSchemaFilename, schemaResult, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    observers_1.loading.emit('init', { text: 'Preparing configs and paths', id: 'startup' });
                    configPath = cli.flags.c ? cli.flags.c : '';
                    localSchema = cli.flags.s ? cli.flags.s : '';
                    updateSchema = cli.flags.u ? cli.flags.u : false;
                    configFilePath = configPath ? path.join(C.ROOT, configPath) : '';
                    localSchemaPath = localSchema ? path.join(C.ROOT, localSchema) : '';
                    isLocalSchema = localSchemaPath ? fs.existsSync(localSchemaPath) : false;
                    if (!configPath || !configPath.includes('.json') || !fs.existsSync(configFilePath)) {
                        return [2 /*return*/, C.responseFactory('err', 'message', 'No config provided')];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fs.readJSON(configFilePath, { encoding: 'utf8' })];
                case 2:
                    configFile = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    return [2 /*return*/, C.responseFactory('err', 'message', e_1)];
                case 4:
                    testName = configFile.config.name ? configFile.config.name : configFile.config.url;
                    schemaFilename = configFile.config.schema.filename;
                    schemaFilenamePath = schemaFilename ? path.join(C.SANDBOX_PATH, C.SCHEMA_FOLDER, schemaFilename) : '';
                    isSchemaFilename = schemaFilenamePath ? fs.existsSync(schemaFilenamePath) : false;
                    observers_1.loading.emit('succeed', 'startup');
                    if (!(!isLocalSchema && (!isSchemaFilename || (isSchemaFilename && updateSchema)))) return [3 /*break*/, 9];
                    observers_1.loading.emit('init', { text: "Preparing download GraphQL Schema for: " + testName, id: 'schema' });
                    schemaResult = void 0;
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, schema_1.schemaGQL(configFile)];
                case 6:
                    schemaResult = _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    e_2 = _a.sent();
                    return [2 /*return*/, C.responseFactory('err', 'message', e_2)];
                case 8:
                    observers_1.loading.emit('succeed', 'schema');
                    if (schemaResult && schemaResult.path) {
                        return [2 /*return*/, artillery_1.startLoadTesting(configFile, schemaResult.path, configPath)];
                    }
                    else {
                        return [2 /*return*/, C.responseFactory('err', 'message', 'Schema saving error')];
                    }
                    return [3 /*break*/, 10];
                case 9:
                    if (isLocalSchema) {
                        return [2 /*return*/, artillery_1.startLoadTesting(configFile, localSchemaPath, configPath)];
                    }
                    else if (isSchemaFilename) {
                        return [2 /*return*/, artillery_1.startLoadTesting(configFile, schemaFilenamePath, configPath)];
                    }
                    else {
                        return [2 /*return*/, C.responseFactory('err', 'message', 'No schema provided')];
                    }
                    _a.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.testKitGQL = testKitGQL;
//# sourceMappingURL=index.js.map