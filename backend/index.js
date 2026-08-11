/*
  Express Server Entry Point
  This server provides API endpoints for log analysis data.
*/
import logAnalyzer from "./accessLogAnalyzer.js";
import botDetector from "./botDetector.js";
import securityAnalysis from "./SecurityAnalysis.js";

import express from "express"
import multer from "multer";
import cors from "cors";

const upload = multer();
let AccessLogData = null; 
let BotData = null;
let securityData = null;


const app = express()
app.use(cors());


app.post("/api/upload", upload.single("logfile"), (req, res) => {

    try {

        // Check if file exists
        if (!req.file) {
            return res.status(400).json({
                error: "No file uploaded"
            });
        }

        // Convert file buffer to string
        const fileContent = req.file.buffer.toString("utf8");

        // Analyze log file
        AccessLogData = logAnalyzer(fileContent);
        BotData = botDetector(AccessLogData);
        securityData = securityAnalysis(AccessLogData);

       
        console.log("File processed successfully");

        res.json({
            success: true,
            message: "File processed successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to process file"
        });
    }
});
app.get("/",(req,res) => {
    res.send("server is alive")
})

const port =  process.env.PORT || 5000

//Return country-per-IP 
app.get("/api/accessLogAnalyzer/mostFrequentCountries",(req,res)=>{

    if(!AccessLogData){
        return res.status(400).json({
        error: "No log file uploaded yet"
    });
    }

    res.json(AccessLogData.mostFrequentCountries);
})


//Return the ipAddresses
app.get("/api/accessLogAnalyzer/ipAddresses",(req,res)=>{

    if(!AccessLogData){
        return res.status(400).json({
        error: "No log file uploaded yet"
    });
    }

    res.json(AccessLogData.ipAddresses);

})

//Return the 10 most frequent ip addresses
app.get("/api/accessLogAnalyzer/mostCommonIps",(req,res)=>{
   
      if(!AccessLogData){
        return res.status(400).json({
        error: "No log file uploaded yet"
        });
    }

    res.json(AccessLogData.mostCommonIps);


})


//Return the total lines on log entries
app.get("/api/accessLogAnalyzer/totalLogEntries", (req,res)=>{

    if(!AccessLogData){
        return res.status(400).json({
        error: "No log file uploaded yet"
        });
    }

    res.json(AccessLogData.totalLogEntries);
})

//Returns the distirbution of status code per minute
app.get("/api/accessLogAnalyzer/StatusCodesPerMinute", (req,res)=>{
    if(!AccessLogData){
        return res.status(400).json({
        error: "No log file uploaded yet"
        });
    }

   res.json(Object.fromEntries(AccessLogData.StatusCodesPerMinute));
    
})


//Returns the number of status codes grouped by their class type
app.get("/api/accessLogAnalyzer/statusCodeCount", (req,res)=>{
    
    if(!AccessLogData){
        return res.status(400).json({
        error: "No log file uploaded yet"
        });
    }

    res.json(AccessLogData.statusCodeCount);
})

//Returns the number of unique Ips
app.get("/api/accessLogAnalyzer/uniqueIpsCount", (req,res)=>{
  
    if(!AccessLogData){
        return res.status(400).json({
        error: "No log file uploaded yet"
        });
    }

    res.json(AccessLogData.uniqueIpsCount);
})

//Returns the number of http Methods
app.get("/api/accessLogAnalyzer/httpMethodCount", (req,res)=>{

    if(!AccessLogData){
        return res.status(400).json({
        error: "No log file uploaded yet"
        });
    }

    res.json(AccessLogData.httpMethodCount);
})


//Returns the Requests per minute
app.get("/api/accessLogAnalyzer/RequestPerMinute", (req,res)=>{
  
    if(!AccessLogData){
        return res.status(400).json({
        error: "No log file uploaded yet"
        });
    }
    res.json(Array.from(AccessLogData.RequestPerMinute.entries()));

})


//Returns the County Count
app.get("/api/accessLogAnalyzer/CountryCount", (req,res)=>{

    if(!AccessLogData){
        return res.status(400).json({
        error: "No log file uploaded yet"
        });
    }

    res.json(Object.fromEntries(AccessLogData.CountryCount));
})


// Bot Data /// 

app.get("/api/botDetector/sessionDurationPerIp", (req, res) => {
    if (!BotData) {
        return res.status(400).json({ error: "No log file uploaded yet" });
    }
    res.json(Object.fromEntries(BotData.sessionDurationPerIp));
});


app.get("/api/botDetector/percentageOf4xxPerIp", (req, res) => {
    if (!BotData) {
        return res.status(400).json({ error: "No log file uploaded yet" });
    }
    res.json(Object.fromEntries(BotData.percentageOf4xxPerIp));
});

