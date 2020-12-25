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
    err: (msg) => console.log(`${chalk_1.whiteBright.bgRed(' Error ')} ${msg}`),
    warn: (msg) => console.log(`${chalk_1.whiteBright.bgRed(' Warn ')} ${msg}`),
    info: (msg) => console.log(`${chalk_1.whiteBright.bgBlue(' Info ')} ${msg}`),
    succ: (msg) => console.log(`${chalk_1.whiteBright.bgGreen(' Success ')} ${msg}`),
    upd: (msg) => console.log(`${chalk_1.whiteBright.bgYellow(' Update ')} ${msg}`),
};
exports.Logger = Logger;
// 下载文件 -- 模块
function downloadFile(path, url, config = {}, callback) {
    config.responseType = 'stream';
    const writer = fs.createWriteStream(path);
    axios_1.default.get(url, config).then(({ data }) => data.pipe(writer));
    writer.on("finish", () => callback(null));
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
