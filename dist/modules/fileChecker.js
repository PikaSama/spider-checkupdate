"use strict";
/**
 * Author: Zorin
 * Github: https://github.com/PikaSama
 * Project: Spider-Checkupdate
 * Description: 文件/目录检查模块
 * License: GPL-3.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 本地模块
const fs_1 = __importDefault(require("fs"));
const misc_1 = require("./misc");
// 主函数
function checker(callback) {
    let result = {
        hostsDate: '',
        codeDate: '',
    };
    fs_1.default.readFile('data.json', 'utf8', (err, data) => {
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
        fs_1.default.readdir('resources', (err) => {
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
            fs_1.default.mkdir('resources', (err) => {
                if (err) {
                    misc_1.Logger.err(err);
                }
                else {
                    chmod();
                }
            });
        }
        function chmod() {
            fs_1.default.chmod('resources', 0o777, (err) => {
                if (err) {
                    misc_1.Logger.err(err);
                }
                else {
                    misc_1.Logger.done('Created.\n');
                    callback(null, result);
                }
            });
        }
    }
}
exports.default = checker;
