import MuiCard from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function Card({ title, value, color }) {

return (
  <MuiCard sx={{ height: 150, width: "100%", }}>
    <CardContent>
        <Typography variant="h5" sx={{ textAlign: "center" }} >
            {title}
        </Typography>

        <Typography variant="h3" sx={{ mt: 2, fontWeight: "bold", textAlign: "center", color: color,}}>
            {value}
        </Typography>

    </CardContent>
  </MuiCard>
  );
}