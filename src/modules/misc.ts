/* eslint-disable no-undef */
/**
 * Author: Zorin
 * Github: https://github.com/PikaSama
 * Project: Spider-Checkupdate
 * Description: 杂项模块
 * License: GPL-3.0
 */

import { whiteBright as chalk } from 'chalk';
import axios, { AxiosRequestConfig } from "axios";

import * as fs from 'fs';

// 回调结果 -- 模块
interface Result {
    [prop: string]: string,
}

// 错误类型
type ErrorSets = NodeJS.ErrnoException | string | null;

// 回调函数 -- 模块
type CallbackFn = (err: ErrorSets,result?: Result) => void;

// 日志打印 -- 模块
const Logger = {
    err: (msg: ErrorSets): void => console.log(`${chalk.bgRed(' Error ')} ${msg}`),
    warn: (msg: ErrorSets): void => console.log(`${chalk.bgRed(' Warn ')} ${msg}`),
    info: (msg: string): void => console.log(`${chalk.bgBlue(' Info ')} ${msg}`),
    done: (msg: string): void => console.log(`${chalk.bgGreen(' Done ')} ${msg}`),
    upd: (msg: string): void => console.log(`${chalk.bgYellow(' Update ')} ${msg}`),
    str: {
        err: (msg: ErrorSets): string => `${chalk.bgRed(' Error ')} ${msg}`,
        warn: (msg: ErrorSets): string => `${chalk.bgRed(' Warn ')} ${msg}`,
        info: (msg: string): string => `${chalk.bgBlue(' Info ')} ${msg}`,
        done: (msg: string): string => `${chalk.bgGreen(' Done ')} ${msg}`,
        upd: (msg: string): string => `${chalk.bgYellow(' Update ')} ${msg}`,
    },
}

// 文件下载参数
interface DownloadParams {
    path: string,
    url: string,
}

// 下载文件 -- 模块
function downloadFile({ path, url }: DownloadParams, callback: CallbackFn, config: AxiosRequestConfig = {}): void {
    config.responseType = 'stream';
    const writer: fs.WriteStream = fs.createWriteStream(path);
    axios.get(url, config).then(({ data }): void => data.pipe(writer)).catch((err): void => callback(err));
    writer.on('finish', (): void => {
        fs.readFile(path, 'utf8', (err,data): void => {
            if (err) {
                callback(err);
            }
            else {
                callback(null, { fileContent: data });
            }
        });
    });
    writer.on('error', (): void => callback('error'));
}

// 更改文件&目录权限 -- 模块
function changeMode(path: string, callback: CallbackFn, isDir = 0): void {
    if (isDir) {
        fs.chmod(path, 0o777, (err): void => {
            if (err) {
                callback(err);
            }
            else {
                callback(null);
            }
        });
    }
    else {
        fs.chmod(path, 0o666, (err): void => {
            if (err) {
                callback(err);
            }
            else {
                callback(null);
            }
        });
    }
}

export {
    CallbackFn,
    Result,
    downloadFile,
    changeMode,
    Logger,
};
