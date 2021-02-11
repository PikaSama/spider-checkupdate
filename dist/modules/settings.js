"use strict";
/**
 * Author: Zorin
 * Github: https://github.com/PikaSama
 * Project: Spider-Checkupdate
 * Description: 设置界面模块
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFile = void 0;
const inquirer = require("inquirer");
// 本地模块
const fs = require("fs");
const utils_1 = require("./utils");
function checkFile(callback) {
    fs.readFile('settings.json', 'utf8', (err, data) => {
        if (err) {
            utils_1.Logger.warn("Settings file 'settings.json' doesn't exist. \n");
            guide();
        }
        else {
            utils_1.Logger.info("Found settings file 'settings.json' .");
            callback(null, JSON.parse(data));
        }
    });
    // 设置界面
    function guide() {
        inquirer
            .prompt([
            {
                type: 'list',
                message: 'Display the activation code? (When updates found) : ',
                name: 'displayJetCode',
                choices: ['Yes', 'No'],
                filter: (val) => val.toLowerCase(),
            },
            {
                type: 'list',
                message: "Display the Github520 hosts' content? (When updates found) :",
                name: 'displayHosts',
                choices: ['Yes', 'No'],
                filter: (val) => val.toLowerCase(),
            },
            {
                type: 'list',
                message: 'Write the latest Github520 hosts to /etc/hosts? \n! Warn: This depends superuser privileges to perform. It may cause some unexpected problems. :',
                name: 'writeHosts',
                choices: ['Yes', 'No'],
                filter: (val) => val.toLowerCase(),
            },
        ])
            .then((answer) => {
            utils_1.Logger.info('Writing settings file...');
            fs.writeFile('settings.json', JSON.stringify(answer), (err) => {
                if (err) {
                    callback(err);
                }
                else {
                    utils_1.Logger.done('Settings has saved.');
                    callback(null, answer);
                }
            });
        });
    }
}
exports.checkFile = checkFile;
