
import accessLogAnalyzer from "./accessLogAnalyzer.js";

// This function returns the count of all the HTTP Methods in the log file  
function getHttpMethodsCount(httpMethod){

   const methodCount = {};

    for (const method of httpMethod) {
        if (methodCount[method]) {
            methodCount[method]++;
        } else {
            methodCount[method] = 1;
        }
    }

    return methodCount;

}

// This function returns the number of successful requests on the log file
function getSuccessfulRequests(statusCodes) {
    let successfulRequests = 0;

    for (const statusCode of statusCodes) {
        const code = Number(statusCode);

        if (code >= 200 && code < 300) {
            successfulRequests++;
        }
    }

    if (statusCodes.length === 0) {
        return 0;
    }

    return Number(
        ((successfulRequests / statusCodes.length) * 100).toFixed(2)
    );
}


//This function returns an array with the unique ips in the log file
function getUniqueIps(ipAddresses){

    let uniqueIps = []

    for(let i=0; i < ipAddresses.length; i++){
        if(!uniqueIps.includes(ipAddresses[i])){
            uniqueIps.push(ipAddresses[i]);
        }
    }
    return uniqueIps
  
}

//This function returns the number of unique ips Addresses
function getUniqueIpsCount(ipAddresses) {
    return new Set(ipAddresses).size;
}

// This function returns a Map with the percentage distribution of HTTP status codes grouped by class (2xx, 3xx, 4xx, 5xx)
function getStatusCodeDistirbution(statusCode){


    const statusCodeDistribution = new Map();
    let code2xxCount = 0;
    let code3xxCount = 0;
    let code4xxCount = 0;
    let code5xxCount = 0;

    for (const rawCode of statusCode) {
        const code = Number(rawCode);

        if (code >= 200 && code < 300) {
            code2xxCount++;
        }
        else if (code >= 300 && code < 400) {
            code3xxCount++;
        }
        else if (code >= 400 && code < 500) {
            code4xxCount++;
        }
        else {
            code5xxCount++;
        }
    }
    
    const total = statusCode.length;
    const toPercent = (count) => total > 0 ? Number(((count / total) * 100).toFixed(2)) : 0;
    statusCodeDistribution.set("2xx", toPercent(code2xxCount));
    statusCodeDistribution.set("3xx", toPercent(code3xxCount));
    statusCodeDistribution.set("4xx", toPercent(code4xxCount));
    statusCodeDistribution.set("5xx", toPercent(code5xxCount));

    return statusCodeDistribution;
}


function getTopEndpoints(urls, topLimit = 10, maxLength = 70) {
  const urlCounts = {};

  for (const url of urls) {
    //Ignore empty or missing URLs
    if (!url) continue;

    urlCounts[url] = (urlCounts[url] || 0) + 1;
  }

  // Convert the object into an array, sort it, and keep the top results
  const topEndpoints = Object.entries(urlCounts).sort(([, countA], [, countB]) => countB - countA).slice(0, topLimit)
    .map(([url, count]) => ({
      url: shortenUrl(url, maxLength),
      count,
    }));

  return topEndpoints;
}


function shortenUrl(url, maxLength = 70) {
  // Do not shorten URLs that are already small enough
  if (url.length <= maxLength) {
    return url;
  }

  const remainingLength = maxLength - 3;

  // Keep approximately half from the beginning
  const startLength = Math.ceil(remainingLength / 2);

  const endLength = Math.floor(remainingLength / 2);

  return (url.slice(0, startLength) + "..." + url.slice(-endLength));
}

function getTopReferers(referers, topN = 10) {
  const counts = new Map();

  for (const ref of referers) {
    if (!ref || ref === '-') continue; // skip "no referer" entries

    let domain;
    try {
      domain = new URL(ref).hostname;  
    } catch (err) {
      continue; // skip malformed URLs
    }

    const normalized = domain.replace(/^www\./, '');

    counts.set(normalized, (counts.get(normalized) || 0) + 1);
  }

  // sort descending by count, return top N
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([domain, count]) => ({ domain, count }));
}

// This function returns a Map with the count of requests grouped by hour of day (0-23).
// Activity from different days is merged into the same hour bucket 
function getHourlyActivity(times) {

    const hourlyActivity = new Map();

    for (let hour = 0; hour < 24; hour++) {
        hourlyActivity.set(hour, 0);
    }

    for (const time of times) {
        if (!time) continue;

        const hour = parseInt(time.split(':')[0], 10);

        if (isNaN(hour) || hour < 0 || hour > 23) continue;

        hourlyActivity.set(hour, hourlyActivity.get(hour) + 1);
    }

    return hourlyActivity;
}


function getErrorPatterns(urls, statusCodes, topLimit = 10, maxLength = 70) {
  const errorCounts = {};

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const status = statusCodes[i];

    // Ignore empty/missing URLs or missing status codes
    if (!url || !status) continue;

    // Only count 4xx status codes (400-499)
    if (status < 400 || status >= 500) continue;

    errorCounts[url] = (errorCounts[url] || 0) + 1;
  }

  const errorPatterns = Object.entries(errorCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, topLimit)
    .map(([url, count]) => ({
      url: shortenUrl(url, maxLength),
      count,
    }));

  return errorPatterns;
}


function formatBytes(bytes) {
    if (!bytes || bytes === 0) return "0 B";

    const units = ["B", "KB", "MB", "GB", "TB"];
    let value = bytes;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex++;
    }

    return `${value.toFixed(2)} ${units[unitIndex]}`;
}

function getAverageResponseSize(responseSize) {
    if (!responseSize || responseSize.length === 0) {
        return { bytes: 0, formatted: "0 B" };
    }

    const totalResponseSize = responseSize.reduce(
        (sum, size) => sum + Number(size),
        0
    );

    const avgBytes = Number((totalResponseSize / responseSize.length).toFixed(2));

    return {
        bytes: formatBytes(avgBytes),
    };
}


function getTotalBandwidth(responseSize) {
    if (!responseSize || responseSize.length === 0) {
        return { bytes: 0, formatted: "0 B" };
    }

    const totalBytes = responseSize.reduce(
        (sum, size) => sum + (Number(size) || 0),
        0
    );

    return {
        bytes: formatBytes(totalBytes),
    };
}


function securityAnalysis(accessLogData) {

    const { httpMethod, statusCode ,responseSize, ipAddresses, requestTarget, referer, date ,time , timezone, userAgent, } = accessLogData;

    const  httpMethodsCount = getHttpMethodsCount(httpMethod);
    const  successfulRequests = getSuccessfulRequests(statusCode);
    const  uniqueIpCount = getUniqueIpsCount(getUniqueIps(ipAddresses));
    const  statusCodeDistribution = getStatusCodeDistirbution(statusCode);
    const  topEndpoints = getTopEndpoints(requestTarget, 10 , 70);
    const  topReferers = getTopReferers(referer, 10);
    const  hourlyActivity = getHourlyActivity(time);
    const  errorPattern = getErrorPatterns(requestTarget, statusCode ,10,70);
    const  averageResponseSize = getAverageResponseSize(responseSize);
    const  totalBandwidth = getTotalBandwidth(responseSize);

    return {
        httpMethodsCount,
        successfulRequests,
        uniqueIpCount,
        statusCodeDistribution,
        topEndpoints,
        topReferers,
        hourlyActivity,
        errorPattern,
        averageResponseSize,
        totalBandwidth,
    };
}

export default securityAnalysis;