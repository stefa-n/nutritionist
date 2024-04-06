import Topbar from "@/components/Topbar";
import { useEffect, useState } from "react";
import { admin_supabase } from "@/pages/api/admin/supabase";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styles from "@/styles/Home.module.css";

export default function Leaderboard() {
  const [progress, setProgress] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [ranking, setRanking] = useState([]);
  const [rewards, setRewards] = useState([
    {
      id: 0,
      name: "5% Amazon Coupon",
      price: 1000,
      src: "https://t4.ftcdn.net/jpg/00/98/97/57/360_F_98975745_sgSVAhoA5L8DgfEgoamIEZcKh0J6aBNI.jpg",
    },
    {
      id: 1,
      name: "20% Amazon Coupon",
      price: 4000,
      src: "https://t4.ftcdn.net/jpg/00/63/83/29/360_F_63832924_PE0b9gQltaKya7t6mIQLWat5ob0KcuXr.jpg",
    },
    {
      id: 2,
      name: "1 Month Free MyFitnessPal",
      price: 5000,
      src: "https://upload.wikimedia.org/wikipedia/en/6/63/MyFitnessPal_Logo.png",
    },
    {
      id: 3,
      name: "1 Month Free Spotify Premium",
      price: 5000,
      src: "https://store-images.s-microsoft.com/image/apps.10546.13571498826857201.6603a5e2-631f-4f29-9b08-f96589723808.dc893fe0-ecbc-4846-9ac6-b13886604095?h=464",
    },
    {
      id: 4,
      name: "1 Garmin Fenix 7x Pro",
      price: 500000,
      src: "https://images.bike24.com/i/mb/de/54/b6/garmin-fenix-7x-pro-saphire-solar-gps-smartwatch-3-1653182.jpg",
    },
    {
      id: 5,
      name: "Blukar skipping rope",
      price: "7000",
      src: "https://m.media-amazon.com/images/I/71VsiyQgizL._AC_SL1500_.jpg",
    },
    {
      id: 6,
      name: "CodiCile Sports Water Bottle, 1 Litre",
      price: "10000",
      src: "https://m.media-amazon.com/images/I/71sdrWEISPL._AC_SL1500_.jpg",
    },
    {
      id: 7,
      name: "Renpho body fat scale",
      price: "12000",
      src: "https://m.media-amazon.com/images/I/61bAnOXDl7L._AC_UL320_.jpg",
    },
  ]);
  const fetchProgress = async () => {
    const { data: aux, error } = await admin_supabase
      .from("transactions")
      .select("*");
    setProgress(aux);
  };

  const fetchUsernames = async () => {
    let userDictionary = {};
    for (const el of ranking) {
      const { data: res, error } = await admin_supabase.auth.admin.getUserById(
        el.user_id
      );
      userDictionary[el.user_id] = res.user.email;
    }
    console.log(userDictionary);
    setUsernames(userDictionary);
  };
  useEffect(() => {
    fetchProgress();
  }, []);

  useEffect(() => {
    let auxResults = {},
      auxLeaderboard = [];
    progress.forEach((el) => {
      if (!(el.user_id in auxResults)) {
        auxResults[el.user_id] = el;
        auxResults[el.user_id].total =
          el.nutrition_points +
          el.exercise_points +
          el.mindful_points +
          el.hydration_points;
      } else {
        auxResults[el.user_id].nutrition_points += el.nutrition_points;
        auxResults[el.user_id].exercise_points += el.exercise_points;
        auxResults[el.user_id].mindful_points += el.mindful_points;
        auxResults[el.user_id].hydration_points += el.hydration_points;
        auxResults[el.user_id].total +=
          el.nutrition_points +
          el.exercise_points +
          el.mindful_points +
          el.hydration_points;
      }
    });
    Object.keys(auxResults).forEach((res) =>
      auxLeaderboard.push(auxResults[res])
    );
    auxLeaderboard = auxLeaderboard.sort((a, b) => b.total - a.total);

    setRanking(auxLeaderboard);
  }, [progress]);

  useEffect(() => {
    fetchUsernames();
  }, [ranking]);
  return (
    <>
      <Topbar search={false} />
      <h1>Rewards</h1>
      <div className={`${styles.grid}`}>
        {rewards.map((reward) => {
          return (
            <Card key={reward.id} sx={{ maxWidth: 345 }}>
              <CardMedia
                sx={{ height: 140 }}
                image={reward.src}
                title="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {reward.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="large">{reward.price} points</Button>
              </CardActions>
            </Card>
          );
        })}
      </div>
      <h1>Global leaderboard</h1>
      {usernames &&
        Object.keys(usernames).length > 0 &&
        ranking &&
        ranking.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Total points</TableCell>
                  <TableCell>Nutrition points</TableCell>
                  <TableCell>Exercise points</TableCell>
                  <TableCell>Mindfulness points</TableCell>
                  <TableCell>Hydration points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ranking &&
                  ranking.length > 0 &&
                  ranking.map((entry, id) => {
                    return (
                      <TableRow key={entry.id}>
                        <TableCell component="th" scope="row">
                          {id + 1}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {usernames[entry.user_id]}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {entry.total}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {entry.nutrition_points}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {entry.exercise_points}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {entry.mindful_points}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {entry.hydration_points}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
    </>
  );
}
