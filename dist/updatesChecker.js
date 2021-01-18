"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const node_stream_zip_1 = __importDefault(require("node-stream-zip"));
const fs_1 = __importDefault(require("fs"));
const settings_1 = __importDefault(require("./modules/settings"));
const fileChecker_1 = __importDefault(require("./modules/fileChecker"));
const misc_1 = require("./modules/misc");
let settings;
let storagedData;
let jetDate;
let code;
let gitDate;
let hosts;
let hostsbak;
settings_1.default((err, result) => {
    if (err) {
        misc_1.Logger.err(err + '[S-0x0001]');
    }
    else {
        settings = result;
        fileChecker_1.default((err_1, result_1) => {
            if (err_1) {
                misc_1.Logger.err(err_1 + '[C-0x0001]');
            }
            else {
                storagedData = result_1;
                jet();
            }
        });
    }
});
function jet() {
    misc_1.Logger.info('Fetching pages... : JetsBrains Activation Codes');
    axios_1.default.get("http://idea.medeming.com/jets/").then((resp) => {
        const $ = cheerio_1.default.load(resp.data);
        jetDate = $("div").eq(2).text().replace(/[^0-9]/ig, "");
        misc_1.Logger.info("Fetched. \n");
        misc_1.Logger.info("Checking updates...");
        if (jetDate !== storagedData.codeDate) {
            misc_1.Logger.upd('Found updates! Downloading...');
            downloadJet();
        }
        else {
            misc_1.Logger.done("No available updates. Activation codes are the latest. :)\n");
            gitHosts();
        }
    }).catch((err) => misc_1.Logger.err(err + '[U-0x0001]'));
}
function downloadJet() {
    misc_1.downloadFile({
        path: 'code.zip',
        url: 'http://idea.medeming.com/jets/images/jihuoma.zip',
    }, (err) => {
        if (err) {
            misc_1.Logger.err(err + '[U-0x0101]');
        }
        else {
            misc_1.changeMode('code.zip', (err_1) => {
                if (err_1) {
                    misc_1.Logger.err(err_1 + '[U-0x0102]');
                }
                else {
                    misc_1.Logger.done('Downloaded.\n');
                    misc_1.Logger.info('Extracting files...');
                    extractJet();
                }
            });
        }
    });
}
function extractJet() {
    const zip = new node_stream_zip_1.default({ file: 'code.zip' });
    const entries = zip.entries();
    zip.on('ready', () => {
        misc_1.Logger.info('Entries found: ' + zip.entriesCount);
        let status = 0;
        let fileName = '';
        // 遍历键，寻找符合条件的激活码
        Object.keys(entries).forEach((key) => {
            misc_1.Logger.info('|_' + key);
            if (key.match('2018.1')) {
                fileName = key;
                status = 1;
            }
        });
        if (status) {
            misc_1.Logger.info('Codes are available.');
            extract(fileName);
        }
        else {
            misc_1.Logger.err('Codes are NOT available. Please contact the author to fix this problem. [U-0x0201]');
        }
    });
    zip.on('error', (err) => misc_1.Logger.err(err + '[U-0x0202]'));
    function extract(key) {
        code = String(zip.entryDataSync(key));
        zip.extract(key, 'resources/code.txt', (err) => {
            if (err) {
                misc_1.Logger.err(err + '[U-0x0203]');
            }
            else {
                zip.close();
                misc_1.changeMode('resources/code.txt', (err_1) => {
                    if (err_1) {
                        misc_1.Logger.err(err_1 + '[U-0x0204]');
                    }
                    else {
                        misc_1.Logger.done('Extracted.\n');
                        misc_1.Logger.info('Writing data...');
                        writeJetData();
                    }
                });
            }
        });
    }
}
function writeJetData() {
    storagedData.codeDate = jetDate;
    fs_1.default.writeFile('data.json', JSON.stringify(storagedData), (err) => {
        if (err) {
            misc_1.Logger.err(err + '[U-0x0301]');
        }
        else {
            misc_1.changeMode('data.json', (err_1) => {
                if (err_1) {
                    misc_1.Logger.err(err_1 + '[U-0x0302]');
                }
                else {
                    misc_1.Logger.done('File has been written successfully.\n');
                    if (settings.displayJetCode === 'yes') {
                        misc_1.Logger.info('Acivation code: \n' + code + '\n');
                    }
                    gitHosts();
                }
            });
        }
    });
}
function gitHosts() {
    misc_1.Logger.info('Fetching pages... : Github 520 Hosts');
    axios_1.default.get('https://cdn.jsdelivr.net/gh/521xueweihan/GitHub520@master/README.md').then(({ data }) => {
        gitDate = data.split("\n")[52].replace(/[^0-9]/ig, "");
        if (gitDate !== storagedData.hostsDate) {
            misc_1.Logger.upd('Found updates! Downloading...');
            downloadHosts();
        }
        else {
            misc_1.Logger.done('No available updates. Hosts are the latest. :)\n');
        }
    }).catch((err) => misc_1.Logger.err(err + '[U-0x0401]'));
}
function downloadHosts() {
    misc_1.downloadFile({
        path: 'hosts',
        url: 'https://cdn.jsdelivr.net/gh/521xueweihan/GitHub520@master/hosts',
    }, (err, { fileContent }) => {
        if (err) {
            misc_1.Logger.err(err + '[U-0x0501]');
        }
        else {
            hosts = fileContent;
            misc_1.changeMode('hosts', (err_1) => {
                if (err_1) {
                    misc_1.Logger.err(err_1 + '[U-0x0502]');
                }
                else {
                    misc_1.Logger.done('Downloaded.\n');
                    if (settings.writeHosts === 'yes') {
                        misc_1.Logger.info('Hosts writing function is developing... You should edit it manually.');
                    }
                    else {
                        writeHosts();
                    }
                }
            });
        }
    });
}

settings.displayHosts = undefined;

function writeHosts() {
    misc_1.Logger.info('Writing data...');
    storagedData.hostsDate = gitDate;
    fs_1.default.writeFile('data.json', JSON.stringify(storagedData), (err) => {
        if (err) {
            misc_1.Logger.err(err + '[U-0x0601]');
        }
        else {
            misc_1.changeMode('data.json', (err_1) => {
                if (err_1) {
                    misc_1.Logger.err(err_1 + '[U-0x0602]');
                }
                else {
                    misc_1.Logger.done('File has been written successfully.\n');
                    if (settings.displayHosts === "yes") {
                        misc_1.Logger.info('Github520 Hosts: \n' + hosts);
                    }
                }
            });
        }
    });
}
