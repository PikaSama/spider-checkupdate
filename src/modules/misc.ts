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

// 规范回调结果的接口 -- 模块
interface Result {
    [prop: string]: string,
}

// 规范回调函数的接口 -- 模块
interface CallbackFn {
    (err: NodeJS.ErrnoException | string | null,result?: Result): void,
}

// 日志打印 -- 模块
const Logger = {
    errStr: (msg: string | NodeJS.ErrnoException): string => `${chalk.bgRed(' Error ')} ${msg}`,
    err: (msg: string | NodeJS.ErrnoException): void => console.log(`${chalk.bgRed(' Error ')} ${msg}`),
    warnStr: (msg: string): string => `${chalk.bgRed(' Warn ')} ${msg}`,
    warn: (msg: string): void => console.log(`${chalk.bgRed(' Warn ')} ${msg}`),
    infoStr: (msg: string): string => `${chalk.bgBlue(' Info ')} ${msg}`,
    info: (msg: string): void => console.log(`${chalk.bgBlue(' Info ')} ${msg}`),
    succStr: (msg: string): string => `${chalk.bgGreen(' Success ')} ${msg}`,
    succ: (msg: string): void => console.log(`${chalk.bgGreen(' Success ')} ${msg}`),
    updStr: (msg: string): string => `${chalk.bgYellow(' Update ')} ${msg}`,
    upd: (msg: string): void => console.log(`${chalk.bgYellow(' Update ')} ${msg}`),
}

// 下载文件 -- 模块
function downloadFile(path: string,url: string,config: AxiosRequestConfig = {},callback: CallbackFn): void {
    config.responseType = 'stream';
    const writer: fs.WriteStream = fs.createWriteStream(path);
    axios.get(url,config).then(({ data }): void => data.pipe(writer)).catch((err): void => callback(err));
    writer.on("finish",(): void => {
        fs.readFile(path,'utf8',(err,data): void => {
            if (err) {
                callback(err);
            }
            else {
                callback(null,{ fileContent: data });
            }
        });
    });
    writer.on("error",(): void => callback('error'));
}

// 更改文件&目录权限 -- 模块
function changeMode(path: string,isDir: number | boolean,callback: CallbackFn): void {
    if (isDir) {
        fs.chmod(path,0o777,(err): void => {
            if (err) {
                callback(err);
            }
            else {
                callback(null);
            }
        });
    }
    else {
        fs.chmod(path,0o666,(err): void => {
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
}
