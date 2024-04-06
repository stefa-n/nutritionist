import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { jwtDecode } from "jwt-decode";
import { formatDistanceToNow, set } from "date-fns";
import Router from "next/router";
import Challenge from "./Challenge";

export default function CommunityChallenge() {
  const [challenge, setChallenge] = useState();
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

    fetch("http://localhost:3001/communitychallenge", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setChallenge(data[0]);
      });
  }, []);

  const submit = async () => {
    setSubmitted(true);
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
  };

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
      {!challenge ? null : (
        <Challenge
          type={challenge.type}
          title={challenge.title}
          description={challenge.description}
          reward={challenge.points}
          submitted={submitted}
        />
      )}

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
