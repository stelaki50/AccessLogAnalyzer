
// This file defines functions to fetch the data from the API.
import Axios from "axios";

const URL = process.env.REACT_APP_API_URL;

export const getCountriesPerIp = async () => {
  const res = await Axios.get(`${URL}/mostFrequentCountries`);
  return res.data;
};

export const getMostCommonIps = async () => {
  const res = await Axios.get(`${URL}/mostCommonIps`);
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
