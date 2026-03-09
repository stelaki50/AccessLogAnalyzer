import fs from "fs";
import geoip from "geoip-lite";

//Returns the corresponding country for each IP Address
function getCountry(ipAddresses) {
    const countryPerIp = new Map();

    ipAddresses.forEach(ip => {
        const geo = geoip.lookup(ip);
        const country = geo ? geo.country : 'Unknown';
        countryPerIp.set(ip, country);
    });

   
    return Object.fromEntries(countryPerIp);
}

//Returns how many requests come from each country
function getCountryCount(ipAddresses){

    const countryCount = new Map();
    ipAddresses.forEach(ip => {
        const geo = geoip.lookup(ip);
        const country = geo ? geo.country : 'Unknown';
        if (countryCount.has(country)) {
            countryCount.set(country, countryCount.get(country) + 1);
        } else {
            countryCount.set(country, 1);
        }    
    });

    return countryCount
   

}

//This function returns the number of unique ips Addresses
function getUniqueIps(ipAddresses){

    let uniqueIps = []

    for(let i=0; i < ipAddresses.length; i++){
        if(!uniqueIps.includes(ipAddresses[i])){
            uniqueIps.push(ipAddresses[i]);
        }
    }
    return uniqueIps
  
}

//Returns how many times each HTTP method appears
function getHttpMethodCount(httpMethod){
    let methodCount = { GET:0 , POST:0, PUT:0, DELETE:0 ,PATCH :0, HEAD:0 , OPTIONS:0 , TRACE:0, CONNECT:0 }

    for (let i=0 ; i < httpMethod.length; i++){
        if (Object.hasOwn(methodCount, httpMethod[i])){
            methodCount[httpMethod[i]]++;
        }       
    }

    return methodCount;
}

//This function returns the 10 most frequent countries 
function countCountries(countries){

    const countryCount = {};

    for (const country of Object.values(countries)){

        if (countryCount[country] !== undefined) {
            countryCount[country] = countryCount[country] + 1;
        }
        else {
            countryCount[country] = 1;
        }

    }

    const top10Countries = Object.entries(countryCount)
    .sort((a, b) => b[1] - a[1]) // descending by count
    .slice(0, 10);

    return top10Countries;

}

//This function returns the number of requests per minutes 
function getRequestPerMinutes(method,time){
    const RequestPerMinutes = new Map();
 
    for (const t of time) {
        // Normalize timestamp to "HH:MM"
        const minute = t.slice(0, 5);   

        if (method[t] === null) continue;
        // Increment count for this minute
        RequestPerMinutes.set(minute, (RequestPerMinutes.get(minute) || 0) + 1);
    }

    
    return RequestPerMinutes
}


//This function counts the number of different status codes
function getStatusCodeCount(statusCode){

    var codeCount = {"2xx": 0,"3xx": 0,"4xx": 0,"5xx": 0};

    for (let i = 0; i < statusCode.length; i++) {

        let code = statusCode[i]; //Extract the status code 
        let firstNumber = code[0]; //Check only for the first number 

        if (firstNumber === "2") {
            codeCount["2xx"]++;
        } 
        else if (firstNumber === "3") {
            codeCount["3xx"]++;
        } 
        else if (firstNumber === "4") {
            codeCount["4xx"]++;
        } 
        else if (firstNumber === "5") {
            codeCount["5xx"]++;
        }

    }

    return codeCount
    
}

//Returns distribution of status codes per minute
function getStatusCodesPerMinute(statusCode, time) {

    const tempStorage = new Map();

    // First group by minute
    for (let i = 0; i < time.length; i++) {

        const minuteKey = time[i].split(':').slice(0, 2).join(':');
        const code = statusCode[i];

        if (!tempStorage.has(minuteKey)) {
            tempStorage.set(minuteKey, {
                sampleTimestamp: time[i],
                statusCodes: []
            });
        }

        tempStorage.get(minuteKey).statusCodes.push(code);
    }

    const finalMap = new Map();

    for (let [, data] of tempStorage) {

        const distribution = getStatusCodeCount(data.statusCodes);

        finalMap.set(data.sampleTimestamp, distribution);
    }

    return finalMap;
}

