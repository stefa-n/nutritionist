import { supabase } from "@/pages/index.js";
import { jwtDecode } from "jwt-decode";
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
import { withTheme } from "@emotion/react";

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
    console.log(aux, user.sub);
    setProgress(aux);
    setChartData({
      labels: aux.map((day) => {
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
    // labels = aux.map((day) => {
    //   console.log(day.timestamp);
    //   return day.timestamp;
    // });
    // console.log(labels);
  };

  useEffect(() => {
    fetchProgress();
  }, []);
  return (
    <>
      <div
        style={{
          margin: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "400px",
          width: "1000px",
        }}
      >
        {<Line options={options} data={chartData} />}
      </div>
    </>
  );
}
