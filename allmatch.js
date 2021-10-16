const request = require("request");
const cheerio = require("cheerio");
const linkobj=require("./scorecard");

function getAllMatches(fulllink){
    request(fulllink,(err, response, html)=>{
        if (err) {
            console.log(err);
        }
        else {
            let $ = cheerio.load(html);
            let anchorElm=$("a[data-hover= 'Scorecard']");
            for(let i=0;i<anchorElm.length;i++){
            let link="https://www.espncricinfo.com"+$(anchorElm[i]).attr("href");
            // console.log(link);
            linkobj.ps(link);
            }
        }
    });
}

module.exports={
    geAlmatches:getAllMatches
}