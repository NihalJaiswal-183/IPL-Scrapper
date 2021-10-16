// let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/royal-challengers-bangalore-vs-sunrisers-hyderabad-eliminator-1237178/full-scorecard";
const request = require("request");
const cheerio = require("cheerio");
const { load } = require("cheerio");
const path=require("path");
const fs=require("fs");
const xlsx=require("xlsx");

function getallmatch(url){
request(url, cb);
}
function cb(err, response, html) {
    if (err) {
        console.log(err);
    }
    else {
        extractMatchDetail(html);
    }
}

function extractMatchDetail(html) {
    let $ = cheerio.load(html);
    let desc = $(".event .description").text();
    let result = $(".event .status-text").text();
    desc = desc.split(",");
    let venue = desc[1].trim();
    let date = desc[2].trim();
    let innings = $(".card.content-block.match-scorecard-table .Collapsible");
    let htmlstr="";
    for(let i=0;i<innings.length;i++){
    //  htmlstr+=$(innings[i]).html();
    let teamName=$(innings[i]).find("h5").text().split("INNINGS");
    teamName=teamName[0].trim();
    let opponentNmae="";
    if(i==0){
        opponentNmae=$(innings[1]).find("h5").text().split("INNINGS");
        opponentNmae=opponentNmae[0].trim();
    }
    else{
        opponentNmae=$(innings[0]).find("h5").text().split("INNINGS"); 
        opponentNmae=opponentNmae[0].trim();
    }
    let cInning=$(innings[i]);
    let allRows=cInning.find(".table.batsman tbody tr");
    for(let j=0;j<allRows.length;j++){
        let allCols=$(allRows[j]).find("td");
        let isworthy=$(allCols[0]).hasClass("batsman-cell");
        if(isworthy==true){
            let playerName=$(allCols[0]).text().trim();
            let runs=$(allCols[2]).text().trim();
            let balls=$(allCols[3]).text().trim();
            let fours=$(allCols[5]).text().trim();
            let sixes=$(allCols[6]).text().trim();
            let sr=$(allCols[7]).text().trim();
            // console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
            processPlayer(playerName,runs,balls,fours,sixes,sr,teamName,opponentNmae,venue,date);
        }
        
    }
    }
}
function processPlayer(playerName,runs,balls,fours,sixes,sr,teamName,opponentNmae,venue,date){
  let teampath=path.join(__dirname,"ipl",teamName);
  if(fs.existsSync(teampath)==false)
  fs.mkdirSync(teampath);
  let filepath=path.join(teampath,playerName+ ".xlsx");
  let content=excelReader(filepath,playerName);
  let playerobj={
      teamName,
      playerName,
      runs,
      balls,
      sixes,
      sr,
      opponentNmae,
      venue,
      date
  }
  content.push(playerobj);
  excelwriter(filepath,content,playerName);
}
function excelwriter(filepath,json,sheetName){
    let newWB=xlsx.utils.book_new();
    let newWS=xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB,newWS,sheetName);
    xlsx.writeFile(newWB,filepath);
}

function excelReader(filepath,sheetName){
if(fs.existsSync(filepath)==false)
return [];
let wb=xlsx.readFile(filepath);
let data=wb.Sheets[sheetName];
let ans=xlsx.utils.sheet_to_json(data);
return ans;
}
module.exports={
    ps:getallmatch
}