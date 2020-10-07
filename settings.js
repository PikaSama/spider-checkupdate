const jumpTo = require("./main.js");
const inquirer = require("inquirer");
const fs = require("fs");
let config;
exports.qtemp = callback => {
    questionTemplate(callback);
}
exports.settings = () => {
    questionTemplate(answer => {
        config = answer;
        writeCfg();
    });
}
function questionTemplate(callback) {
    inquirer.prompt([
        {
            type: "list",
            message: "Display the activation code? (When updates found) : ",
            name:"display_jetcode",
            choices: [
                "Yes",
                "No"
            ],
            filter: val => val.toLowerCase()
        },
        {
            type: "list",
            message: "Display the Github520 hosts' content? (When updates found) :",
            name: "display_hosts",
            choices: [
                "Yes",
                "No"
            ],
            filter: val => val.toLowerCase()
        },
        {
            type: "list",
            message: "Write the latest Github520 hosts to /etc/hosts? \n! Warn: This depends superuser privileges to perform. It may cause some unexpected problems. :",
            name: "write_hosts",
            choices: [
                "Yes",
                "No"
            ],
            filter: val => val.toLowerCase()
        }
    ]).then(callback);
}
function writeCfg() {
    console.log("\033[44;37m Info \033[0m Writing settings to 'settings.json'...");
    fs.writeFile('settings.json',JSON.stringify(config),err => {
       if (err) {
           console.error("\033[41;37m Error \033[0m "+err+"\n");
       }
       else {
           chmod();
       }
    });
    function chmod() {
        fs.chmod('settings.json',0o666,err => {
            if (err) {
                console.error("\033[41;37m Error \033[0m "+err+"\n");
            }
            else {
                console.log("\033[46;37m Succeed \033[0m File has been written successfully.");
                jumpTo.mainMenu();
            }
        });
    }
}