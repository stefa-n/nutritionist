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

export default function Leaderboard() {
  const [progress, setProgress] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [ranking, setRanking] = useState([]);
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
      <h1>Leaderboard page</h1>
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
