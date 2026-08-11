
import React, { useState, useEffect } from 'react';
import { Box,Paper } from "@mui/material";  
import WorldMap from "../charts/WorldMap";
import DoughnutChart from "../charts/DoughnutChart";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import { getCountriesPerIp,getCountryCount } from "../services/fetchData";
import { COUNTRY_MAP } from "../data/countryMap";


const CountriesPerIpBox = () => {  

  countries.registerLocale(en);

  const [countriesPerIp, setCountriesPerIp] = useState(null);
  const [countryCount, setCountryCount] =  useState([]);
  const [doughnutData, setDoughnutData] = useState({ labels: [], data: [] });
  const [GeographyData , setGeographyData] =  useState([]);

    useEffect(() => {
      const fetchData = async () => {
      try {
          const countries = await getCountriesPerIp();
          const countriesCount = await getCountryCount();
          setCountriesPerIp(countries)             
          setCountryCount(countriesCount)
    }catch (error){
          console.error(error);
      }
      };
      fetchData();
  },[]);


    //Doughnut chart data
    useEffect(() => {
      if (!countriesPerIp) return;

      const countries = countriesPerIp.map(item => item[0]);
      const counts = countriesPerIp.map(item => item[1]);

      setDoughnutData({
        labels: countries.map(code => COUNTRY_MAP[code] || code),
        data: counts,
      });


    },[countriesPerIp]);


    //Geography chart data
    useEffect(() => {
      if (!countryCount || Object.keys(countryCount).length === 0) return;

      //Convert ISO-2 country code to ISO-3
      const convertedData = Object.entries(countryCount)
        .map(([iso2, value]) => {
          const iso3 = countries.alpha2ToAlpha3(iso2);
    
          // skip invalid codes
          if (!iso3) return null;
    
          return {
            id: iso3,
            value: value,
          };
        })
        .filter(Boolean); 
          
      setGeographyData(convertedData);

    },[countryCount]);

  return(

      <Box display="flex" gap={2}>
        <Paper elevation={3} sx={{ flex: 3, p: 2,}}>
            <WorldMap
              isDashboard={true}
              data={GeographyData}
          />

        </Paper>

        <Paper elevation={3} sx={{flex: 1, p: 2, height: "500px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <DoughnutChart
              labels={doughnutData.labels}
              data={doughnutData.data}
              variant={"small"}
            />
        </Paper>
      </Box>

);}
export default CountriesPerIpBox;