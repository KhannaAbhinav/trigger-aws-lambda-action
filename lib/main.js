"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const _ = __importStar(require("underscore"));
const promise_1 = __importDefault(require("simple-git/promise"));
const ignoredDirectoryList = ['.git', '.github'];
function getFileList(directory, fileFilter, recursive, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const childList = fs.readdirSync(directory).filter(file => file.match(fileFilter));
        for (const child of childList) {
            const childPath = path.join(directory, child);
            if (fs.statSync(childPath).isFile() || !ignoredDirectoryList.includes(child))
                fs.statSync(childPath).isDirectory() && recursive
                    ? yield getFileList(childPath, fileFilter, recursive, callback)
                    : yield callback(childPath);
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const folderPath = core.getInput('Path');
            const filter = new RegExp(core.getInput('Filter'));
            const recurse = new Boolean(core.getInput('Recurse'));
            const top = parseInt(core.getInput('Top'));
            const bottom = parseInt(core.getInput('Bottom'));
            const outputToConsole = new Boolean(core.getInput('OutputFormat'));
            console.debug(`Path :  ${folderPath}`);
            console.debug(`Filter :  ${filter}`);
            console.debug(`Recurse :  ${recurse}`);
            console.debug(`Top :  ${top}`);
            console.debug(`Bottom :  ${bottom}`);
            const simpleGit = promise_1.default(process.cwd());
            console.debug(`CWD : ${process.cwd()}`);
            let leaderBoardOutput = [];
            yield getFileList(folderPath, filter, recurse, function (filePath) {
                return __awaiter(this, void 0, void 0, function* () {
                    const logOptions = { splitter: '||||', file: filePath };
                    const logSummary = yield simpleGit.log(logOptions);
                    const leaderBoardFile = {
                        filePath,
                        commitCount: logSummary.total
                    };
                    leaderBoardOutput.push(leaderBoardFile);
                });
            });
            leaderBoardOutput = _.sortBy(leaderBoardOutput, 'commitCount').reverse();
            if (top > 0) {
                leaderBoardOutput = leaderBoardOutput.slice(0, top);
            }
            else if (bottom > 0) {
                leaderBoardOutput = leaderBoardOutput.slice(leaderBoardOutput.length - bottom, leaderBoardOutput.length);
            }
            if (outputToConsole) {
                console.info('File Path\tCommit Count');
                leaderBoardOutput.forEach(file => console.log(`${file.filePath}\t${file.commitCount}`));
            }
            core.setOutput('leaderBoardOutput', JSON.stringify(leaderBoardOutput));
        }
        catch (error) {
            console.log(error);
            core.setFailed(error.message);
        }
    });
}
main();
