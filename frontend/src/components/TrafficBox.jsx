import React, { useState, useEffect } from 'react';
import { getMostCommonIps,getRequestPerMinute } from "../services/fetchData";
import { Box, Paper } from "@mui/material";  
import BarChart from "../charts/BarChart";
import LineChart from '../charts/LineChart';


const TrafficBox = () => {   
  const [barData, setBarData] = useState({ labels: [], data: [] });
  const [lineData, setLineData] = useState({ labels: [], data: [] });
  const [mostCommonIps, setMostCommonIps] = useState(null);
  const [requestPerMinute, setRequestPerMinute] = useState(null);


  useEffect(() => {
      const fetchData = async () => {
      try {
          const commonIps = await getMostCommonIps();
          const requests = await getRequestPerMinute();
          setMostCommonIps(commonIps);
          setRequestPerMinute(requests)

      }catch (error) {
        console.error(error);
      }
    };
    fetchData();
  },[]);

  //Set bar data
  useEffect(() => {
    if (!mostCommonIps) return;
    setBarData({
      labels: mostCommonIps.map(row => row[0]),
      data: mostCommonIps.map(row => row[1]),
    });
  }, [mostCommonIps]);


  //Set Line data
   useEffect(() => {
    if (!requestPerMinute) return;
      
    const sortedMap = new Map(
      [...requestPerMinute].sort((a, b)=> a[0].localeCompare(b[0]))
    );

    const labels = [...sortedMap.keys()];
    const data = [...sortedMap.values()];
    
    setLineData({ labels, data });

   },[requestPerMinute]);

return(

  <Box display="flex" gap={2} width="100%">
    <Paper elevation={3} sx={{flex: 2, p: 2, height: "540px", display: "flex", justifyContent: "center", alignItems: "center",}}>
        <LineChart
          labels={lineData.labels}
          data={lineData.data}
          variant={"small"}/>
    </Paper>
      
    <Paper  elevation={3} sx={{ flex: 1, p: 2, height: "540px", }}>
        <BarChart
          labels={barData.labels}
          data={barData.data}
          variant={"small"}/>
    </Paper>
  </Box>

);}
export default TrafficBox;