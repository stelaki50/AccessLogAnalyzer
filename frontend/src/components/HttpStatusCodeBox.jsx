import React, { useState, useEffect } from 'react';
import { Box, Paper } from "@mui/material";  
import HttpChart from "../charts/HttpChart";
import MuiCard from "../components/Card";
import { getStatusCodeCount,getStatusCodesPerMinute } from "../services/fetchData";


const HttpStatusCodeBox = () => {

 const [statusCodePerMinute, setStatusCodePerMinute] = useState(null);
 const [httpMethodChart, setHttpMethodChart] = useState({ labels: [], data: [] });
 const [statusCodeCount, setStatusCodeCount] = useState(null);  

  useEffect(() => {
      const fetchData = async () => {
        try {
          const statusCodes = await getStatusCodeCount();
          const statusCodesPerMinuteRes = await getStatusCodesPerMinute();
          setStatusCodeCount(statusCodes);
          setStatusCodePerMinute(statusCodesPerMinuteRes)
          }catch (error) {
          console.error(error);
        }
      };
      fetchData();
  },[]);


  useEffect(() => {
    if (!statusCodePerMinute) return;
    
    console.log("Status code per minute",statusCodePerMinute)
    // const sortedMap = new Map(
    //   [...statusCodePerMinute].sort((a, b)=> a[0].localeCompare(b[0]))
    // );

    //const methods = [...sortedMap.keys()];
    //const count = [...sortedMap.values()];

     const methods = Object.keys(statusCodePerMinute); 
     const count = Object.values(statusCodePerMinute); 

    setHttpMethodChart({
      labels: methods,
      data: count,
    });

  },[statusCodePerMinute]);

  return (

     <Box sx={{display: "flex", gap: 2, }}>
        <Box sx={{ width: "50%", display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ width: "48%" }}>
              <MuiCard title="2xx Status Codes " value={statusCodeCount?.["2xx"] ?? 0 }  color="green"   />
          </Box>

          <Box sx={{ width: "48%" }}>
              <MuiCard title="3xx Status Codes " value={statusCodeCount?.["3xx"] ?? 0 } color="Darkgreen"   />
          </Box>

          <Box sx={{ width: "48%" }}>
              <MuiCard title="4xx Status Codes" value={statusCodeCount?.["4xx"] ?? 0 } color="orange"   />
          </Box>

          <Box sx={{ width: "48%" }}>
              <MuiCard title="5xx Status Codes"  value={statusCodeCount?.["5xx"] ?? 0 } color="red"  />
          </Box>
        </Box>

      <Box sx={{ width: "50%" }}>
        <Box sx={{ width: "100%", height: 350 }}>
            <Paper sx={{ height: "95%", p: 2 }}>
               <HttpChart
                  labels={httpMethodChart.labels}
                  data={httpMethodChart.data}
                  variant={"small"}/>
            </Paper>
        </Box>
      </Box>
    </Box>  

);}
export default HttpStatusCodeBox;