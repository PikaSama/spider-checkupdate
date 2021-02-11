"use strict";
/**
 * Author: Zorin
 * Github: https://github.com/PikaSama
 * Project: Spider-Checkupdate
 * Description: 工具模块
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.changeMode = exports.downloadFile = void 0;
const chalk_1 = require("chalk");
// import { default as axios, AxiosRequestConfig } from 'axios';
const axios_1 = require("axios");
const fs = require("fs");
// 日志打印 -- 模块
const Logger = {
    err: (msg) => console.log(`${chalk_1.whiteBright.bgRed(' ERROR ')} ${msg}`),
    warn: (msg) => console.log(`${chalk_1.whiteBright.bgRed(' WARN ')} ${msg}`),
    info: (msg) => console.log(`${chalk_1.whiteBright.bgBlue(' INFO ')} ${msg}`),
    done: (msg) => console.log(`${chalk_1.whiteBright.bgGreen(' DONE ')} ${msg}`),
    upd: (msg) => console.log(`${chalk_1.whiteBright.bgYellow(' UPDATE ')} ${msg}`),
    debug: (msg) => console.log(`${chalk_1.whiteBright.bgGray('DEBUG')}`, msg),
    newLine: (lines) => console.log('\n'.repeat(lines)),
    str: {
        err: (msg) => `${chalk_1.whiteBright.bgRed(' ERROR ')} ${msg}`,
        warn: (msg) => `${chalk_1.whiteBright.bgRed(' WARN ')} ${msg}`,
        info: (msg) => `${chalk_1.whiteBright.bgBlue(' INFO ')} ${msg}`,
        done: (msg) => `${chalk_1.whiteBright.bgGreen(' DONE ')} ${msg}`,
        upd: (msg) => `${chalk_1.whiteBright.bgYellow(' UPDATE ')} ${msg}`,
    },
};
exports.Logger = Logger;
// 下载文件 -- 模块
function downloadFile({ path, url }, callback, config = {}) {
    config.responseType = 'stream';
    const writer = fs.createWriteStream(path);
    axios_1.default
        .get(url, config)
        .then(({ data }) => data.pipe(writer))
        .catch((err) => callback(err));
    writer.on('finish', () => {
        fs.readFile(path, 'utf8', (err, data) => {
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
