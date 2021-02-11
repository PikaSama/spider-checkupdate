const go2main = require('./main.js');
const inquirer = require('inquirer');
const fs = require('fs');
let userID;
let groupID;
exports.clearData = () => {
    fs.unlink('data.json', (err) => {
        if (err) {
            console.error('\033[41;37m Error \033[0m ' + err + '\n');
        } else {
            console.log("\033[46;37m Succeed \033[0m File 'data.json' has been deleted.\n");
        }
        step2();
    });
    function step2() {
        fs.unlink('settings.json', (err) => {
            if (err) {
                console.error('\033[41;37m Error \033[0m ' + err + '\n');
            } else {
                console.log("\033[46;37m Succeed \033[0m File 'settings.json' has been deleted.\n");
            }
            removeDirectory();
        });
    }
};
function removeDirectory() {
    fs.unlink('resources/hosts', (err) => {
        if (err) {
            console.error('\033[41;37m Error \033[0m ' + err + '\n');
        } else {
            console.log("\033[46;37m Succeed \033[0m File 'resources/hosts' has been deleted.\n");
        }
        step2();
    });
    function step2() {
        fs.unlink('resources/jetsCode.zip', (err) => {
            if (err) {
                console.error('\033[41;37m Error \033[0m ' + err + '\n');
            } else {
                console.log("\033[46;37m Succeed \033[0m File 'resources/jetsCode.zip' has been deleted.\n");
            }
            step3();
        });
    }
    function step3() {
        fs.unlink('resources/code.txt', (err) => {
            if (err) {
                console.error('\033[41;37m Error \033[0m ' + err + '\n');
            } else {
                console.log("\033[46;37m Succeed \033[0m File 'resources/code.txt' has been deleted.\n");
            }
            step4();
        });
    }
    function step4() {
        fs.rmdir('resources', (err) => {
            if (err) {
                console.error('\033[41;37m Error \033[0m ' + err + '\n');
            } else {
                console.log("\033[46;37m Succeed \033[0m Directory 'resources' has been deleted.\n");
            }
            go2main.mainMenu();
        });
    }
}
exports.restoreHosts = () => {
    fs.copyFile('hosts.bak', '/etc/hosts', (err) => {
        if (err) {
            console.error('\033[41;37m Error \033[0m ' + err + '\n');
            go2main.mainMenu();
        } else {
            chmod();
        }
    });
    function chmod() {
        fs.chmod('/etc/hosts', 0o644, (err) => {
            if (err) {
                console.error('\033[41;37m Error \033[0m ' + err + '\n');
            } else {
                console.log('\033[46;37m Succeed \033[0m Hosts has been restored.\n');
            }
            go2main.mainMenu();
        });
    }
};
exports.chownData = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Please input your UID: ',
                name: 'uid',
            },
            {
                type: 'input',
                message: 'Please input your GID: ',
                name: 'gid',
            },
        ])
        .then((answer) => {
            userID = parseInt(answer.uid);
            groupID = parseInt(answer.gid);
            step1();
        });
    function step1() {
        fs.chown('data.json', userID, groupID, (err) => {
            if (err) {
                console.error('\033[41;37m Error \033[0m ' + err + '\n');
            } else {
                console.log("\033[46;37m Succeed \033[0m The owner and group of 'data.json' has been changed.\n");
            }
            step2();
        });
    }
    function step2() {
        fs.chown('settings.json', userID, groupID, (err) => {
            if (err) {
                console.error('\033[41;37m Error \033[0m ' + err + '\n');
            } else {
                console.log("\033[46;37m Succeed \033[0m The owner and group of 'settings.json' has been changed.\n");
            }
            chownDirectory();
        });
    }
};
function chownDirectory() {
    fs.chown('resources/hosts', userID, groupID, (err) => {
        if (err) {
            console.error('\033[41;37m Error \033[0m ' + err + '\n');
        } else {
            console.log("\033[46;37m Succeed \033[0m The owner and group of 'resources/hosts' has been changed.\n");
        }
        step2();
    });
    function step2() {
        fs.chown('resources/jetsCode.zip', userID, groupID, (err) => {
            if (err) {
                console.error('\033[41;37m Error \033[0m ' + err + '\n');
            } else {
                console.log(
                    "\033[46;37m Succeed \033[0m The owner and group of 'resources/jetsCode.zip' has been changed.\n",
                );
            }
            step3();
        });
    }
    function step3() {
        fs.chown('resources/code.txt', userID, groupID, (err) => {
            if (err) {
                console.error('\033[41;37m Error \033[0m ' + err + '\n');
            } else {
                console.log(
                    "\033[46;37m Succeed \033[0m The owner and group of 'resources/code.txt' has been changed.\n",
                );
            }
            step4();
        });
    }
    function step4() {
        fs.chown('resources', userID, groupID, (err) => {
            if (err) {
                console.error('\033[41;37m Error \033[0m ' + err + '\n');
            } else {
                console.log(
                    "\033[46;37m Succeed \033[0m The owner and group of directory 'resources' has been changed.\n",
                );
            }
            go2main.mainMenu();
        });
    }
}
