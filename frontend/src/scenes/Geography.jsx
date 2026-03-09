import React, { useState, useEffect } from 'react';
import { Box, useTheme } from "@mui/material";
import Header from "../components/Header";
import { tokens } from "../theme";
import WorldMap from "../charts/WorldMap";
import { getCountryCount } from "../services/fetchData";
import countries from "i18n-iso-countries";


const Geography = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [countryCount, setCountryCount] =  useState([]);
  const [GeographyData , setGeographyData] =  useState([]);


    useEffect(() => {
      const fetchData = async () => {
      try {
        const countriesCount = await getCountryCount();
        setCountryCount(countriesCount);

      }catch (error) {
        console.error(error);
      }
      
    };
      fetchData();
  },[]);
  

    //Geography chart data
    useEffect(() => {
      if (!countryCount || Object.keys(countryCount).length === 0) return;
  
      const convertedData = Object.entries(countryCount)
        .map(([iso2, value]) => {
          const iso3 = countries.alpha2ToAlpha3(iso2);
    
        if (!iso3) return null;
    
        return {
            id: iso3,
            value: value,
          };
        })
        .filter(Boolean); // remove nulls
    
      setGeographyData(convertedData);
  
    },[countryCount]);
  
  
  return (
    <Box m="20px">
      <Header title="Geography" subtitle="This chart displays where the users are located " />

      <Box height="75vh" border={`1px solid ${colors.grey[100]}`} borderRadius="4px">
        <WorldMap
          isDashboard={false}
          data={GeographyData}
        />
      </Box>
    </Box>
  );
};

export default Geography;