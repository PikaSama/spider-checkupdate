"use strict";
/**
 * Author: Zorin
 * Github: https://github.com/PikaSama
 * Project: Spider-Checkupdate
 * Description: 文件/目录检查模块
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.checker = void 0;
// 本地模块
const fs = require("fs");
const utils_1 = require("./utils");
function checker(callback) {
    let result = {
        hostsDate: '',
        codeDate: '',
    };
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            utils_1.Logger.warn("File 'data.json' doesn't exist. \n");
        }
        else {
            utils_1.Logger.info("Found data file 'data.json' .");
            result = JSON.parse(data);
        }
        readDir();
    });
    function readDir() {
        fs.readdir('resources', (err) => {
            if (err) {
                utils_1.Logger.warn("Directory 'resources' doesn't exist. Creating...");
                mkdir();
            }
            else {
                utils_1.Logger.info("Found directory: 'resources'.\n");
                callback(null, result);
            }
        });
        function mkdir() {
            fs.mkdir('resources', (err) => {
                if (err) {
                    utils_1.Logger.err(err);
                }
                else {
                    chmod();
                }
            });
        }
        function chmod() {
            fs.chmod('resources', 0o777, (err) => {
                if (err) {
                    utils_1.Logger.err(err);
                }
                else {
                    utils_1.Logger.done('Created.\n');
                    callback(null, result);
                }
            });
        }
    }
}
exports.checker = checker;
