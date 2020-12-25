"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const cheerio = require("cheerio");
const nodeZip = require("node-stream-zip");
const settings_1 = require("./modules/settings");
const fileChecker_1 = require("./modules/fileChecker");
const misc_1 = require("./modules/misc");
let settings;
let storagedData;
let jetDate;
let code;
let gitDate;
let hosts;
let hostsbak;
settings_1.checkFile((err, result) => {
    if (err) {
        misc_1.Logger.err(err + '[S-0x0001]');
    }
    else {
        settings = result;
        fileChecker_1.checker((err_1, result_1) => {
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
        let $ = cheerio.load(resp.data);
        jetDate = $("div").eq(2).text().replace(/[^0-9]/ig, "");
        misc_1.Logger.info("Fetched. \n");
        misc_1.Logger.info("Checking updates...");
        if (jetDate !== storagedData.codeDate) {
            misc_1.Logger.upd('Found updates! Downloading...');
            downloadJet();
        }
        else {
            misc_1.Logger.succ("No available updates. Activation codes are the latest. :)\n");
        }
    }).catch((err) => misc_1.Logger.err(err));
}
function downloadJet() {
    misc_1.downloadFile('code.zip', 'http://idea.medeming.com/jets/images/jihuoma.zip', undefined, err => {
        if (err) {
            misc_1.Logger.err(err + '[U-0x0001]');
        }
        else {
            misc_1.changeMode('code.zip', 0, err_1 => {
                if (err_1) {
                    misc_1.Logger.err(err_1 + '[U-0x0002]');
                }
                else {
                    misc_1.Logger.succ('Downloaded.\n');
                    misc_1.Logger.info('Extracting files...');
                    extractJet();
                }
            });
        }
    });
}
function extractJet() {
    const zip = new nodeZip({ file: 'code.zip' });
    const entries = zip.entries();
    zip.on('ready', () => {
        misc_1.Logger.info('Entries found: ' + zip.entriesCount);
        let status = 0;
        let fileName;
        for (let key in entries) {
            if (entries.hasOwnProperty(key)) {
                misc_1.Logger.info('|_' + key);
                if (key.match("2018.1")) {
                    fileName = key;
                    status = 1;
                }
            }
        }
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
        code = zip.entryDataSync(key).toString();
        zip.extract(key, 'resources/code.txt', (err) => {
            if (err) {
                misc_1.Logger.err(err + '[U-0x0203]');
            }
            else {
                zip.close();
                misc_1.changeMode('resources/code.txt', 0, err_1 => {
                    if (err_1) {
                        misc_1.Logger.err(err_1 + '[U-0x0204]');
                    }
                    else {
                        misc_1.Logger.succ('Extracted.\n');
                        misc_1.Logger.info(code);
                        misc_1.Logger.info('Writing data...');
                    }
                });
            }
        });
    }
}
