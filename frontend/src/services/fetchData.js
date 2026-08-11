
// This file defines functions to fetch the data from the API.
import Axios from "axios";

const URL = process.env.REACT_APP_API_URL;
const BOT_URL = process.env.REACT_APP_BOT_API_URL;
const SECURITY_URL = process.env.REACT_APP_SECURITY_API_URL;

console.log("BOT_URL is:", BOT_URL);

export const getCountriesPerIp = async () => {
  const res = await Axios.get(`${URL}/mostFrequentCountries`);
  return res.data;
};

export const getMostCommonIps = async () => {
  const res = await Axios.get(`${URL}/mostCommonIps`);
  return res.data;
};

export const getTotalLogEntries = async () => {
  const res = await Axios.get(`${URL}/totalLogEntries`);
  return res.data;
};



export const getRequestPerMinute = async () => {
  const res = await Axios.get(`${URL}/RequestPerMinute`);
  return res.data;
};

export const getStatusCodeCount = async () => {
  const res = await Axios.get(`${URL}/statusCodeCount`);
  return res.data;
};

export const getStatusCodesPerMinute = async () => {
  const res = await Axios.get(`${URL}/StatusCodesPerMinute`);
  return res.data;
};

export const getCountryCount = async () => {
  const res = await Axios.get(`${URL}/CountryCount`);
  return res.data;
};

export const getSessionDurations = async () => {
  const res = await Axios.get(`${BOT_URL}/sessionDurationPerIp`);
  return res.data;
};

export const getPercentageOf4xxPerIp = async () => {
  const res = await Axios.get(`${BOT_URL}/percentageOf4xxPerIp`);
  return res.data;
};


export const getPercentageOfPdfPerIp = async () => {
  const res = await Axios.get(`${BOT_URL}/percentageOfPdfPerIp`);
  return res.data;
};


export const getPercentageOfImagePerIp = async () => {
  const res = await Axios.get(`${BOT_URL}/percentageOfImagePerIp`);
  return res.data;
};


export const getIpHasRobotTxt = async () => {
  const res = await Axios.get(`${BOT_URL}/ipHasRobotTxt`);
  return res.data;
};




export const getTotalSessions = async () => {
  const res = await Axios.get(`${BOT_URL}/totalSessions`);
  return res.data;
};



export const getEmptyUaCount = async () => {
  const res = await Axios.get(`${BOT_URL}/emptyUaCount`);
  return res.data;
};




export const getTotalRobotTxt = async () => {
  const res = await Axios.get(`${BOT_URL}/totalRobotTxt`);
  return res.data;
};



export const getHighClickRatePerIp = async () => {
  const res = await Axios.get(`${BOT_URL}/highClickRatePerIp`);
  return res.data;
};




export const getSearchEngineCrawlers = async () => {
  const res = await Axios.get(`${BOT_URL}/searchEngineCrawlers`);
  return res.data;
};



export const getAICrawlers = async () => {
  const res = await Axios.get(`${BOT_URL}/aICrawlers`);
  return res.data;
};



export const getGeneralCrawlers = async () => {
  const res = await Axios.get(`${BOT_URL}/generalCrawlers`);
  return res.data;
};




export const getBrowserDistirbution = async () => {
  const res = await Axios.get(`${BOT_URL}/browserDistirbution`);
  return res.data;
};



export const gethttpMethodsCount = async () => {
  const res = await Axios.get(`${SECURITY_URL}/httpMethodsCount`);
  return res.data;
};



export const getuniqueIpCount = async () => {
  const res = await Axios.get(`${SECURITY_URL}/uniqueIpCount`);
  return res.data;
};





export const getSuccessfulRequests = async () => {
  const res = await Axios.get(`${SECURITY_URL}/successfulRequests`);
  return res.data;
};




export const getTopReferers = async () => {
  const res = await Axios.get(`${SECURITY_URL}/topReferers`);
  return res.data;
};


export const getTopEndpoints = async () => {
  const res = await Axios.get(`${SECURITY_URL}/topEndpoints`);
  return res.data;
};



export const getHourlyActivity = async () => {
  const res = await Axios.get(`${SECURITY_URL}/hourlyActivity`);
  return res.data;
};


export const getErrorPattern = async () => {
  const res = await Axios.get(`${SECURITY_URL}/errorPattern`);
  return res.data;
};



export const getStatusCodeDistribution = async () => {
  const res = await Axios.get(`${SECURITY_URL}/statusCodeDistribution`);
  return res.data;
};



export const getAverageResponseSize = async () => {
  const res = await Axios.get(`${SECURITY_URL}/averageResponseSize`);
  return res.data;
};


 



export const getTotalBandwidth = async () => {
  const res = await Axios.get(`${SECURITY_URL}/totalBandwidth`);
  return res.data;
};