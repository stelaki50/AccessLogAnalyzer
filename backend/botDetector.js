
import fs from "fs";
import accessLogAnalyzer from "./accessLogAnalyzer.js";



// This function returns the number of total sessions in the log file
function getTotalSessions(sessions){
    return sessions.size;
}

  

// This function identifies all the sesions of the log file
function sessionIdentification(IP, userAgent, fullTimeStamp , statusCode, requestURL){

    // Session identiﬁcation is performed by ﬁrst grouping all HTTP requests that originate 
    // from the same IP address and user-agent
    const sessions = new Map();

    for (let i = 0; i < IP.length; i++) {

       //Extract the features from each log entry
        const ip = IP[i];
        const ua = userAgent[i];
        const url = requestURL[i];
        const status = statusCode[i];
        const timestamp = fullTimeStamp[i];

        // Create a key that identifies a single session
        const key = `${ip}||${ua}`;

        // Create request object (one log entry)
        const request = {
            url,
            status,
            timestamp
        };

        // If session doesn't exist yet, create it
        if (!sessions.has(key)) {
            sessions.set(key, []); //Initialize an empty array
            sessions.get(key).push(request) // Push the first request inside 
        }
        else{
            sessions.get(key).push(request)
        }
        
    }
    return sessions
}

// This function returns the total requests with an empty User Agent String
function getUndefinedUA(userAgent){
    let countEmptyUa = 0;
     for (const ua of userAgent) {
        if (ua === "-") {
            countEmptyUa++;
        }    
    }
    return countEmptyUa
}


// This function returns an arraywith the Ips that requested a robot.txt file
function findRobotTxt(sessions){

    const IpOfRobotTxtRequest = []

        for (const [key, requests] of sessions) {
            // Split the ip from the user Agent to save the Ip later
            const [ip, userAgent] = key.split("||");

            for (const request of requests) {

                const logURL = new URL(request.url, "http://dummy");
                const pathURL = logURL.pathname;

                if (pathURL === "/robots.txt") {
                    // Checking if this ip already exists in the array 
                   if (!IpOfRobotTxtRequest.includes(ip)) {
                        IpOfRobotTxtRequest.push(ip);
                    }

                }
            }   
        }

    return IpOfRobotTxtRequest;
}