//Returns the 10 most frequent IP addresses along with their occurrence counts
function getMostCommonIps(ipAddress){

    const frequencyOfIps = new Map();

          //First we will find the frequency of occurrence of each Ip Address
          for(let i=0; i<ipAddress.length; i++){

            let count = 0;
            const max = ipAddress[i];
            for(const ip  of ipAddress){
                if( max === ip){
                    count++;
                }
            }
            frequencyOfIps.set(max, count); 
        }

    
    //Convert the map to an array so that it can be sorted.
    const entriesArray = Array.from(frequencyOfIps.entries());

    //Sort the array by frequency (descending)
    entriesArray.sort(function (a,b) {
        return b[1] - a[1];
    });

    //Take the first 10 elements witch are the 10 most frequent ip addresses
    const top10Ips = entriesArray.slice(0, 10);

    //Return the 2d array that holds the top 10 most frequent ips
    return top10Ips
}


// Read entire file synchronously
const data = fs.readFileSync("1.log", "utf8");

// Split file into lines
const lines = data.split(/\r?\n/);

//The regular expression to match the Combined Log Format
const regex = /^(\S+) (\S+) (\S+) \[(\d{2}\/[A-Za-z]{3}\/\d{4}):(\d{2}:\d{2}:\d{2}) ([+-]\d{4})] "(?:(\S+) (\S+) (\S+)|-)" (\d{3}) (\S+) "([^"]*)" "([^"]*)"/;

//Collecting the information of the log file and group them 
const logInformation = [];
let TotalLines = 0;
for (const line of lines) {
    if (!line.trim())  continue; // skip empty lines

    const results = line.match(regex); 
    if (!results) {
        console.warn(`Line did not match regex: ${line}`);
        continue; 
    }

    //Destructure matched log components
    const [_, ipAddress, remoteLogname , user , date , time , timezone , method , requestTarget, httpVersion, statusCode ,responseSize, referer , userAgent] = results;
    // Store parsed log data
    logInformation.push({ipAddress,remoteLogname,user,date,time,timezone, method , requestTarget ,httpVersion, statusCode,responseSize,referer,userAgent});
    TotalLines++;
}


//Extract the information from parsed logs
const ipAddresses = logInformation.map(entry => entry.ipAddress); 
const remoteLogname = logInformation.map(entry => entry.remoteLogname); 
const user = logInformation.map(entry => entry.user); 
const time = logInformation.map(entry => entry.time);
const timezone = logInformation.map(entry => entry.timezone);
const httpMethod = logInformation.map(entry => entry.method);
const requestTarget = logInformation.map(entry => entry.requestTarget);
const httpVersion  = logInformation.map(entry => entry.httpVersion);
const statusCode = logInformation.map(entry => entry.statusCode);
const responseSize = logInformation.map(entry => entry.responseSize);
const referer =  logInformation.map(entry => entry.referer);
const userAgent =  logInformation.map(entry => entry.userAgent);

// Total log entries
const totalLogEntries = TotalLines;

//Calculate analytics
const mostCommonIps = getMostCommonIps(ipAddresses); //10 most common IPs in the log

const countries = getCountry(ipAddresses);

const uniqueIpsCount = getUniqueIps(ipAddresses).length; //The count of unique ips in the log

const httpMethodCount = getHttpMethodCount(httpMethod)

const mostFrequentCountries = countCountries(countries); 

const statusCodeCount = getStatusCodeCount(statusCode);

const StatusCodesPerMinute = getStatusCodesPerMinute(statusCode,time)

const RequestPerMinute = getRequestPerMinutes(httpMethod,time)

const CountryCount = getCountryCount(ipAddresses)

//Export analytics results
export default {ipAddresses, mostFrequentCountries, mostCommonIps,totalLogEntries, StatusCodesPerMinute, statusCodeCount, uniqueIpsCount, httpMethodCount,
RequestPerMinute, CountryCount, };