import { getPercentageOf4xxPerIp,getBrowserDistirbution } from "../services/fetchData";
import { Box, Paper } from "@mui/material";  
import React, { useState, useEffect } from 'react';
import Bar4xxChart from "../charts/Bar4xxChart";
import BrowserDoughnutChart from "../charts/BrowserDoughnutChart";




const PersentagesBox = () => {

    const [barData4xx, setBarData4xx] = useState({ labels: [], data: [] });
    const [percentageOf4xxPerIp, setPercentageOf4xxPerIp] = useState(null);

    const [browserDistirbution, setBrowserDistirbution] = useState(null);
    const [browserDoughnutData, setBrowserDoughnutData] = useState({ labels: [], data: [] });
    

  // Status Code 4xx BAR CHART // 

    // Fetch the Data for the Percentage of 4xx Status Codes per Ip Address  Bar Chart
    useEffect(() => {
        const fetchData = async () => {
        try {
            const percentageOf4xxPerIp = await getPercentageOf4xxPerIp();
            setPercentageOf4xxPerIp(percentageOf4xxPerIp); 

            const browserDistirbution = await getBrowserDistirbution();
            setBrowserDistirbution(browserDistirbution);
    
        }catch (error) {
            console.error(error);
        }
    };
        fetchData();
    },[]);

  //Set bar data for the percentage of 4xx status codes per Ip Address
  useEffect(() => {
    if (!percentageOf4xxPerIp) return;
      const entries = Object.entries(percentageOf4xxPerIp);

    setBarData4xx({
      labels: entries.map(([ip]) => ip),
      data: entries.map(([, duration]) => duration),
    });
  },[percentageOf4xxPerIp]);
    
///////////////////////////////////////////////////////////////////


// Set the Doughnut chart for the Browser Distirbution
    useEffect(() => {
      if (!browserDistirbution) return;

       const methods = Object.keys(browserDistirbution);
       const counts = Object.values(browserDistirbution);

      setBrowserDoughnutData({
        labels: methods,
        data: counts,
      });


    },[browserDistirbution]);



  return (

  <Box display="flex" gap={2} width="100%">
   
    
    <Paper  elevation={3} sx={{ flex: 1, p: 2, height: "540px",  display: "flex", justifyContent: "center", alignItems: "center"}}>
        <Bar4xxChart
          labels={barData4xx.labels}
          data={barData4xx.data}
          variant={"small"}/>
    </Paper>



      <Paper elevation={3} sx={{ flex: 1, p: 2, height: "540px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <BrowserDoughnutChart
          labels={browserDoughnutData.labels}
          data={browserDoughnutData.data}
          variant={"small"}
        />
      </Paper>

  
  </Box>


 

);}
export default PersentagesBox;