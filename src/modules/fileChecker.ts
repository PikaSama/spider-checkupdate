/**
 * Author: Zorin
 * Github: https://github.com/PikaSama
 * Project: Spider-Checkupdate
 * Description: 文件/目录检查模块
 * License: GPL-3.0
 */

// 本地模块
import * as fs from 'fs';
import {
    CallbackFn,
    Result,
    Logger,
} from "./misc";

// 主函数
function checker(callback: CallbackFn): void {
    let result: Result = {
        hostsDate: '',
        codeDate: '',
    };
    fs.readFile('data.json', 'utf8', (err,data): void => {
        if (err) {
            Logger.warn("File 'data.json' doesn't exist. \n");
        }
        else {
            Logger.info("Found data file 'data.json' .");
            result = JSON.parse(data);
        }
        readDir();
    });

    function readDir(): void {
        fs.readdir('resources', (err): void => {
            if (err) {
                Logger.warn("Directory 'resources' doesn't exist. Creating...");
                mkdir();
            }
            else {
                Logger.info("Found directory: 'resources'.\n");
                callback(null, result);
            }
        });

        function mkdir(): void {
            fs.mkdir('resources',(err): void => {
                if (err) {
                    Logger.err(err);
                }
                else {
                    chmod();
                }
            });
        }

        function chmod(): void {
            fs.chmod('resources',0o777,(err): void => {
                if (err) {
                    Logger.err(err);
                }
                else {
                    Logger.done('Created.\n');
                    callback(null, result);
                }
            });
        }
    }
}

export { checker };
