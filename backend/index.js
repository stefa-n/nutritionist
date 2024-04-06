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
    .select("*")
    .eq("is_community", false);

  if (error) {
    console.error(error);
    return;
  }

  return challenges;
}

async function fetchCommunityChallenge() {
  const { data: challenges, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("is_community", true);

  if (error) {
    console.error(error);
    return;
  }

  return challenges[Math.floor(Math.random() * challenges.length)];
}

var challenges = fetchChallenges();
var communitychallenge = fetchCommunityChallenge();

challenges.then((data) => {
  challenges = data;
  console.log(`Stored ${challenges.length} challenges in cache`);
});

communitychallenge.then((data) => {
  communitychallenge = data;
  console.log(`Stored community challenge in cache`, communitychallenge);
});

setInterval(async () => {
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

setInterval(async () => {
  const { data: challenges, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", communitychallenge.id);

  if (error) {
    console.error(error);
    return;
  }

  if (
    challenges[0].community_participants.length >=
    challenges[0].community_progress
  ) {
    challenges[0].community_participants.forEach(async (entry) => {
      // get the user's points of the challenge type and total points, then update them

      const { data: userData, error } = await supabase
        .from("user_data")
        .select("*")
        .eq("user_id", entry);

      if (error) {
        console.error(error);
        return;
      }

      let user = userData[0];
      let points = user[`${challenges[0].type}_points`];
      points += challenges[0].reward;
      let totalPoints = user.total_points;
      totalPoints += challenges[0].reward;

      await supabase
        .from("user_data")
        .update({
          [`${challenges[0].type}_points`]: points,
          total_points: totalPoints,
        })
        .eq("user_id", entry);

      await supabase.from("transactions").insert([
        {
          user_id: entry,
          [`${challenges[0].type}_points`]: challenges[0].reward,
        },
      ]);
    });
  }

  communitychallenge = fetchCommunityChallenge();
}, 1000 * 60 * 60 * 24);

app.get("/communitychallenge", async (req, res) => {
  const { data: challenges, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", communitychallenge.id);

  res.json(challenges[0]);
});

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

app.listen(3001, function () {
  console.log(`Backend listening on port 3001`);
});
