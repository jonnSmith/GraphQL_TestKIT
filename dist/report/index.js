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
var moment_1 = __importDefault(require("moment"));
var inquirer_1 = __importDefault(require("inquirer"));
var child_process_1 = require("child_process");
var observers_1 = require("../types/observers");
var C = __importStar(require("../types/constants"));
function reportGQL(configFile, reportFilename) {
    return __awaiter(this, void 0, void 0, function () {
        var reportFile, _a, outputFolder, appRootOutput, reportsFolder, isReportsFolder, files, questions, options, answers, reportFilePath, report, i, k;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    reportFile = reportFilename;
                    _a = configFile.config, outputFolder = _a.outputFolder, appRootOutput = _a.appRootOutput;
                    if (!outputFolder) {
                        return [2 /*return*/, C.responseFactory('error', 'message', 'Reports folder not configured')];
                    }
                    reportsFolder = path.join(appRootOutput ? C.ROOT : C.SANDBOX_PATH, outputFolder);
                    return [4 /*yield*/, fs.pathExists(reportsFolder)];
                case 1:
                    isReportsFolder = _b.sent();
                    if (!isReportsFolder) {
                        return [2 /*return*/, C.responseFactory('error', 'message', 'Reports folder not exists')];
                    }
                    if (!(!reportFile || !reportFile.includes('.json'))) return [3 /*break*/, 4];
                    observers_1.loading.emit('init', { text: 'Reading report files directory', id: 'filepath' });
                    return [4 /*yield*/, fs.readdir(reportsFolder)];
                case 2:
                    files = _b.sent();
                    files = files.filter(function (f) {
                        return !f.includes(C.QUERIES_REPORT_FILENAME)
                            && f.includes('.json')
                            && moment_1.default(f.replace('.json', ''), C.OUTPUT_FILE_DATE, true).isValid();
                    });
                    if (!files.length) {
                        return [2 /*return*/, C.responseFactory('error', 'message', 'No reports found in folder')];
                    }
                    questions = [];
                    options = {
                        type: 'list',
                        name: 'reportFile',
                        message: 'Report file:',
                        choices: files
                    };
                    questions.push(options);
                    observers_1.loading.emit('succeed', { id: 'filepath' });
                    return [4 /*yield*/, inquirer_1.default.prompt(questions)];
                case 3:
                    answers = _b.sent();
                    reportFile = answers['reportFile'];
                    _b.label = 4;
                case 4:
                    reportFilePath = path.join(reportsFolder, reportFile);
                    if (!fs.existsSync(reportFilePath)) {
                        return [2 /*return*/, C.responseFactory('error', 'message', 'Report file does not exists')];
                    }
                    report = child_process_1.spawn(C.ARTILLERY_BIN, [
                        'report',
                        reportFilePath
                    ], {
                        shell: true
                    });
                    i = 0;
                    report.stdout.on('data', function (data) {
                        if (!i) {
                            observers_1.loading.emit('succeed', { id: 'respawn' });
                        }
                        observers_1.ping.emit('info', data.toString());
                        i++;
                    });
                    k = 0;
                    report.stderr.on('data', function (data) {
                        if (!k) {
                            observers_1.loading.emit('fail', { id: 'spawn' });
                        }
                        observers_1.ping.emit('error', data.toString());
                        k++;
                    });
                    report.on('close', function (_) {
                        observers_1.ping.emit('info', 'Report generating finished. Check opened browser window.');
                    });
                    return [2 /*return*/, C.responseFactory('init', 'loading', { text: 'Starting report child process for ' + reportFile, id: 'respawn' })];
            }
        });
    });
}
exports.reportGQL = reportGQL;
//# sourceMappingURL=index.js.map