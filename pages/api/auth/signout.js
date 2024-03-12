import { supabase } from "@/pages/index";

export default async function handler(req, res) {
  try {
    console.log("sign out");
    const { error } = await supabase.auth.signOut();
    // localStorage.removeItem("access_token");
    // setUser({});
    // router.push("login");
    console.log(error);
    res.status(200).json({ status: "Successful signout" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
