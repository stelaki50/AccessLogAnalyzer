let analysisData = null;
let botData = null;
let securityData= null;

// Store the complete analysis result in browser memory.
export const setAnalysisData = (data) => {
    analysisData = data;
};


export const setBotData = (data) => {
    botData = data;
};



export const setSecurityData = (data) => {
    securityData = data;
};



function requireAnalysis() {

    if (!analysisData) {
        throw new Error(
            "No log file has been analyzed yet — upload a file first."
        );
    }

    return analysisData;
}

function requireBotAnalysis() {

    if (!botData) {
        throw new Error(
            "No log file has been analyzed yet — upload a file first."
        );
    }

    return botData;
}


function requireSecurityAnalysis() {

    if (!securityData) {
        throw new Error(
            "No log file has been analyzed yet — upload a file first."
        );
    }

    return securityData;
}




// Access Log Analysis (raw input user)

export const getCountriesPerIp = async () => requireAnalysis().mostFrequentCountries;

export const getMostCommonIps = async () => requireAnalysis().mostCommonIps;

export const getTotalLogEntries = async () => requireAnalysis().totalLogEntries;

export const getRequestPerMinute = async () => Array.from(requireAnalysis().RequestPerMinute.entries());  

export const getStatusCodeCount = async () => requireAnalysis().statusCodeCount;

export const getStatusCodesPerMinute = async () => Object.fromEntries(requireAnalysis().StatusCodesPerMinute);

export const getCountryCount = async () => Object.fromEntries(requireAnalysis().CountryCount);


// Bot analysis

export const getTotalSessions = async () => requireBotAnalysis().totalSessions;

export const getEmptyUaCount = async () => requireBotAnalysis().emptyUaCount;

export const getTotalRobotTxt = async () => requireBotAnalysis().totalRobotTxt;

export const getPercentageOf4xxPerIp = async () => Object.fromEntries(requireBotAnalysis().percentageOf4xxPerIp);

export const getSessionDurations = async () => Object.fromEntries(requireBotAnalysis().sessionDurationPerIp);

export const getBrowserDistirbution = async () => requireBotAnalysis().browserDistirbution;

export const getAICrawlers = async () => requireBotAnalysis().aICrawlers;

export const getSearchEngineCrawlers = async () => requireBotAnalysis().searchEngineCrawlers;

export const getGeneralCrawlers = async () => requireBotAnalysis().generalCrawlers;



// Security analysis


export const getHttpMethodsCount = async () => requireSecurityAnalysis().httpMethodsCount;


export const getSuccessfulRequests = async () => requireSecurityAnalysis().successfulRequests;

export const getUniqueIpCount = async () => requireSecurityAnalysis().uniqueIpCount;

export const getStatusCodeDistribution = async () => Object.fromEntries(requireSecurityAnalysis().statusCodeDistribution);

export const getTopEndpoints = async () => requireSecurityAnalysis().topEndpoints;

export const getTopReferers = async () => requireSecurityAnalysis().topReferers;

export const getHourlyActivity = async () => Array.from(requireSecurityAnalysis().hourlyActivity.entries());


export const getErrorPattern = async () => requireSecurityAnalysis().errorPattern;

export const getAverageResponseSize = async () => requireSecurityAnalysis().averageResponseSize;


export const getTotalBandwidth = async () => requireSecurityAnalysis().totalBandwidth;




