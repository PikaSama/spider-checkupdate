"use strict";
/**
 * Author: Zorin
 * Github: https://github.com/PikaSama
 * Project: Spider-Checkupdate
 * Description: 文件/目录检查模块
 * License: GPL-3.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.checker = void 0;
// 本地模块
const fs = require("fs");
const misc_1 = require("./misc");
// 主函数
function checker(callback) {
    let result = {
        hostsDate: '',
        codeDate: '',
    };
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            misc_1.Logger.warn("File 'data.json' doesn't exist. \n");
        }
        else {
            misc_1.Logger.info("Found data file 'data.json' .");
            result = JSON.parse(data);
        }
        readDir();
    });
    function readDir() {
        fs.readdir('resources', (err) => {
            if (err) {
                misc_1.Logger.warn("Directory 'resources' doesn't exist. Creating...");
                mkdir();
            }
            else {
                misc_1.Logger.info("Found directory: 'resources'.\n");
                callback(null, result);
            }
        });
        function mkdir() {
            fs.mkdir('resources', (err) => {
                if (err) {
                    misc_1.Logger.err(err);
                }
                else {
                    chmod();
                }
            });
        }
        function chmod() {
            fs.chmod('resources', 0o777, (err) => {
                if (err) {
                    misc_1.Logger.err(err);
                }
                else {
                    misc_1.Logger.succ('Created.\n');
                    callback(null, result);
                }
            });
        }
    }
}
exports.checker = checker;
