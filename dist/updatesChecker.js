"use strict";
/**
 * Author: Zorin
 * Github: https://github.com/PikaSama
 * Project: Spider-Checkupdate
 * Description: 更新检查模块
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
// import { default as axios } from 'axios';
const axios_1 = require("axios");
const cheerio = require("cheerio");
const NodeZip = require("node-stream-zip");
// 本地模块
const fs = require("fs");
const settings_1 = require("./modules/settings");
const fileChecker_1 = require("./modules/fileChecker");
const utils_1 = require("./modules/utils");
let settings;
let storagedData;
let jetDate;
let code;
let gitDate;
let hosts;
let hostsbak;
settings_1.checkFile((err, result) => {
    if (err) {
        utils_1.Logger.err(err + '[S-0x0001]');
    }
    else {
        settings = result;
        fileChecker_1.checker((err_1, result_1) => {
            if (err_1) {
                utils_1.Logger.err(err_1 + '[C-0x0001]');
            }
            else {
                storagedData = result_1;
                jet();
            }
        });
    }
});
function jet() {
    utils_1.Logger.info('Fetching pages... : JetsBrains Activation Codes');
    axios_1.default
        .get('http://idea.medeming.com/jets/')
        .then((resp) => {
        const $ = cheerio.load(resp.data);
        jetDate = $('div')
            .eq(2)
            .text()
            .replace(/[^0-9]/gi, '');
        utils_1.Logger.info('Fetched. \n');
        utils_1.Logger.info('Checking updates...');
        if (jetDate !== storagedData.codeDate) {
            utils_1.Logger.upd('Found updates! Downloading...');
            downloadJet();
        }
        else {
            utils_1.Logger.done('No available updates. Activation codes are the latest. :)\n');
            gitHosts();
        }
    })
        .catch((err) => utils_1.Logger.err(err + '[U-0x0001]'));
}
function downloadJet() {
    utils_1.downloadFile({
        path: 'code.zip',
        url: 'http://idea.medeming.com/jets/images/jihuoma.zip',
    }, (err) => {
        if (err) {
            utils_1.Logger.err(err + '[U-0x0101]');
        }
        else {
            utils_1.changeMode('code.zip', (err_1) => {
                if (err_1) {
                    utils_1.Logger.err(err_1 + '[U-0x0102]');
                }
                else {
                    utils_1.Logger.done('Downloaded.\n');
                    utils_1.Logger.info('Extracting files...');
                    extractJet();
                }
            });
        }
    });
}
function extractJet() {
    const zip = new NodeZip({ file: 'code.zip' });
    const entries = zip.entries();
    zip.on('ready', () => {
        utils_1.Logger.info('Entries found: ' + zip.entriesCount);
        let status = 0;
        let fileName = '';
        // 遍历键，寻找符合条件的激活码
        Object.keys(entries).forEach((key) => {
            utils_1.Logger.info('|_' + key);
            if (key.match('2018.1')) {
                fileName = key;
                status = 1;
            }
        });
        if (status) {
            utils_1.Logger.info('Codes are available.');
            extract(fileName);
        }
        else {
            utils_1.Logger.err('Codes are NOT available. Please contact the author to fix this problem. [U-0x0201]');
        }
    });
    zip.on('error', (err) => utils_1.Logger.err(err + '[U-0x0202]'));
    function extract(key) {
        code = String(zip.entryDataSync(key));
        zip.extract(key, 'resources/code.txt', (err) => {
            if (err) {
                utils_1.Logger.err(err + '[U-0x0203]');
            }
            else {
                zip.close();
                utils_1.changeMode('resources/code.txt', (err_1) => {
                    if (err_1) {
                        utils_1.Logger.err(err_1 + '[U-0x0204]');
                    }
                    else {
                        utils_1.Logger.done('Extracted.\n');
                        utils_1.Logger.info('Writing data...');
                        writeJetData();
                    }
                });
            }
        });
    }
}
function writeJetData() {
    storagedData.codeDate = jetDate;
    fs.writeFile('data.json', JSON.stringify(storagedData), (err) => {
        if (err) {
            utils_1.Logger.err(err + '[U-0x0301]');
        }
        else {
            utils_1.changeMode('data.json', (err_1) => {
                if (err_1) {
                    utils_1.Logger.err(err_1 + '[U-0x0302]');
                }
                else {
                    utils_1.Logger.done('File has been written successfully.\n');
                    if (settings.displayJetCode === 'yes') {
                        utils_1.Logger.info('Acivation code: \n' + code + '\n');
                    }
                    gitHosts();
                }
            });
        }
    });
}
function gitHosts() {
    utils_1.Logger.info('Fetching pages... : Github 520 Hosts');
    axios_1.default
        .get('https://cdn.jsdelivr.net/gh/521xueweihan/GitHub520@master/README.md')
        .then(({ data }) => {
        gitDate = data.split('\n')[52].replace(/[^0-9]/gi, '');
        if (gitDate !== storagedData.hostsDate) {
            utils_1.Logger.upd('Found updates! Downloading...');
            downloadHosts();
        }
        else {
            utils_1.Logger.done('No available updates. Hosts are the latest. :)\n');
        }
    })
        .catch((err) => utils_1.Logger.err(err + '[U-0x0401]'));
}
function downloadHosts() {
    utils_1.downloadFile({
        path: 'hosts',
        url: 'https://cdn.jsdelivr.net/gh/521xueweihan/GitHub520@master/hosts',
    }, (err, { fileContent }) => {
        if (err) {
            utils_1.Logger.err(err + '[U-0x0501]');
        }
        else {
            hosts = fileContent;
            utils_1.changeMode('hosts', (err_1) => {
                if (err_1) {
                    utils_1.Logger.err(err_1 + '[U-0x0502]');
                }
                else {
                    utils_1.Logger.done('Downloaded.\n');
                    if (settings.writeHosts === 'yes') {
                        utils_1.Logger.info('Hosts writing function is developing... You should edit it manually.');
                    }
                    else {
                        writeHosts();
                    }
                }
            });
        }
    });
}
function writeHosts() {
    utils_1.Logger.info('Writing data...');
    storagedData.hostsDate = gitDate;
    fs.writeFile('data.json', JSON.stringify(storagedData), (err) => {
        if (err) {
            utils_1.Logger.err(err + '[U-0x0601]');
        }
        else {
            utils_1.changeMode('data.json', (err_1) => {
                if (err_1) {
                    utils_1.Logger.err(err_1 + '[U-0x0602]');
                }
                else {
                    utils_1.Logger.done('File has been written successfully.\n');
                    if (settings.displayHosts === 'yes') {
                        utils_1.Logger.info('Github520 Hosts: \n' + hosts);
                    }
                }
            });
        }
    });
}
