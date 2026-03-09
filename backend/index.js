/*
  Express Server Entry Point
  This server provides API endpoints for log analysis data.
*/
import logAnalyzer from "./accessLogAnalyzer.js";
import express from "express"
import cors from "cors";

const { ipAddresses, mostFrequentCountries, mostCommonIps,totalLogEntries, StatusCodesPerMinute, statusCodeCount,uniqueIpsCount,httpMethodCount,
RequestPerMinute,CountryCount } = logAnalyzer;

const app = express()
app.use(cors());

app.get("/",(req,res) => {
    res.send("server is alive")
})

const port =  process.env.PORT || 5000

//Return country-per-IP 
app.get("/api/accessLogAnalyzer/mostFrequentCountries",(req,res)=>{
    res.json(mostFrequentCountries)
})


//Return the ipAddresses
app.get("/api/accessLogAnalyzer/ipAddresses",(req,res)=>{
    res.json(ipAddresses)
})

//Return the 10 most frequent ip addresses
app.get("/api/accessLogAnalyzer/mostCommonIps",(req,res)=>{
   
    res.send(mostCommonIps)
})


//Return the total lines on log entries
app.get("/api/accessLogAnalyzer/logEntries", (req,res)=>{
    res.json(totalLogEntries)
})

//Returns the distirbution of status code per minute
app.get("/api/accessLogAnalyzer/StatusCodesPerMinute", (req,res)=>{
    res.json(Object.fromEntries(StatusCodesPerMinute))
})


//Returns the number of status codes grouped by their class type
app.get("/api/accessLogAnalyzer/statusCodeCount", (req,res)=>{
    res.json(statusCodeCount)
})

//Returns the number of unique Ips
app.get("/api/accessLogAnalyzer/uniqueIpsCount", (req,res)=>{
    res.json(uniqueIpsCount)
})

//Returns the number of http Methods
app.get("/api/accessLogAnalyzer/httpMethodCount", (req,res)=>{
    res.json(httpMethodCount)
})


//Returns the Requests per minute
app.get("/api/accessLogAnalyzer/RequestPerMinute", (req,res)=>{
    res.json(Array.from(RequestPerMinute.entries()));

})


//Returns the County Count
app.get("/api/accessLogAnalyzer/CountryCount", (req,res)=>{
    res.json(Object.fromEntries(CountryCount));
})

// Start the server and listen for incoming requests
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`)
  })

