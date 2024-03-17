import { supabase } from "@/pages/index";

export default async function handler(req, res) {
  try {
    const { token } = req.body;
    const { error } = await supabase.auth.getUser(token);
    if (error) {
      res.status(401).json({ error: "Invalid credentials." });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    if (error.type === "CredentialsSignin") {
      res.status(401).json({ error: "Invalid credentials." });
    } else {
      console.log(error);
      res.status(500).json({ error: "Something went wrong." });
    }
  }
}
