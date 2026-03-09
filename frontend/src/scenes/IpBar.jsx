import { Box, useTheme } from "@mui/material";
import Header from "../components/Header";
import BarChart from "../charts/BarChart";
import { getMostCommonIps } from "../services/fetchData";
import React, { useState, useEffect } from 'react';
import { tokens } from "../theme";



const IpBar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [barData, setBarData] = useState({ labels: [], data: [] });
  const [mostCommonIps, setMostCommonIps] = useState(null);
  
  useEffect(() => {
      const fetchData = async () => {
          try {
            const commonIps = await getMostCommonIps();
            setMostCommonIps(commonIps);
       
          }catch (error) {
            console.error(error);
          }
    };
      fetchData();
    },[]);
  
  
    //Set the bar data
    useEffect(() => {
      if (!mostCommonIps) return;

      setBarData({
        labels: mostCommonIps.map(row => row[0]),
        data: mostCommonIps.map(row => row[1]),
      });

    }, [mostCommonIps]);
   
    
    return (
      <Box m="20px">
        <Header title="Bar Chart" subtitle="This chart displays the top 10 most frequent IP Adresses " />
        <Box height="75vh" display="flex" justifyContent="center" alignItems="center" border={`1px solid ${colors.grey[100]}`}>
            <BarChart
              labels={barData.labels}
              data={barData.data}
              variant={"large"}
            />
        </Box>
      </Box>
    );
  
};

export default IpBar;