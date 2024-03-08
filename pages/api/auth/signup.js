import { supabase } from "@/pages/index";
export default async function handler(req, res) {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: "https://example.com/welcome",
      },
    });
    console.log(data, error);
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    if (error.type === "CredentialsSignin") {
      res.status(401).json({ error: "Invalid credentials." });
    } else {
      res.status(500).json({ error: "Something went wrong." });
    }
  }
}
