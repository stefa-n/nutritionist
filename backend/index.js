const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const supabase = createClient(
  "https://devjuheafwjammjnxthd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRldmp1aGVhZndqYW1tam54dGhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwODI4MTg5MiwiZXhwIjoyMDIzODU3ODkyfQ.RHiqiCEAMLAoJVJ-F07Hcby3MmjR5HpC_su0DbDsFS4"
);

async function fetchChallenges() {
  const { data: challenges, error } = await supabase
    .from("challenges")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  return challenges;
}

let challenges = fetchChallenges();
challenges.then((data) => {
  challenges = data;
  console.log(`Stored ${challenges.length} challenges in cache`);
});

app.get("/dailyc", async function (req, res) {
  const { user_id } = req.query;
  const { data, error } = await supabase
    .from("user_data")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
    return;
  }

  const userData = data[0];

  res.json({ userData });
});

setInterval(async () => {
  challenges = await fetchChallenges();
  console.log(`Stored ${challenges.length} challenges in cache`);

  const { data: users, error } = await supabase.from("user_data").select("*");
  if (error) {
    console.error(error);
    return;
  }

  users.forEach(async (user) => {
    console.log(`Resetting daily challenges for user ${user.user_id}`);

    const nutritionChallenges = challenges.filter(
      (challenge) => challenge.type === "nutrition"
    );

    const exerciseChallenges = challenges.filter(
      (challenge) => challenge.type === "exercise"
    );

    const mindfulChallenges = challenges.filter(
      (challenge) => challenge.type === "mindful"
    );

    const hydrationChallenges = challenges.filter(
      (challenge) => challenge.type === "hydration"
    );

    const nutritionChallenge =
      nutritionChallenges[
        Math.floor(Math.random() * nutritionChallenges.length)
      ];
    const exerciseChallenge =
      exerciseChallenges[Math.floor(Math.random() * exerciseChallenges.length)];
    const mindfulChallenge =
      mindfulChallenges[Math.floor(Math.random() * mindfulChallenges.length)];
    const hydrationChallenge =
      hydrationChallenges[
        Math.floor(Math.random() * hydrationChallenges.length)
      ];

    let newChallenges = [
      nutritionChallenge.id,
      exerciseChallenge.id,
      mindfulChallenge.id,
      hydrationChallenge.id,
    ];

    console.log(
      nutritionChallenge.id,
      exerciseChallenge.id,
      mindfulChallenge.id,
      hydrationChallenge.id
    );

    supabase
      .from("user_data")
      .update({ challenges: newChallenges, submitted: false })
      .eq("user_id", user.user_id);

    console.log(
      `Reset daily challenges for user ${user.user_id} to ${newChallenges[0]}, ${newChallenges[1]}, ${newChallenges[2]}, ${newChallenges[3]}`
    );
  });
}, 1000 * 60 * 60 * 24);

app.listen(3001, function () {
  console.log(`Backend listening on port 3001`);
});
