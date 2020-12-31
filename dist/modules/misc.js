"use strict";
/**
 * Author: Zorin
 * Github: https://github.com/PikaSama
 * Project: Spider-Checkupdate
 * Description: 杂项模块
 * License: GPL-3.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.changeMode = exports.downloadFile = void 0;
const chalk_1 = require("chalk");
const axios_1 = require("axios");
const fs = require("fs");
// 日志打印 -- 模块
const Logger = {
    errStr: (msg) => `${chalk_1.whiteBright.bgRed(' Error ')} ${msg}`,
    err: (msg) => console.log(`${chalk_1.whiteBright.bgRed(' Error ')} ${msg}`),
    warnStr: (msg) => `${chalk_1.whiteBright.bgRed(' Warn ')} ${msg}`,
    warn: (msg) => console.log(`${chalk_1.whiteBright.bgRed(' Warn ')} ${msg}`),
    infoStr: (msg) => `${chalk_1.whiteBright.bgBlue(' Info ')} ${msg}`,
    info: (msg) => console.log(`${chalk_1.whiteBright.bgBlue(' Info ')} ${msg}`),
    succStr: (msg) => `${chalk_1.whiteBright.bgGreen(' Success ')} ${msg}`,
    succ: (msg) => console.log(`${chalk_1.whiteBright.bgGreen(' Success ')} ${msg}`),
    updStr: (msg) => `${chalk_1.whiteBright.bgYellow(' Update ')} ${msg}`,
    upd: (msg) => console.log(`${chalk_1.whiteBright.bgYellow(' Update ')} ${msg}`),
};
exports.Logger = Logger;
// 下载文件 -- 模块
function downloadFile(path, url, config = {}, callback) {
    config.responseType = 'stream';
    const writer = fs.createWriteStream(path);
    axios_1.default.get(url, config).then(({ data }) => data.pipe(writer)).catch((err) => callback(err));
    writer.on("finish", () => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null, { fileContent: data });
            }
        });
    });
    writer.on("error", () => callback('error'));
}
exports.downloadFile = downloadFile;
// 更改文件&目录权限 -- 模块
function changeMode(path, isDir, callback) {
    if (isDir) {
        fs.chmod(path, 0o777, (err) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null);
            }
        });
    }
    else {
        fs.chmod(path, 0o666, (err) => {
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
