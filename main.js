const updates = require("./updatesChecker.js");
const cfg = require("./settings.js");
const reset = require("./reset.js")
const inquirer = require("inquirer");
let options;
exports.mainMenu = () => {
    menu();
}
menu();
function menu(){
    inquirer.prompt([
        {
            type: "list",
            message: "Please choose an option ",
            name:"menu",
            prefix: '----------------',
            suffix: '----------------',
            choices: [
                "Check updates",
                "Settings",
                "Change data owner and group",
                "Clear data",
                "Restore system hosts",
                "Exit"
            ],
            filter: val => val.toLowerCase()
        }
    ]).then(answer => {
        options = answer;
        checkAnswer();
    });
}
function checkAnswer() {
    if (options.menu == "check updates") {
        updates.check();
    }
    else if(options.menu == "settings") {
        cfg.settings();
    }
    else if(options.menu == "change data owner and group") {
        inquirer.prompt([
            {
                type: "list",
                message: "-------------- Are You Sure About That? ----------------\nThis will change the owner and group of the following\nfiles and directories:\n1. data.json\n2. settings.json\n3. directory 'resources'\n----------------------------------------------------------\n! Warn: This depends superuser privileges to perform.\n! It may cause some unexpected problems.",
                name:"confirm",
                choices: [
                    "Confirm",
                    "Cancel",
                ],
                default: "No",
                filter: val => val.toLowerCase()
            }
        ]).then(answer => {
            if (answer.confirm == "confirm") {
                reset.chownData();
            }
            else {
                menu();
            }
        });
    }
    else if (options.menu == "clear data") {
        inquirer.prompt([
            {
                type: "list",
                message: "-------------- Are You Sure About That? ----------------\nThis will detele the following files:\n1. data.json\n2. settings.json\n3. directory 'resources'\n----------------------------------------------------------",
                name:"confirm",
                choices: [
                    "Confirm",
                    "Cancel",
                ],
                default: "Cancel",
                filter: val => val.toLowerCase()
            }
        ]).then(answer => {
            if (answer.confirm == "confirm") {
                reset.clearData();
            }
            else {
                menu();
            }
        });
    }
    else if (options.menu == "restore system hosts") {
        reset.restoreHosts();
    }
}
