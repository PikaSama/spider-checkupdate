const fs = require("fs");
exports.clearData = () => {
    fs.unlink('data.json',err => {
        if (err) {
            console.error("\033[41;37m Error \033[0m "+err+"\n");
        }
        else {
            console.log("\033[46;37m Succeed \033[0m File 'data.json' has been deleted.\n");
        }
    });
    fs.unlink('settings.json',err => {
        if (err) {
            console.error("\033[41;37m Error \033[0m "+err+"\n");
        }
        else {
            console.log("\033[46;37m Succeed \033[0m File 'settings.json' has been deleted.\n");
        }
    });
    removeDirectory();
}
function removeDirectory() {
    fs.unlink('resources/hosts',err => {
        if (err) {
            console.error("\033[41;37m Error \033[0m "+err+"\n");
        }
        else {
            console.log("\033[46;37m Succeed \033[0m File 'resources/hosts' has been deleted.\n");
        }
        step2();
    });
    function step2() {
        fs.unlink('resources/jetsCode.zip',err => {
            if (err) {
                console.error("\033[41;37m Error \033[0m "+err+"\n");
            }
            else {
                console.log("\033[46;37m Succeed \033[0m File 'resources/jetsCode.zip' has been deleted.\n");
            }
            step3();
        });
    }
    function step3() {
        fs.unlink('resources/code.txt',err => {
            if (err) {
                console.error("\033[41;37m Error \033[0m "+err+"\n");
            }
            else {
                console.log("\033[46;37m Succeed \033[0m File 'resources/code.txt' has been deleted.\n");
            }
            step4();
        });
    }
    function step4() {
        fs.rmdir('resources',err => {
            if (err) {
                console.error("\033[41;37m Error \033[0m "+err+"\n");
            }
            else {
                console.log("\033[46;37m Succeed \033[0m Directory 'resources' has been deleted.\n");
            }
        });
    }
}
exports.restoreHosts = () => {
    fs.copyFile('hosts.bak','/etc/hosts',err => {
        if (err) {
            console.error("\033[41;37m Error \033[0m "+err+"\n");
        }
        else {
            chmod();
        }
    });
    function chmod() {
        fs.chmod('/etc/hosts',0o644,err => {
            if (err) {
                console.error("\033[41;37m Error \033[0m "+err+"\n");
            }
            else {
                console.log("\033[46;37m Succeed \033[0m Hosts has been restored.\n");
            }
        });
    }
}