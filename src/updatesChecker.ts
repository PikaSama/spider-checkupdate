import axios from 'axios';
import * as cheerio from 'cheerio';
import * as NodeZip from 'node-stream-zip';

import * as fs from 'fs';
import { checkFile as readSettings } from './modules/settings';
import { checker as checkDataAndDir } from './modules/fileChecker';

import {
    Result,
    Logger,
    downloadFile,
    changeMode,
} from "./modules/misc";
import {down} from "inquirer/lib/utils/readline";

let settings: Result;
let storagedData: Result;
let jetDate: string;
let code: string;
let gitDate: string;
let hosts: string;
let hostsbak: string;

readSettings((err, result): void => {
    if (err) {
        Logger.err(err + '[S-0x0001]');
    }
    else {
        settings = result;
        checkDataAndDir((err_1, result_1): void => {
            if (err_1) {
                Logger.err(err_1 + '[C-0x0001]');
            }
            else {
                storagedData = result_1;
                jet();
            }
        });
    }
});

function jet(): void {
    Logger.info('Fetching pages... : JetsBrains Activation Codes');
    axios.get("http://idea.medeming.com/jets/").then((resp): void => {
        const $: cheerio.Root = cheerio.load(resp.data);
        jetDate = $("div").eq(2).text().replace(/[^0-9]/ig,"");
        Logger.info("Fetched. \n");
        Logger.info("Checking updates...");
        if (jetDate !== storagedData.codeDate) {
            Logger.upd('Found updates! Downloading...');
            downloadJet();
        }
        else {
            Logger.done("No available updates. Activation codes are the latest. :)\n");
            gitHosts();
        }
    }).catch((err): void => Logger.err(err + '[U-0x0001]'));
}

function downloadJet(): void {
    downloadFile({
        path: 'code.zip',
        url: 'http://idea.medeming.com/jets/images/jihuoma.zip',
    }, (err): void => {
        if (err) {
            Logger.err(err + '[U-0x0101]');
        }
        else {
            changeMode('code.zip', (err_1): void => {
                if (err_1) {
                    Logger.err(err_1 + '[U-0x0102]');
                }
                else {
                    Logger.done('Downloaded.\n');
                    Logger.info('Extracting files...');
                    extractJet();
                }
            });
        }
    })
}

function extractJet(): void {
    const zip: NodeZip = new NodeZip({ file: 'code.zip' });
    const entries = zip.entries();
    zip.on('ready', (): void => {
        Logger.info('Entries found: '+ zip.entriesCount);
        let status = 0;
        let fileName = '';
        // 遍历键，寻找符合条件的激活码
        Object.keys(entries).forEach((key): void => {
            Logger.info('|_' + key);
            if (key.match('2018.1')) {
                fileName = key;
                status = 1;
            }
        });
        if (status) {
            Logger.info('Codes are available.');
            extract(fileName);
        }
        else {
            Logger.err('Codes are NOT available. Please contact the author to fix this problem. [U-0x0201]');
        }
    });
    zip.on('error',(err): void => Logger.err(err + '[U-0x0202]'));

    function extract(key: string): void {
        code = String(zip.entryDataSync(key));
        zip.extract(key, 'resources/code.txt', (err): void => {
            if (err) {
                Logger.err(err + '[U-0x0203]');
            }
            else {
                zip.close();
                changeMode('resources/code.txt', (err_1): void => {
                    if (err_1) {
                        Logger.err(err_1 + '[U-0x0204]');
                    }
                    else {
                        Logger.done('Extracted.\n');
                        Logger.info('Writing data...');
                        writeJetData();
                    }
                });
            }
        });
    }
}

function writeJetData(): void {
    storagedData.codeDate = jetDate;
    fs.writeFile('data.json', JSON.stringify(storagedData), (err): void => {
        if (err) {
            Logger.err(err + '[U-0x0301]')
        }
        else {
            changeMode('data.json', (err_1): void => {
                if (err_1) {
                    Logger.err(err_1 + '[U-0x0302]');
                }
                else {
                    Logger.done('File has been written successfully.\n');
                    if (settings.displayJetCode === 'yes') {
                        Logger.info('Acivation code: \n' + code + '\n');
                    }
                    gitHosts();
                }
            });
        }
    });
}

function gitHosts(): void {
    Logger.info('Fetching pages... : Github 520 Hosts');
    axios.get('https://cdn.jsdelivr.net/gh/521xueweihan/GitHub520@master/README.md').then(({ data }): void => {
        gitDate = data.split("\n")[52].replace(/[^0-9]/ig,"");
        if (gitDate !== storagedData.hostsDate) {
            Logger.upd('Found updates! Downloading...');
            downloadHosts();
        }
        else {
            Logger.done('No available updates. Hosts are the latest. :)\n');
        }
    }).catch((err): void => Logger.err(err + '[U-0x0401]'));
}

function downloadHosts(): void {
    downloadFile({
        path: 'hosts',
        url: 'https://cdn.jsdelivr.net/gh/521xueweihan/GitHub520@master/hosts',
    }, (err, { fileContent }): void => {
        if (err) {
            Logger.err(err + '[U-0x0501]');
        }
        else {
            hosts = fileContent;
            changeMode('hosts', (err_1): void => {
                if (err_1) {
                    Logger.err(err_1 + '[U-0x0502]');
                }
                else {
                    Logger.done('Downloaded.\n');
                    if (settings.writeHosts === 'yes') {
                        Logger.info('Hosts writing function is developing... You should edit it manually.');
                    }
                    else {
                        writeHosts();
                    }
                }
            });
        }
    });
}

function writeHosts(): void {
    Logger.info('Writing data...');
    storagedData.hostsDate = gitDate;
    fs.writeFile('data.json', JSON.stringify(storagedData), (err): void => {
        if (err) {
            Logger.err(err + '[U-0x0601]');
        }
        else {
            changeMode('data.json', (err_1): void => {
                if (err_1) {
                    Logger.err(err_1 + '[U-0x0602]');
                }
                else {
                    Logger.done('File has been written successfully.\n');
                    if (settings.displayHosts === "yes") {
                        Logger.info('Github520 Hosts: \n' + hosts);
                    }
                }
            });
        }
    });
}