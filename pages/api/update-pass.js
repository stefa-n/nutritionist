import { supabase } from "@/pages/index";
import { jwtDecode } from "jwt-decode";

export default async function handler(req, res) {
  const { password, accessToken } = req.body;

  try {
    const uid = jwtDecode(accessToken).sub;

    const { data: user, error } = await supabase.auth.admin.updateUserById(
      uid,
      { password }
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