app.get("/api/botDetector/percentageOfPdfPerIp", (req, res) => {

    if (!BotData) {
        return res.status(400).json({ error: "No log file uploaded yet" });
    }
    res.json(Object.fromEntries(BotData.percentageOfPdfPerIp));
});


app.get("/api/botDetector/percentageOfImagePerIp", (req, res) => {

    if (!BotData) {
        return res.status(400).json({ error: "No log file uploaded yet" });
    }
    res.json(Object.fromEntries(BotData.percentageOfImagePerIp));


});



app.get("/api/botDetector/ipHasRobotTxt", (req, res) => {

    if (!BotData) {
        return res.status(400).json({ error: "No log file uploaded yet" });
    }
    res.json(BotData.ipHasRobotTxt);


});


app.get("/api/botDetector/totalSessions", (req, res) => {

    if (!BotData) {
        return res.status(400).json({ error: "No log file uploaded yet" });
    }
    res.json(BotData.totalSessions);


});



app.get("/api/botDetector/emptyUaCount", (req, res) => {

    if (!BotData) {
        return res.status(400).json({ error: "No log file uploaded yet" });
    }
    res.json(BotData.emptyUaCount);


});


app.get("/api/botDetector/totalRobotTxt", (req, res) => {

    if (!BotData) {
        return res.status(400).json({ error: "No log file uploaded yet" });
    }
    res.json(BotData.totalRobotTxt);


});



app.get("/api/botDetector/highClickRatePerIp", (req, res) => {

    if (!BotData) {
        return res.status(400).json({ error: "No log file uploaded yet" });
    }

    res.json(BotData.highClickRatePerIp);

});




app.get("/api/botDetector/searchEngineCrawlers", (req, res) => {

    if (!BotData) {
        return res.status(400).json({ error: "No log file uploaded yet" });
    }
        res.json(BotData.searchEngineCrawlers);
});





app.get("/api/botDetector/aICrawlers", (req, res) => {

    if (!BotData) {
        return res.status(400).json({ error: "No log file uploaded yet" });
    }
        res.json(BotData.aICrawlers);
});




app.get("/api/botDetector/generalCrawlers", (req, res) => {

    if (!BotData) {
        return res.status(400).json({ error: "No log file uploaded yet" });
    }
        res.json(BotData.generalCrawlers);
});



app.get("/api/botDetector/browserDistirbution", (req, res) => {

    if (!BotData) {
        return res.status(400).json({ error: "No log file uploaded yet" });
    }
        res.json(BotData.browserDistirbution);
});




app.get("/api/securityAnalysis/successfulRequests", (req, res) => {

    if (!securityData) {
        return res.status(400).json({ error: "No log file uploaded yet" });
    }
    res.json(securityData.successfulRequests);


});






app.get("/api/securityAnalysis/uniqueIpCount", (req, res) => {

    if (!securityData) {
        return res.status(400).json({ error: "No log file uploaded yet" });
    }
    res.json(securityData.uniqueIpCount);


});




app.get("/api/securityAnalysis/httpMethodsCount", (req, res) => {

    if (!securityData) {
        return res.status(400).json({ error: "No log file uploaded yet" });
    }
    res.json(securityData.httpMethodsCount);

});



app.get("/api/securityAnalysis/topEndpoints", (req, res) => {

    if (!securityData) {
        return res.status(400).json({ error: "No log file uploaded yet" });
    }
    res.json(securityData.topEndpoints);

});





app.get("/api/securityAnalysis/topReferers", (req, res) => {

    if (!securityData) {
        return res.status(400).json({ error: "No log file uploaded yet" });
    }
    res.json(securityData.topReferers);
});





app.get("/api/securityAnalysis/hourlyActivity", (req, res) => {

    if (!securityData) {
        return res.status(400).json({ error: "No log file uploaded yet" });
    }
  
    res.json(Array.from(securityData.hourlyActivity.entries()));
});






app.get("/api/securityAnalysis/errorPattern", (req, res) => {

    if (!securityData) {
        return res.status(400).json({ error: "No log file uploaded yet" });
    }
  
    res.json(securityData.errorPattern);
});




app.get("/api/securityAnalysis/statusCodeDistribution", (req, res) => {

    if (!securityData) {
        return res.status(400).json({ error: "No log file uploaded yet" });
    }
        res.json(Object.fromEntries(securityData.statusCodeDistribution));
});


app.get("/api/securityAnalysis/totalBandwidth", (req, res) => {

    if (!securityData) {
        return res.status(400).json({ error: "No log file uploaded yet" });
    }
    res.json(securityData.totalBandwidth);

});

app.get("/api/securityAnalysis/averageResponseSize", (req, res) => {

    if (!securityData) {
        return res.status(400).json({ error: "No log file uploaded yet" });
    }
    res.json(securityData.averageResponseSize);

});




// Start the server and listen for incoming requests
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`)
  })

