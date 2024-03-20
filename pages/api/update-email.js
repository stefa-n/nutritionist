import { admin_supabase } from "./supabase";
import { jwtDecode } from "jwt-decode";

export default async function handler(req, res) {
  const { email, accessToken } = req.body;

  try {
    const uid = jwtDecode(accessToken).sub;

    const { data: user, error } = await admin_supabase.auth.admin.updateUserById(
      uid,
      { email }
    );

    if (error) {
      res.status(500).json({ error: "Something went wrong." });
    }

    res.status(200).json({ user });
  } catch (error) {
    if (error.type === "CredentialsSignin") {
      res.status(401).json({ error: "Invalid credentials." });
    } else {
      res.status(500).json({ error: "Something went wrong." });
    }
  }
}
