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

async function fetchCommunityChallenge() {
  // select a random challenge from the challenges table where community = true
  const { data: challenge, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("community", true)
    .order("random")
    .limit(1);

  if (error) {
    console.error(error);
    return;
  }

  return challenge;
}

let challenges = fetchChallenges();
let communitychallenge = fetchChallenges();

challenges.then((data) => {
  challenges = data;
  console.log(`Stored ${challenges.length} challenges in cache`);
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

app.get("/communitychallenge", async (req, res) => {
  res.json(challenge);
});

app.listen(3001, function () {
  console.log(`Backend listening on port 3001`);
});
