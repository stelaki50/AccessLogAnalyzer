import React, { useState, useEffect } from 'react';
import { Box, Paper } from "@mui/material";  
import MuiCard from "../components/Card";
import { getSuccessfulRequests, getUniqueIpCount, getHttpMethodsCount, getAverageResponseSize, getTotalBandwidth} from "../services/fetchData";
import HttpDoughnutChart from "../charts/HttpDoughnutChart";
import StatusCodeDistributionBar from "./StatusCodeDistributionBar"


const HttpOverview = () => {

    const [httpMethodsCount, setHttpMethodsCount] =  useState(null);
    const [successfulRequests, setSuccessfulRequests] = useState(null);  
    const [uniqueIpCount, setUniqueIpCount] = useState(null);  
    const [averageResponseSize, setAverageResponseSize] = useState(null);  
    const [totalBandwidth, setTotalBandwidth] = useState(null);      
    const [httpDoughnutData, setHttpDoughnutData] = useState({ labels: [], data: [] });

    useEffect(() => {
        const fetchData = async () => {
        try {
            const successfulRequests = await getSuccessfulRequests();
            const uniqueIpCount = await getUniqueIpCount();
            const httpMethodsCount = await getHttpMethodsCount();
            const averageResponseSize =  await getAverageResponseSize();
            const totalBandwidth = await getTotalBandwidth();

            setUniqueIpCount(uniqueIpCount);
            setSuccessfulRequests(successfulRequests);
            setHttpMethodsCount(httpMethodsCount);
            setAverageResponseSize(averageResponseSize);
            setTotalBandwidth(totalBandwidth);
            
        }catch (error) {
            console.error(error);
        }
    };
        fetchData();
    },[]);




    //Doughnut chart data
    useEffect(() => {
      if (!httpMethodsCount) return;

       const methods = Object.keys(httpMethodsCount);
        const counts = Object.values(httpMethodsCount);

      setHttpDoughnutData({
        labels: methods,
        data: counts,
      });


    },[httpMethodsCount]);


  
    return (
  <Box sx={{ display: "flex", gap: 2 }}>

    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 2 }}>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <MuiCard
            title="Successful Requests "
            value={successfulRequests != null ? `${successfulRequests}%` : "0%"}
            color="#76b955"
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <MuiCard
            title="Unique Ip Addresses"
            value={uniqueIpCount ?? 0}
            color="#ADD8E6"
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <MuiCard
            title="Total Bandwidth"
            value={totalBandwidth?.bytes ?? "0 B"}
            color="#ADD8E6"
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <MuiCard
            title="Average Response Size"
            value={averageResponseSize?.bytes ?? "0 B"}
            color="#ADD8E6"
          />
        </Box>
      </Box>

      <StatusCodeDistributionBar />

    </Box>

    <Paper elevation={3} sx={{ flex: 1, p: 2, height: "500px", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <HttpDoughnutChart
        labels={httpDoughnutData.labels}
        data={httpDoughnutData.data}
        variant={"small"}
      />
    </Paper>
  </Box>
);
}
export default HttpOverview;