import axios from 'axios';
import * as cheerio from 'cheerio';
import * as inquirer from 'inquirer';
import * as nodeZip from 'node-stream-zip';

import * as fs from 'fs';
import { checkFile as readSettings } from './modules/settings';
import { checker as checkDataAndDir } from './modules/fileChecker';

import {
    Result,
    Logger,
    downloadFile,
    changeMode,
} from "./modules/misc";

let settings: Result;
let storagedData: Result;
let jetDate: string;
let code: string;
let gitDate: string;
let hosts: string;
let hostsbak: string;

readSettings((err, result) => {
    if (err) {
        Logger.err(err+'[S-0x0001]');
    }
    else {
        settings = result;
        checkDataAndDir((err_1,result_1) => {
            if (err_1) {
                Logger.err(err_1+'[C-0x0001]');
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
        let $: cheerio.Root = cheerio.load(resp.data);
        jetDate = $("div").eq(2).text().replace(/[^0-9]/ig,"");
        Logger.info("Fetched. \n");
        Logger.info("Checking updates...");
        if (jetDate !== storagedData.codeDate) {
            Logger.upd('Found updates! Downloading...');
            downloadJet();
        }
        else {
            Logger.succ("No available updates. Activation codes are the latest. :)\n");

        }
    }).catch((err): void => Logger.err(err));
}

function downloadJet(): void {
    downloadFile('code.zip','http://idea.medeming.com/jets/images/jihuoma.zip',undefined,err => {
        if (err) {
            Logger.err(err+'[U-0x0001]')
        }
        else {
            changeMode('code.zip',0,err_1 => {
                if (err_1) {
                    Logger.err(err_1+'[U-0x0002]');
                }
                else {
                    Logger.succ('Downloaded.\n');
                    Logger.info('Extracting files...');
                    extractJet();
                }
            });
        }
    });
}

function extractJet(): void {
    const zip: nodeZip = new nodeZip({ file: 'code.zip' });
    const entries = zip.entries();
    zip.on('ready',(): void => {
        Logger.info('Entries found: '+ zip.entriesCount);
        let status: number = 0;
        let fileName: string;
        for (let key in entries) {
            if (entries.hasOwnProperty(key)) {
                Logger.info('|_'+key);
                if (key.match("2018.1")) {
                    fileName = key;
                    status = 1;
                }
            }
        }
        if (status) {
            Logger.info('Codes are available.');
            extract(fileName);
        }
        else {
            Logger.err('Codes are NOT available. Please contact the author to fix this problem. [U-0x0201]');
        }
    });
    zip.on('error',(err): void => Logger.err(err+'[U-0x0202]'));

    function extract(key: string): void {
        code = zip.entryDataSync(key).toString();
        zip.extract(key,'resources/code.txt',(err): void => {
            if (err) {
                Logger.err(err+'[U-0x0203]');
            }
            else {
                zip.close();
                changeMode('resources/code.txt',0,err_1 => {
                    if (err_1) {
                        Logger.err(err_1+'[U-0x0204]');
                    }
                    else {
                        Logger.succ('Extracted.\n');
                        Logger.info(code);
                        Logger.info('Writing data...');
                    }
                });
            }
        });
    }
}