// Converts an Apache timestamp like "01/Jun/2025:14:32:11 +0200"
// into a Unix timestamp in milliseconds 
function timeToSeconds(apacheTimestamp) {
  const months = {
    Jan:0, Feb:1, Mar:2, Apr:3, May:4,  Jun:5,
    Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11
  };

  // Match: day / month / year : HH : MM : SS timezone
  const match = apacheTimestamp.match(
    /(\d{2})\/(\w{3})\/(\d{4}):(\d{2}):(\d{2}):(\d{2})\s([+-]\d{4})/
  );

  if (!match) return null;

  const day    = parseInt(match[1]);
  const month  = months[match[2]];
  const year   = parseInt(match[3]);
  const hour   = parseInt(match[4]);
  const minute = parseInt(match[5]);
  const second = parseInt(match[6]);
  const tz     = match[7]; 

  const iso = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}` + `T${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:${String(second).padStart(2,'0')}${tz}`;

  return new Date(iso).getTime()/1000; // milliseconds since epoch
}


// This returns the Top 10 ips with the higher percentage of 4xx error responses
function getPercentageOf4xxResponses(sessions){

    const responses4xxPerIp = new Map();

    for (const [key, requests] of sessions) {
        // Split the ip from the user Agent to save the Ip later
        const [ip, userAgent] = key.split("||");

        let countRequest = 0;
        let countStatusCode4xx = 0;
        let percentageOf4xx =0;

        for (const request of requests) {
            if (request.status >= 400 && request.status < 500) {
                countStatusCode4xx++;
            }

            countRequest++;
        }

        // Calculate the percentage of 4xx error responses for each session
        if(countRequest!==0){
            percentageOf4xx = countStatusCode4xx / countRequest;
        }

        responses4xxPerIp.set(ip,percentageOf4xx);


    }
    return new Map([...responses4xxPerIp.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10));
}


// This returns the Top 10 ips with the lower percentage of image requests
function getPercentageOfImageResponses(sessions){

    const imageResponsesPerIp = new Map();
    for (const [key, requests] of sessions) {
        // Split the ip from the user Agent to save the Ip later
        const [ip, userAgent] = key.split("||");

        let requestCount = 0;
        let imageCount = 0;
        let percentageOfImages =0;
        
        for (const request of requests) {

            const logURL = new URL(request.url, "http://dummy");
            const pathURL = logURL.pathname;

            if (pathURL.endsWith(".jpg") || pathURL.endsWith(".jpeg") || pathURL.endsWith(".gif") || pathURL.endsWith(".png") || pathURL.endsWith(".ico")) {
                imageCount++;
            }

            requestCount++;
        }

        // Calculate the percentage of image requests for each session
        if(requestCount!==0){
            percentageOfImages = imageCount / requestCount;
        }

        imageResponsesPerIp.set(ip,percentageOfImages);


    }

    // Sort by percentage (lowest first) and keep only the first 10
    return new Map([...imageResponsesPerIp.entries()].sort((a, b) => a[1] - b[1]).slice(0, 10));
}


// This returns the Top 10 ips with the higher percentage of pdf/ps requests
function getPercentageOfPdfResponses(sessions){

    const pdfResponsesPerIp = new Map();
    for (const [key, requests] of sessions) {
        // Split the ip from the user Agent to save the Ip later
        const [ip, userAgent] = key.split("||");

        let requestCount = 0;
        let pdfCount = 0;
        let percentageOfpdf =0;
        
        for (const request of requests) {

            const logURL = new URL(request.url, "http://dummy");
            const pathURL = logURL.pathname;

            if (pathURL.endsWith(".pdf") || pathURL.endsWith(".ps")) {
                pdfCount++;
            }

            requestCount++;
        }

        // Calculate the percentage of image requests for each session
        if(requestCount!==0){
            percentageOfpdf = pdfCount / requestCount;
        }

        pdfResponsesPerIp.set(ip,percentageOfpdf);


    }
    return new Map([...pdfResponsesPerIp.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10));

    
    
}

// Returns a map containing the 10 IP addresses with the longest session durations (in seconds)
function getSessionDurations(sessions){

    const ipsDuration = new Map();


        for (const [key, requests] of sessions) {
            // Split the ip from the user Agent to save the Ip later
            const [ip, userAgent] = key.split("||");

        
            const firstTimestamp = requests[0].timestamp;
            const lastTimestamp = requests[requests.length - 1].timestamp;

            // Conver the timestamp to Unix time and subtract to find the duration
            const sessionDurationSeconds = timeToSeconds(lastTimestamp)-timeToSeconds(firstTimestamp);

            ipsDuration.set(ip,sessionDurationSeconds);


        }
        //Return only the 10 ips with the higher duration in seconds
        return new Map([...ipsDuration.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10));

}


// This function returns the total ips with a robot.txt request
function getTotalRobotTxt(requestURL){

    let totalRobotTxtCount = 0; 
    for (const requrl of requestURL){ 

        const logURL = new URL(requrl, "http://dummy");
        const pathURL = logURL.pathname;


        if (pathURL === "/robots.txt") {
            totalRobotTxtCount++;       
        }
    }
    return totalRobotTxtCount;
}


 
function isHtmlRequest(pathURL) {
  const path = pathURL.toLowerCase();
 
  // Extensions that are clearly NOT html — extend this list to
  // match whatever your site actually serves.
  const nonHtmlExtensions = [
    ".xml", ".gz", ".xz", ".whl", ".db", ".sig", ".css", ".js",
    ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".woff",
    ".woff2", ".zip", ".tar", ".iso", ".json", ".txt", ".yaml",
  ];
 
  const hasExcludedExtension = nonHtmlExtensions.some((ext) => path.endsWith(ext));
  if (hasExcludedExtension) return false;
 
  const endsWithSlash = path.endsWith("/");
  const hasHtmlExtension = /\.html?$/.test(path);
  const hasNoExtension = !/\.[a-z0-9]+$/i.test(path);
 
  return endsWithSlash || hasHtmlExtension || hasNoExtension;
}
 
function getClickTimestamps(requests) {
  const clickSeconds = [];
 
  for (const request of requests) {
    const logURL = new URL(request.url, "http://dummy");
    const pathURL = logURL.pathname;
 
    if (isHtmlRequest(pathURL)) {
      const seconds = timeToSeconds(request.timestamp);
      if (seconds !== null) {
        clickSeconds.push(seconds);
      }
    }
  }
 
  // Sessions are usually already in chronological log order, but
  // sort defensively in case requests were merged from elsewhere.
  clickSeconds.sort((a, b) => a - b);
  return clickSeconds;
}
 

function maxSustainedClickRate(clickTimesSeconds, windowSeconds = 12) {
  if (!clickTimesSeconds || clickTimesSeconds.length === 0) {
    return { maxClicks: 0, ratePerSecond: 0, peakStart: null, peakEnd: null };
  }
 
  const queue = []; // indices of clicks currently inside the trailing window
  let maxClicks = 0;
  let bestStart = 0;
  let bestEnd = 0;
 
  for (let i = 0; i < clickTimesSeconds.length; i++) {
    const currentTime = clickTimesSeconds[i];
 
    queue.push(i);
 
    // Evict clicks that fell more than windowSeconds behind current click
    while (currentTime - clickTimesSeconds[queue[0]] >= windowSeconds) {
      queue.shift();
    }
 
    if (queue.length > maxClicks) {
      maxClicks = queue.length;
      bestStart = queue[0];
      bestEnd = i;
    }
  }
 
  return {
    maxClicks,
    ratePerSecond: maxClicks / windowSeconds,
    peakStart: clickTimesSeconds[bestStart], // Unix seconds, start of peak window
    peakEnd: clickTimesSeconds[bestEnd],     // Unix seconds, end of peak window
  };
}
 
function getMaxSustainedClickRatePerIp(sessions, windowSeconds = 12) {
  const ratePerIp = new Map();
 
  for (const [key, requests] of sessions) {
    const [ip] = key.split("||");
 
    const clickTimes = getClickTimestamps(requests);
    const { maxClicks, ratePerSecond, peakStart, peakEnd } = maxSustainedClickRate(clickTimes, windowSeconds);
 
    // Skip sessions with no HTML clicks at all 
    if (maxClicks === 0) continue;
 
    const existing = ratePerIp.get(ip);
    if (!existing || ratePerSecond > existing.ratePerSecond) {
      ratePerIp.set(ip, { maxClicks, ratePerSecond, peakStart, peakEnd, windowSeconds });
    }

  }

  return new Map([...ratePerIp.entries()].sort((a, b) => b[1].ratePerSecond - a[1].ratePerSecond));
}
 
 
 
// This function returns the IPs that have unusual click rate, the ones tha did more than 1 click per second
function getUnusualClickRate(maxSustainedClickRatePerIp){

    const highClickRatePerIp = new Map(); 

    for (const [ip, data] of maxSustainedClickRatePerIp) {

        if( data.ratePerSecond > 1 ){
            highClickRatePerIp.set(ip,data.ratePerSecond)
        }
      
    }

    return highClickRatePerIp;
    
}
 

// This function identifies known crawlers in  User Agent strings and counts how many times each crawler appears
function getKnownCrawlers(userAgents, crawlerRegex) {

  if (!Array.isArray(userAgents)) return {};

  const counts = {};

  userAgents.forEach(userAgent => {
    if (typeof userAgent !== 'string' || !userAgent) return;

    const matches = userAgent.match(crawlerRegex);
    if (!matches) return;

    const uniqueMatches = [...new Set(matches.map(m => m.toLowerCase()))];

    uniqueMatches.forEach(name => {
      counts[name] = (counts[name] || 0) + 1;
    });
  });

  return counts;
}



function getBrowserName(userAgent) {
  if (!userAgent) return "Unknown";
  const ua = userAgent.toLowerCase();

  if (ua.includes("edg/")) return "Edge";
  if (ua.includes("opr/") || ua.includes("opera")) return "Opera";
  if (ua.includes("samsungbrowser")) return "Samsung Internet";
  if (ua.includes("crios")) return "Chrome (iOS)";
  if (ua.includes("fxios")) return "Firefox (iOS)";
  if (ua.includes("chrome") && !ua.includes("chromium")) return "Chrome";
  if (ua.includes("chromium")) return "Chromium";
  if (ua.includes("firefox")) return "Firefox";
  if (ua.includes("msie") || ua.includes("trident")) return "Internet Explorer";
  if (ua.includes("safari") && !ua.includes("chrome") && !ua.includes("crios")) return "Safari";

  return "Other/Unknown";
}

// This fucntion returns the browsers and how many times appear in the log file
function getBrowserDistribution(userAgent) {
  const counts = {};

  for (const ua of userAgent) {
    const browser = getBrowserName(ua);
    counts[browser] = (counts[browser] || 0) + 1;
  }

  return counts;
}


function botDetector(accessLogData) {

    const { ipAddresses, userAgent, statusCode,responseSize, requestTarget, fullTimeStamp } = accessLogData;

    const sessions = sessionIdentification(ipAddresses, userAgent, fullTimeStamp, statusCode, requestTarget);
    const sessionDurationPerIp   = getSessionDurations(sessions);
    const percentageOf4xxPerIp   = getPercentageOf4xxResponses(sessions);
    const percentageOfImagePerIp = getPercentageOfImageResponses(sessions);
    const percentageOfPdfPerIp   = getPercentageOfPdfResponses(sessions);
    const ipHasRobotTxt = findRobotTxt(sessions);
    const totalSessions = getTotalSessions(sessions);
    const emptyUaCount = getUndefinedUA(userAgent);
    const totalRobotTxt = getTotalRobotTxt(requestTarget);
    const browserDistirbution = getBrowserDistribution(userAgent);
    const maxSustainedClickRatePerIp = getMaxSustainedClickRatePerIp(sessions, 12);
    const highClickRatePerIp = getUnusualClickRate(maxSustainedClickRatePerIp);

    // Regex for Known Search Engine Crawlers 
    const SearchEngineRegex = /Googlebot(-Image|-News|-Video)?|Mediapartners-Google|AdsBot-Google|Google-Extended|bingbot|adidxbot|Slurp|YandexBot|Baiduspider|DuckDuckBot|Sogou|Yeti|SeznamBot|coccoc|PetalBot|Mail\.RU_Bot|Qwantify|Teoma|Exabot|ia_archiver|Gigabot/gi;
    const AICrawlerRegex = /GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-User|PerplexityBot|CCBot|Meta-ExternalAgent/gi;
    const generalCrawlersRegex =   /facebookexternalhit|FacebookBot|Twitterbot|LinkedInBot|Slackbot|Discordbot|TelegramBot|WhatsApp|Pinterestbot|Applebot|AhrefsBot|SemrushBot|MJ12bot|DotBot|BLEXBot|Bytespider|DataForSeoBot|SiteAuditBot|UptimeRobot|Pingdom|StatusCake|ArchiveBot|Wayback|curl|Wget|python-requests|axios|PostmanRuntime/gi;

    const searchEngineCrawlers = getKnownCrawlers(userAgent, SearchEngineRegex);
    const aICrawlers = getKnownCrawlers(userAgent, AICrawlerRegex);
    const generalCrawlers = getKnownCrawlers(userAgent,generalCrawlersRegex);


    return {
        sessionDurationPerIp,
        percentageOf4xxPerIp,
        percentageOfImagePerIp,
        percentageOfPdfPerIp,
        ipHasRobotTxt,
        totalSessions,
        emptyUaCount,
        totalRobotTxt,
        highClickRatePerIp,
        searchEngineCrawlers,
        aICrawlers,
        generalCrawlers,
        browserDistirbution,
       
    };
}

export default botDetector;