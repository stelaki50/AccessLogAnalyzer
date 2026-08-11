import React, { useState, useEffect } from 'react';
import { Box, Paper } from "@mui/material";  
import { getHourlyActivity} from "../services/fetchData";
import RefererTable from "../components/tables/RefererTable"
import EndpointsTable from "../components/tables/EndpointsTable"
import  ErrorPatternTable from "../components/tables/ErrorPaternTable"
import  HourlyActivityBarChart from "../charts/HourlyActivityBarChart"



const HttpOverview = () => {

    const [hourlyActivity, setHourlyActivity] =  useState(null);
    const [hourlyActivityData, setHourlyActivityData] = useState({ labels: [], data: [] });

    useEffect(() => {
        const fetchData = async () => {
        try {
          const hourlyActivity = await getHourlyActivity();
          setHourlyActivity(hourlyActivity);
            
        }catch (error) {
            console.error(error);
        }
    };
        fetchData();
    },[]);


  //Set bar data
useEffect(() => {
    if (!hourlyActivity) return;
    setHourlyActivityData({
      labels: hourlyActivity.map(row => row[0]),
      data: hourlyActivity.map(row => row[1]),
    });
}, [hourlyActivity]);




  
    
return (

  <Box display="flex" gap={2} width="100%">
  
  <Paper  elevation={3} sx={{ flex: 1, p: 2, height: "553px", }}>
        <HourlyActivityBarChart
          labels={hourlyActivityData.labels}
          data={hourlyActivityData.data}
          variant={"small"}/>

  </Paper>
      
<Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}> {/* ~ alignItems flex-start instead of default stretch */}
    <Box sx={{ height: 480 }}>  </Box>
      <Box sx={{ alignSelf: "flex-start" }}> 
        <EndpointsTable maxHeight={560} />
      </Box>

    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignSelf: "flex-start" }}>
      <ErrorPatternTable maxHeight={268} /> 
      <RefererTable maxHeight={268} />
  </Box>
 </Box>

 

</Box>
     
);}
export default HttpOverview;