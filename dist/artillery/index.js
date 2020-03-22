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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var fs = __importStar(require("fs-extra"));
var child_process_1 = require("child_process");
var moment_1 = __importDefault(require("moment"));
var yaml = __importStar(require("js-yaml"));
var child_process_2 = require("child_process");
var C = __importStar(require("../types/constants"));
var observers_1 = require("../types/observers");
var artilleryConfigPath = function (fileName) {
    if (fileName === void 0) { fileName = ''; }
    return path.join(C.SANDBOX_PATH, C.ARTILLERY_FOLDER, fileName);
};
function startLoadTesting(configFile, localSchema, configPath) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, url, name, outputFolder, appRootOutput, testName, schemaPath, reportsFolder;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = configFile.config, url = _a.url, name = _a.name, outputFolder = _a.outputFolder, appRootOutput = _a.appRootOutput;
                    testName = name ? name : url;
                    observers_1.loading.emit('init', { text: "Preparing Artillery stress tests for: " + testName, id: 'artillery' });
                    schemaPath = artilleryConfigPath(C.ARTILLERY_SCHEMA);
                    reportsFolder = path.join(appRootOutput ? C.ROOT : C.SANDBOX_PATH, outputFolder);
                    return [4 /*yield*/, fs.copyFile(localSchema, schemaPath, function (err) {
                            if (err) {
                                return C.responseFactory('error', 'message', err);
                            }
                        })];
                case 1:
                    _b.sent();
                    return [2 /*return*/, runLoadTesting(configFile, reportsFolder, configPath)];
            }
        });
    });
}
exports.startLoadTesting = startLoadTesting;
function runLoadTesting(configFile, reportsFolder, configPath) {
    return __awaiter(this, void 0, void 0, function () {
        var newConfigFilePath, newConfigFile, _a, name, url, _b, duration, _c, arrivalRate, withOutput, queryFilePath, target, headers, artilleryYML, options, reportPath, reportFile, date, artilleryRun, i, k;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    newConfigFilePath = artilleryConfigPath(C.ARTILLERY_CONFIG);
                    if (configFile.config.queryFile) {
                        configFile.config['queryFilePath'] = reportsFolder;
                    }
                    try {
                        fs.writeJSONSync(newConfigFilePath, configFile, { encoding: 'utf8' });
                        newConfigFile = fs.readJSONSync(newConfigFilePath, { encoding: 'utf8' });
                    }
                    catch (e) {
                        deleteArgsFile(C.ARTILLERY_SCHEMA)
                            .then(function (e) { return deleteArgsFile(C.ARTILLERY_CONFIG); })
                            .then(function (e) { return C.responseFactory('info', 'message', 'config and schema deleted'); });
                        return [2 /*return*/, C.responseFactory('error', 'message', e)];
                    }
                    _a = newConfigFile.config, name = _a.name, url = _a.url, _b = _a.duration, duration = _b === void 0 ? 5 : _b, _c = _a.arrivalRate, arrivalRate = _c === void 0 ? 10 : _c, withOutput = _a.withOutput, queryFilePath = _a.queryFilePath, target = _a.target, headers = _a.headers;
                    try {
                        artilleryYML = fs.readJSONSync(path.join(C.SANDBOX_PATH, '..', C.ARTILLERY_SETTINGS_SOURCE), { encoding: 'utf8' });
                    }
                    catch (e) {
                        deleteArgsFile(C.ARTILLERY_SCHEMA)
                            .then(function (e) { return deleteArgsFile(C.ARTILLERY_CONFIG); })
                            .then(function (e) { return C.responseFactory('info', 'message', 'config and schema deleted'); });
                        return [2 /*return*/, C.responseFactory('error', 'message', e)];
                    }
                    artilleryYML.config.target = target;
                    options = [
                        'run',
                        '--target',
                        "" + url,
                        C.ARTILLERY_SETTINGS
                    ];
                    artilleryYML.config.phases = [{ duration: duration, arrivalRate: arrivalRate }];
                    if (headers) {
                        artilleryYML.config.defaults = { headers: headers };
                    }
                    if (withOutput) {
                        date = moment_1.default().format(C.OUTPUT_FILE_DATE).toString();
                        reportFile = date + ".json";
                        reportPath = path.join(reportsFolder, reportFile);
                        options = options.concat(['--output', reportPath]);
                    }
                    return [4 /*yield*/, fs.writeFile(artilleryConfigPath(C.ARTILLERY_SETTINGS), yaml.safeDump(artilleryYML), function (err) {
                            if (err) {
                                deleteArgsFile(C.ARTILLERY_CONFIG)
                                    .then(function (e) { return deleteArgsFile(C.ARTILLERY_SCHEMA); })
                                    .then(function (e) { return deleteArgsFile(C.ARTILLERY_SETTINGS); })
                                    .then(function (e) { return C.responseFactory('info', 'message', 'config and schema deleted'); });
                                return C.responseFactory('error', 'message', err);
                            }
                        })];
                case 1:
                    _d.sent();
                    artilleryRun = child_process_1.spawn(C.ARTILLERY_BIN, options, {
                        shell: true,
                        cwd: artilleryConfigPath()
                    });
                    observers_1.loading.emit('succeed', { id: 'artillery' });
                    i = 0;
                    artilleryRun.stdout.on('data', function (data) {
                        if (!i) {
                            observers_1.loading.emit('succeed', { id: 'spawn' });
                        }
                        observers_1.ping.emit('info', data.toString());
                        i++;
                    });
                    k = 0;
                    artilleryRun.stderr.on('data', function (data) {
                        if (!k) {
                            observers_1.loading.emit('fail', { id: 'spawn' });
                        }
                        observers_1.ping.emit('error', data.toString());
                        k++;
                    });
                    artilleryRun.on('exit', function (code) {
                        function generateReport(code) {
                            return __awaiter(this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(code === 0)) return [3 /*break*/, 3];
                                            if (!(withOutput && reportPath)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, child_process_2.exec("node ./bin/gql-testkit.js -c=" + configPath + " -r -f=" + reportFile)];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2:
                                            if (queryFilePath) {
                                                observers_1.ping.emit('info', "Query file: " + queryFilePath + "\\" + C.QUERIES_REPORT_FILENAME + ".json");
                                            }
                                            if (queryFilePath) {
                                                observers_1.ping.emit('info', "Schema file: " + path.join(C.SANDBOX_PATH, C.SCHEMA_FOLDER, C.ARTILLERY_SCHEMA));
                                            }
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            });
                        }
                        generateReport(code).then(function (_) {
                            deleteArgsFile(C.ARTILLERY_CONFIG)
                                .then(function (e) { return deleteArgsFile(C.ARTILLERY_SCHEMA); })
                                .then(function (e) { return deleteArgsFile(C.ARTILLERY_SETTINGS); })
                                .then(function (e) { return C.responseFactory('info', 'message', 'Config and schema deleted'); });
                        });
                    });
                    artilleryRun.on('close', function (_) {
                        observers_1.ping.emit('info', name + ' tests running finished. Thanks for using GraphQL TestKit.');
                    });
                    return [2 /*return*/, C.responseFactory('init', 'loading', { text: 'Starting Artillery child process spawn for ' + name, id: 'spawn' })];
            }
        });
    });
}
exports.runLoadTesting = runLoadTesting;
function deleteArgsFile(fileName) {
    return __awaiter(this, void 0, void 0, function () {
        var filePath, removeResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filePath = artilleryConfigPath(fileName);
                    removeResult = 'file ' + fileName + ' deleted';
                    return [4 /*yield*/, fs.remove(filePath, function (err) {
                            removeResult = JSON.stringify(err);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, removeResult];
            }
        });
    });
}
//# sourceMappingURL=index.js.map