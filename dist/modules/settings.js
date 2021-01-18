"use strict";
/**
 * Author: Zorin
 * Github: https://github.com/PikaSama
 * Project: Spider-Checkupdate
 * Description: 设置界面模块
 * License: GPL-3.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
// 本地模块
const fs_1 = __importDefault(require("fs"));
const misc_1 = require("./misc");
function checkFile(callback) {
    fs_1.default.readFile('settings.json', 'utf8', (err, data) => {
        if (err) {
            misc_1.Logger.warn('Settings file \'settings.json\' doesn\'t exist. \n');
            guide();
        }
        else {
            misc_1.Logger.info("Found settings file 'settings.json' .");
            callback(null, JSON.parse(data));
        }
    });
    // 设置界面
    function guide() {
        inquirer_1.default.prompt([
            {
                type: "list",
                message: "Display the activation code? (When updates found) : ",
                name: "displayJetCode",
                choices: [
                    "Yes",
                    "No"
                ],
                filter: val => val.toLowerCase(),
            },
            {
                type: "list",
                message: "Display the Github520 hosts' content? (When updates found) :",
                name: "displayHosts",
                choices: [
                    "Yes",
                    "No"
                ],
                filter: val => val.toLowerCase(),
            },
            {
                type: "list",
                message: "Write the latest Github520 hosts to /etc/hosts? \n! Warn: This depends superuser privileges to perform. It may cause some unexpected problems. :",
                name: "writeHosts",
                choices: [
                    "Yes",
                    "No"
                ],
                filter: val => val.toLowerCase(),
            }
        ]).then((answer) => {
            misc_1.Logger.info('Writing settings file...');
            fs_1.default.writeFile('settings.json', JSON.stringify(answer), (err) => {
                if (err) {
                    callback(err);
                }
                else {
                    misc_1.Logger.done('Settings has saved.');
                    callback(null, answer);
                }
            });
        });
    }
}
exports.default = checkFile;
