"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var ora_1 = __importDefault(require("ora"));
exports.ping = new events_1.EventEmitter();
exports.loading = new events_1.EventEmitter();
var spinners = new Map();
var spinner;
exports.ping.on('info', function (i) {
    console.log('\n' + i);
});
exports.ping.on('warning', function (w) {
    console.debug('\nWarning:', w);
});
exports.ping.on('error', function (e) {
    console.error('\nError:', e);
    spinners.forEach(function (s) {
        s.fail();
    });
    spinners.clear();
});
exports.loading.on('init', function (_a) {
    var text = _a.text, id = _a.id;
    spinners.set(id, ora_1.default(text).start());
});
exports.loading.on('stop', function (id) {
    spinner = spinners.get(id);
    spinner ? spinner.stop() : '';
});
exports.loading.on('start', function (id) {
    spinner = spinners.get(id);
    spinner ? spinner.start() : '';
});
exports.loading.on('succeed', function (id) {
    spinner = spinners.get(id);
    spinner ? spinner.succeed() : '';
    spinner = undefined;
    spinners.delete(id);
});
exports.loading.on('fail', function (id) {
    spinner = spinners.get(id);
    spinner ? spinner.fail() : '';
    spinner = undefined;
    spinners.delete(id);
});
//# sourceMappingURL=observers.js.map