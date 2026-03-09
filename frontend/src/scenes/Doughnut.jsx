import { Box, useTheme } from "@mui/material";
import Header from "../components/Header";
import React, { useState, useEffect } from "react";
import { tokens } from "../theme";
import DoughnutChart from "../charts/DoughnutChart";
import { getCountriesPerIp } from "../services/fetchData";
import { COUNTRY_MAP } from "../data/countryMap";

const Doughnut = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [doughnutData, setDoughnutData] = useState({ labels: [], data: [] });
  const [countriesPerIp, setCountriesPerIp] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countries = await getCountriesPerIp();
        setCountriesPerIp(countries);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  //Doughnut chart data
  useEffect(() => {
    if (!countriesPerIp) return;

    const countries = countriesPerIp.map((item) => item[0]);
    const counts = countriesPerIp.map((item) => item[1]);

    setDoughnutData({
      labels: countries.map((code) => COUNTRY_MAP[code] || code),
      data: counts,
    });
  }, [countriesPerIp]);

  return (
    <Box m="20px">
      <Header title="Doughnut" subtitle="This chart displays how many users connect from each country " />
      <Box height="75vh" display="flex" justifyContent="center" alignItems="center" border={`1px solid ${colors.grey[100]}`}>
        <DoughnutChart
          labels={doughnutData.labels}
          data={doughnutData.data}
          variant={"large"}
        />
      </Box>
    </Box>
  );
};
export default Doughnut;
