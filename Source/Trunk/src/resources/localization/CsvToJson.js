"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
(function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let s = ',';
        let fs = require('fs');
        let resources = [];
        let data = fs.readFileSync(path.join(__dirname, 'locals', 'language.csv')).toString();
        let lines;
        if (data.indexOf('\r\n') > -1) {
            lines = data.split('\r\n');
        }
        else {
            lines = data.split('\n');
        }
        let resourceData = {};
        let columns = lines[0].split(s);
        for (let ii = 3; ii < columns.length; ii++) {
            resources.push(columns[ii]);
        }
        for (let lang of resources) {
            resourceData[lang] = {};
        }
        for (let ii = 1; ii < lines.length; ii++) {
            let data = lines[ii].split(s);
            let scene = data[0].trim();
            let sceneKey = data[1].trim();
            for (let langIndex in resources) {
                let index = parseInt(langIndex);
                let lang = resources[index];
                if (resourceData[lang][scene] == undefined) {
                    resourceData[lang][scene] = {};
                }
                resourceData[lang][scene][sceneKey] = data[3 + index].trim();
            }
        }
        for (let langKey in resourceData) {
            let content = JSON.stringify(resourceData[langKey], null, 4);
            fs.writeFileSync(path.join(__dirname, 'locals', langKey, langKey + ".json"), content);
        }
    });
})();
//# sourceMappingURL=CsvToJson.js.map