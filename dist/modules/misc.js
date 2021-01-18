"use strict";
/* eslint-disable no-undef */
/**
 * Author: Zorin
 * Github: https://github.com/PikaSama
 * Project: Spider-Checkupdate
 * Description: 杂项模块
 * License: GPL-3.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.changeMode = exports.downloadFile = void 0;
const chalk_1 = require("chalk");
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
// 日志打印 -- 模块
const Logger = {
    err: (msg) => console.log(`${chalk_1.whiteBright.bgRed(' Error ')} ${msg}`),
    warn: (msg) => console.log(`${chalk_1.whiteBright.bgRed(' Warn ')} ${msg}`),
    info: (msg) => console.log(`${chalk_1.whiteBright.bgBlue(' Info ')} ${msg}`),
    done: (msg) => console.log(`${chalk_1.whiteBright.bgGreen(' Done ')} ${msg}`),
    upd: (msg) => console.log(`${chalk_1.whiteBright.bgYellow(' Update ')} ${msg}`),
    str: {
        err: (msg) => `${chalk_1.whiteBright.bgRed(' Error ')} ${msg}`,
        warn: (msg) => `${chalk_1.whiteBright.bgRed(' Warn ')} ${msg}`,
        info: (msg) => `${chalk_1.whiteBright.bgBlue(' Info ')} ${msg}`,
        done: (msg) => `${chalk_1.whiteBright.bgGreen(' Done ')} ${msg}`,
        upd: (msg) => `${chalk_1.whiteBright.bgYellow(' Update ')} ${msg}`,
    },
};
exports.Logger = Logger;
// 下载文件 -- 模块
function downloadFile({ path, url }, callback, config = {}) {
    config.responseType = 'stream';
    const writer = fs_1.default.createWriteStream(path);
    axios_1.default.get(url, config).then(({ data }) => data.pipe(writer)).catch((err) => callback(err));
    writer.on('finish', () => {
        fs_1.default.readFile(path, 'utf8', (err, data) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null, { fileContent: data });
            }
        });
    });
    writer.on('error', () => callback('error'));
}
exports.downloadFile = downloadFile;
// 更改文件&目录权限 -- 模块
function changeMode(path, callback, isDir = 0) {
    if (isDir) {
        fs_1.default.chmod(path, 0o777, (err) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null);
            }
        });
    }
    else {
        fs_1.default.chmod(path, 0o666, (err) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null);
            }
        });
    }
}
exports.changeMode = changeMode;
