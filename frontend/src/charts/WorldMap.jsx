import { useTheme } from "@mui/material";
import { ResponsiveChoropleth } from "@nivo/geo";
import { geoFeatures } from "../data/mockGeoFeatures";
import { tokens } from "../theme";

const GeographyChart = ({ isDashboard ,  data = []}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const values = data.map(d => d.value ?? 0);
  const minValue = values.length ? Math.min(...values) : 0;
  const maxValue = values.length ? Math.max(...values) : 1;


  return (
    <ResponsiveChoropleth
      data={data}
      features={geoFeatures.features}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      colors={[
        colors.blueAccent[900],
        colors.blueAccent[800],
        colors.blueAccent[700],
        colors.blueAccent[600],
        colors.blueAccent[500],
        colors.blueAccent[400],
        colors.blueAccent[300],
        colors.blueAccent[200],
        colors.blueAccent[100],
     ]} 
      
      domain={[minValue, maxValue]}
      unknownColor={colors.grey[400]} // Color used when a country has no data
      label="properties.name"
      valueFormat=".2s"
      projectionScale={isDashboard ? 120 : 170}
      projectionTranslation={isDashboard ? [0.49, 0.6] : [0.5, 0.5]}
      projectionRotation={[0, 0, 0]}
      borderWidth={1.5}
      borderColor="#ffffff"
      legends={
        !isDashboard
          ? [
              {
                anchor: "bottom-left",
                direction: "column",
                justify: true,
                translateX: 20,
                translateY: -100,
                itemsSpacing: 0,
                itemWidth: 94,
                itemHeight: 18,
                itemDirection: "left-to-right",
                itemTextColor: colors.grey[100],
                itemOpacity: 0.85,
                symbolSize: 18,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#ffffff",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
          : undefined
      }
    />
  );
};

export default GeographyChart;