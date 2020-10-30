const conf = require("./settings.js");
const axios = require("axios");
const cheerio = require("cheerio");
const unzip = require("node-stream-zip");
const fs = require("fs");
let storage;
let jetsDate;
let gitDate;
let code;
let hosts;
let hostsbak;
let options;
exports.check = () => {
    fs.readFile('settings.json','utf8',(err,data) => {
        if (err) {
            console.warn("\033[41;37m Warn \033[0m Settings file 'settings.json' doesn't exist. \n");
            conf.qtemp(answer => {
                options = answer;
                readData();
            });
        }
        else {
            console.log("\033[44;37m Info \033[0m Found settings file: 'settings.json'. \n");
            options = JSON.parse(data);
            readData();
        }
    });
}
function readData() {
    fs.readFile('data.json','utf8',(err,data) => {
        if (err) {
            console.warn("\033[41;37m Warn \033[0m File 'data.json' doesn't exist. \n");
            storage = {jets:"none",github:"none"};
        }
        else {
            console.log("\033[44;37m Info \033[0m Found file: 'data.json'. \n");
            storage = JSON.parse(data);
        }
        readDir();
    });
}
function readDir() {
    fs.readdir('resources',err => {
       if (err) {
           console.warn("\033[41;37m Warn \033[0m Directory 'resources' doesn't exist. Creating...");
           mkdir();
       }
       else {
           console.log("\033[44;37m Info \033[0m Found directory: 'resources'.\n");
           jet();
       }
    });
    function mkdir() {
        fs.mkdir('resources',err => {
            if (err) {
                console.error("\033[41;37m Error \033[0m "+err+"\n");
            }
            else {
                chmod();
            }
        });
    }
    function chmod() {
        fs.chmod('resources',0o777,err => {
            if (err) {
                console.error("\033[41;37m Error \033[0m "+err+"\n");
            }
            else {
                console.log("\033[46;37m Succeed \033[0m Created.\n");
                jet();
            }
        });
    }
}
function jet() {
    console.log("\033[44;37m Info \033[0m Fetching pages... : JetsBrains Activation Codes");
    axios.get("http://idea.medeming.com/jets/").then(resp => {
        let $ = cheerio.load(resp.data);
        jetsDate = $("div").eq(2).text().replace(/[^0-9]/ig,"");
        console.log("\033[46;37m Succeed \033[0m Fetched. \n");
        console.log("\033[44;37m Info \033[0m Checking updates...")
        if (jetsDate != storage.jets) {
            console.log("\033[43;37m Update \033[0m Found updates! Downloading...");
            downloadJet();
        }
        else {
            console.log("\033[45;37m Final \033[0m No available updates. Activation codes are the latest. :)\n");
            gitlove();
        }
    }).catch(err => {
        console.error("\033[41;37m Error \033[0m "+err+"\n");
    });
    function downloadJet() {
        axios({
            url:"http://idea.medeming.com/jets/images/jihuoma.zip",
            responseType:'arraybuffer'
        }).then(resp => resp.data).then(data => {
            fs.writeFile('resources/jetsCode.zip',data,'binary',err => err ? console.error("\033[41;37m Error \033[0m "+err+"\n"):chmod())
        }).catch(err => console.error("\033[41;37m Error \033[0m "+err+"\n"));
        function chmod() {
            fs.chmod('resources/jetsCode.zip',0o666,err => {
                if (err) {
                    console.error("\033[41;37m Error \033[0m "+err+"\n");
                }
                else {
                    console.log("\033[46;37m Succeed \033[0m Downloaded.\n");
                    console.log("\033[44;37m Info \033[0m Extracting files...");
                    extractJet();
                }
            });
        }
    }
    function extractJet() {
        const zip = new unzip({file:'resources/jetsCode.zip'});
        zip.on('ready',() => {
            console.log("\033[44;37m Info \033[0m Entries found: "+zip.entriesCount);
            for (let key in zip.entries()) {
                console.log("\033[44;37m Info \033[0m |_ "+key);
                if (key.match("later")) {
                    extract(key);
                    break;
                }
            }
        });
        zip.on('error',err => {
            console.error("\033[41;37m Error \033[0m "+err+"\n");
        });
        function extract(key) {
            code = zip.entryDataSync(key);
            zip.extract(key,'resources/code.txt',err => {
                if (err) {
                    console.error("\033[41;37m Error \033[0m "+err+"\n");
                }
                else {
                    zip.close();
                    chmod();
                }
            });
        }
        function chmod() {
            fs.chmod('resources/code.txt',0o666,err => {
                if (err) {
                    console.error("\033[41;37m Error \033[0m "+err+"\n");
                }
                else {
                    console.log("\033[46;37m Succeed \033[0m Extracted.\n");
                    console.log("\033[44;37m Info \033[0m Writing data to data.json...");
                    writeJet();
                }
            });
        }
    }
    function writeJet() {
        storage.jets = jetsDate;
        fs.writeFile('data.json',JSON.stringify(storage),err => {
            if (err) {
                console.error("\033[41;37m Error \033[0m "+err+"\n");
            }
            else {
                chmod();
            }
        });
        function chmod() {
            fs.chmod('data.json',0o666,err => {
                if (err) {
                    console.error("\033[41;37m Error \033[0m "+err+"\n");
                }
                else {
                    console.log("\033[45;37m Final \033[0m File has been written successfully.\n");
                    if (options.display_jetcode == "yes") {
                        console.log("\033[44;37m Info \033[0m Acivation code: \n"+code+"\n");
                    }
                    gitlove();
                }
            });
        }
    }
}
function gitlove() {
    console.log("\033[44;37m Info \033[0m Fetching pages... : Github 520 Hosts");
    axios.get("https://github.com.cnpmjs.org/521xueweihan/GitHub520").then(resp => {
        let $ = cheerio.load(resp.data);
        gitDate = $("p").eq(13).text().replace(/[^0-9]/ig,"");
        console.log("\033[46;37m Succeed \033[0m Fetched.\n");
        console.log("\033[44;37m Info \033[0m Checking updates...");
        if (gitDate != storage.github) {
            console.log("\033[43;37m Update \033[0m Found updates! Downloading...");
            downloadHosts();
        }
        else {
            console.log("\033[45;37m Final \033[0m No available updates. Hosts are the latest. :)\n");
        }
    }).catch(err => {
        console.error("\033[41;37m Error \033[0m "+err+"\n");
    });
    function downloadHosts() {
        axios({
            url:"https://gitee.com/xueweihan/codes/6g793pm2k1hacwfbyesl464/raw?blob_name=GitHub520.yml",
            responseType:'arraybuffer'
        }).then(resp => resp.data).then(data => {
            hosts = data.toString();
            fs.writeFile('resources/hosts',data,err => err ? console.error("\033[41;37m Error \033[0m "+err+"\n"):chmod());
        }).catch(err => console.error("\033[41;37m Error \033[0m "+err+"\n"));
        function chmod() {
            fs.chmod('resources/hosts',0o666,err => {
                if (err) {
                    console.error("\033[41;37m Error \033[0m "+err+"\n");
                }
                else {
                    console.log("\033[46;37m Succeed \033[0m Downloaded.\n");
                    if (options.write_hosts == "yes") {
                        readBackup();
                    }
                    else {
                        writeHostDate();
                    }
                }
            });
        }
    }
    function readBackup() {
        fs.readFile('hosts.bak','utf8',(err,data) => {
            if (err) {
                console.warn("\033[41;37m Warn \033[0m File 'hosts.bak' doesn't exist. Creating...");
                copySysHosts();
            }
            else {
                console.log("\033[44;37m Info \033[0m Found backup file: 'hosts.bak'. \n");
                hostsbak = data;
                writeHosts();
            }
        });
        function copySysHosts() {
            fs.copyFile('/etc/hosts','hosts.bak',err => {
                if (err) {
                    console.error("\033[41;37m Error \033[0m "+err+"\n");
                }
                else {
                    chmod();
                }
            });
        }
        function chmod() {
            fs.chmod('hosts.bak',0o666,err => {
                if (err) {
                    console.error("\033[41;37m Error \033[0m "+err+"\n");
                }
                else {
                    console.log("\033[46;37m Succeed \033[0m Created.\n");
                    readBackup();
                }
            });
        }
    }
    function writeHosts() {
        console.log("\033[44;37m Info \033[0m Writing hosts to '/etc/hosts'...")
        fs.writeFile('/etc/hosts',hosts,err => {
            if (err) {
                console.error("\033[41;37m Error \033[0m "+err+"\n");
            }
            else {
                appendGhHosts();
            }
        });
        function appendGhHosts() {
            fs.appendFile('/etc/hosts',hostsbak,err => {
                if (err) {
                    console.error("\033[41;37m Error \033[0m "+err+"\n");
                }
                else {
                    console.log("\033[46;37m Succeed \033[0m Hosts has been written successfully.\n");
                    writeHostDate();
                }
            });
        }
    }
    function writeHostDate() {
        console.log("\033[44;37m Info \033[0m Writing data to data.json...");
        storage.github = gitDate;
        fs.writeFile('data.json',JSON.stringify(storage),err => {
            if (err) {
                console.error("\033[41;37m Error \033[0m "+err+"\n");
            }
            else {
                chmod();
            }
        });
        function chmod() {
            fs.chmod('data.json',0o666,err => {
                if (err) {
                    console.error("\033[41;37m Error \033[0m "+err+"\n");
                }
                else {
                    console.log("\033[45;37m Final \033[0m File has been written successfully.\n");
                    if (options.display_hosts == "yes") {
                        console.log("\033[44;37m Info \033[0m Github520 Hosts: \n"+hosts);
                    }
                }
            });
        }
    }
}