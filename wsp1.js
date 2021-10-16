let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const request = require("request");
const cheerio = require("cheerio"); 
const { load } = require("cheerio");
const fs=require("fs");
const path=require("path");
const ipl=path.join(__dirname,"ipl");
dirCreator(ipl);
request(url, cb);
const Allmatchobj=require("./allmatch");
const { Console } = require("console");
function cb(err, response, html) {
    if (err) {
        console.log(err);
    }
    else {
        extractHTML(html);
    }
}

function extractHTML(html) {
    let $ = cheerio.load(html);
    let anchorElm=$("a[data-hover= 'View All Results']");
    let link=anchorElm.attr("href");
    let fulllink="https://www.espncricinfo.com"+link;
    Allmatchobj.geAlmatches(fulllink);
}

function dirCreator(filepath){
    if(fs.existsSync(filepath)==false)
    fs.mkdirSync(filepath);
   
}
