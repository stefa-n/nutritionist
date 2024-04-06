import { supabase } from "@/pages/index.js";
import { jwtDecode } from "jwt-decode";
import MuiInput from "@mui/material/Input";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import styles from "../styles/Topbar.module.css";

const Input = styled(MuiInput)`
  width: 42px;
`;

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
export const options = {
  responsive: true,
  layout: {
    padding: {
      left: -10,
    },
  },
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Challenges tracking",
      font: {
        size: 24,
      },
      color: "#fff",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export default function Stats() {
  const [progress, setProgress] = useState([]);
  const [sum, setSUm] = useState(0);
  const [value, setValue] = useState(7);
  const [streakEnd, setStreakEnd] = useState("");
  const [chartData, setChartData] = useState({
    labels,
    datasets: [],
  });
  let user;
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }
    const decodedToken = jwtDecode(token);
    user = decodedToken;
  }, []);

  const fetchProgress = async () => {
    const { data: aux, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.sub)
      .order("timestamp", { ascending: true });
    setProgress(aux);
    let auxSum = 0;
    setChartData({
      labels: aux.map((day) => {
        if (day.streak_end) {
          setStreakEnd(day.timestamp);
        }
        auxSum +=
          day.nutrition_points +
          day.exercise_points +
          day.mindful_points +
          day.hydration_points;
        let obj = new Date(day.timestamp);
        let dd = obj.getUTCDate();
        let month = obj.getUTCMonth() + 1;
        let year = obj.getUTCFullYear();
        return `${dd}/${month}/${year}`;
      }),
      datasets: [
        {
          label: "Nutrition",
          data: aux.map((day) => day.nutrition_points),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "Exercise",
          data: aux.map((day) => day.exercise_points),
          borderColor: "rgb(255, 255, 0)",
          backgroundColor: "rgba(255, 255, 0, 0.5)",
        },
        {
          label: "Mindfulness",
          data: aux.map((day) => day.mindful_points),
          borderColor: "rgb(124,252,0)",
          backgroundColor: "rgba(124, 252, 0, 0.5)",
        },
        {
          label: "Hydration",
          data: aux.map((day) => day.hydration_points),
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    });
    setSUm(auxSum);
    // labels = aux.map((day) => {
    //   console.log(day.timestamp);
    //   return day.timestamp;
    // });
    // console.log(labels);
  };
  const handleSliderChange = (event, newValue) => {
    localStorage.setItem("goal", newValue);
    setValue(newValue);
  };
  const handleInputChange = (event) => {
    localStorage.setItem("goal", newValue);
    setValue(event.target.value === "" ? 0 : Number(event.target.value));
  };
  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 14) {
      setValue(14);
    }
  };

  const checkStreak = () => {
    const arr = progress.map((day) => day.timestamp).reverse();
    const compare = (a, b) => {
      return (
        Date.parse(a.slice(0, 10)) - Date.parse(b.slice(0, 10)) === 86400000
      );
    };
    const requiredConsecutiveCount = 1;
    let counter = 1;
    for (let i = 1; i < arr.length; ++i) {
      if (compare(arr[i], arr[i - 1])) {
        counter++;
      }
      // if (arr[i - 1] == streakEnd) {
      //   break;
      // }
    }
    return counter;
  };

  const claimBonus = async () => {
    console.log(progress);
    console.log("test");
    const { error: updateError } = await supabase
      .from("transactions")
      .update({
        streak_end: true,
      })
      .eq("id", progress[progress.length - 1].id);
  };
  useEffect(() => {
    fetchProgress();
  }, []);
  useEffect(() => {
    checkStreak();
  }, [progress]);
  return (
    <>
      <div
        style={{
          margin: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "800px",
          width: "1000px",
        }}
      >
        {<Line options={options} data={chartData} />}
        Total points: {sum}
        <h3>Set goal (1 day streak = 100 points)</h3>
        <h4>Current streak: {checkStreak()}</h4>
        {/* <button onClick={claimBonus} className={styles.loginBtn}>
          Claim bonus
        </button> */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Slider
              value={typeof value === "number" ? value : 0}
              onChange={handleSliderChange}
              aria-labelledby="input-slider"
              max={14}
            />
          </Grid>
          <Grid item>
            <Input
              value={value}
              size="small"
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                step: 1,
                min: 0,
                max: 14,
                type: "number",
                "aria-labelledby": "input-slider",
              }}
            />
          </Grid>
        </Grid>
      </div>
    </>
  );
}
