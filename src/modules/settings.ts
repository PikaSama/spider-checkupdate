/**
 * Author: Zorin
 * Github: https://github.com/PikaSama
 * Project: Spider-Checkupdate
 * Description: 设置界面模块
 * License: GPL-3.0
 */

import inquirer from 'inquirer';

// 本地模块
import fs from 'fs';
import {
    CallbackFn,
    Result,
    Logger,
} from "./misc";

function checkFile(callback: CallbackFn): void {
    fs.readFile('settings.json', 'utf8', (err,data): void => {
        if (err) {
            Logger.warn('Settings file \'settings.json\' doesn\'t exist. \n');
            guide();
        }
        else {
            Logger.info("Found settings file 'settings.json' .");
            callback(null, JSON.parse(data));
        }
    });

    // 设置界面
    function guide(): void {
        inquirer.prompt([
            {
                type: "list",
                message: "Display the activation code? (When updates found) : ",
                name:"displayJetCode",
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
        ]).then((answer: Result): void => {
            Logger.info('Writing settings file...');
            fs.writeFile('settings.json', JSON.stringify(answer), (err) => {
                if (err) {
                    callback(err);
                }
                else {
                    Logger.done('Settings has saved.');
                    callback(null, answer);
                }
            });
        });
    }
}

export default checkFile;
