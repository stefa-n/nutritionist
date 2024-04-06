import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { jwtDecode } from "jwt-decode";
import { formatDistanceToNow, set } from "date-fns";
import Router from "next/router";
import Challenge from "./Challenge";

export default function DailyChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [submitted, setSubmitted] = useState(true);
  const tommorow = new Date().setHours(23, 59, 59, 999);

  let supabase;

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      Router.push("/login");
    }
    supabase = createClient(
      "https://devjuheafwjammjnxthd.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRldmp1aGVhZndqYW1tam54dGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgyODE4OTIsImV4cCI6MjAyMzg1Nzg5Mn0.nb5Hx-GEORyNSyoBcVfFC3ktfS5x7vCqBtsD3kJR25M",
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      }
    );
  }, []);

  const submit = async () => {
    setSubmitted(true);

    if (!localStorage.getItem("access_token")) {
      Router.push("/login");
    }
    supabase = createClient(
      "https://devjuheafwjammjnxthd.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRldmp1aGVhZndqYW1tam54dGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgyODE4OTIsImV4cCI6MjAyMzg1Nzg5Mn0.nb5Hx-GEORyNSyoBcVfFC3ktfS5x7vCqBtsD3kJR25M",
      {
        global: {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      }
    );

    let types = ["exercise", "hydration", "mindful", "nutrition"];
    let challenges = [];

    types.forEach((type) => {
      if (document.getElementById(`chk.${type}`).checked) {
        challenges.push(type);
      }
    });

    const accessToken = localStorage.getItem("access_token");
    const user = jwtDecode(accessToken);

    const { data, error } = await supabase
      .from("user_data")
      .select("*")
      .eq("user_id", user.sub);

    if (error) {
      console.error(error);
      return;
    }

    let totalPoints = data[0].total_points;
    let _points = [];

    challenges.forEach(async (type) => {
      let points = data[0][`${type}_points`];
      points += parseInt(document.getElementById(`val.${type}`).innerText);
      totalPoints += parseInt(document.getElementById(`val.${type}`).innerText);

      _points[type] = parseInt(
        document.getElementById(`val.${type}`).innerText
      );

      await supabase
        .from("user_data")
        .update({ [`${type}_points`]: points })
        .eq("user_id", user.sub);
    });

    await supabase.from("transactions").insert([
      {
        user_id: user.sub,
        nutrition_points: _points["nutrition"],
        exercise_points: _points["exercise"],
        hydration_points: _points["hydration"],
        mindful_points: _points["mindful"],
      },
    ]);

    await supabase
      .from("user_data")
      .update({ submitted: true, total_points: totalPoints })
      .eq("user_id", user.sub)
      .then(() => {});
  };

  const checkTable = async () => {
    const accessToken = localStorage.getItem("access_token");
    const user = jwtDecode(accessToken);

    while (!supabase) {
      console.log("Waiting for supabase to load");
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const { data, error } = await supabase
      .from("user_data")
      .select("*")
      .eq("user_id", user.sub);

    if (error) {
      console.error(error);
      return;
    }

    if (data.length === 0) {
      await supabase.from("user_data").insert([{ user_id: user.sub }]);
    }

    setSubmitted(data[0].submitted);
  };

  const getUserChallenges = async () => {
    const accessToken = localStorage.getItem("access_token");
    const user = jwtDecode(accessToken);

    const { data, error } = await supabase
      .from("user_data")
      .select("*")
      .eq("user_id", user.sub);

    if (error) {
      console.error(error);
      return;
    }

    let challenges = data[0].challenges;

    console.log(challenges);

    const { data: allChallenges } = await supabase
      .from("challenges")
      .select("*");

    challenges = allChallenges.filter((challenge) =>
      challenges.includes(challenge.id)
    );

    setChallenges(challenges);
  };

  useEffect(() => {
    checkTable();
    getUserChallenges();
  }, []);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        maxWidth: "1000px",
        gap: "10px",
      }}
    >
      <div style={{ display: "flex" }}>
        <p style={{ width: "100%" }}>Daily Challenges</p>

        <p style={{ width: "100%", textAlign: "right" }}>
          resets{" "}
          {formatDistanceToNow(tommorow, {
            addSuffix: true,
          })}
        </p>
      </div>
      {challenges.map((challenge) => (
        <Challenge
          type={challenge.type}
          title={challenge.title}
          description={challenge.description}
          reward={challenge.points}
        />
      ))}
      <div
        style={{
          width: "90%",
          backgroundColor: `${submitted ? "#333" : "#4caf50"}`,
          padding: "8px 15px",
          borderRadius: "0.25rem",
          textAlign: "center",
        }}
        onClick={() => {
          submitted ? null : submit();
        }}
      >
        Submit
      </div>
    </div>
  );
}
