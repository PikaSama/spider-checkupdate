const updates = require("./updatesChecker.js");
const cfg = require("./settings.js");
const reset = require("./reset.js")
const inquirer = require("inquirer");
let options;
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
                "Clear data",
                "Restore System Hosts",
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
                default: "No",
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
