import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

import styles from "@/styles/Login.module.css";

export default function Login() {
  const [subtitle, setSubtitle] = useState(
    "Create an account to access multiple features & MyNutritionist"
  );
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("access_token") === null) return;

    const user = jwtDecode(localStorage.getItem("access_token"));
    if (user.aud) {
      router.push("/");
    }
  });

  async function handleSignup(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (email === "" || password === "") return;
    var regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (regex.test(email) === false) return setSubtitle("Invalid E-mail.");

    const response = await fetch(`/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      router.push("/login");
    }
  }
  return (
    <>
      <div className={styles.container}>
        <ReactMarkdown
          children={`# Community Guidelines for Nutrition Forum:

1. **Respectful Communication:**
   - Treat all members with respect and courtesy. Disagreements are inevitable, but express your views in a constructive and respectful manner.
   - Avoid personal attacks, insults, or any form of harassment. Respect diverse opinions and perspectives.

2. **Reliable Information:**
   - Share information based on credible sources such as scientific research, reputable organizations, or qualified experts.
   - Be cautious of spreading unverified claims or anecdotal evidence. Misinformation can be harmful to others.

3. **Stay on Topic:**
   - Keep discussions focused on nutrition-related topics. This includes diet plans, recipes, nutritional science, dietary supplements, and related health issues.
   - Avoid off-topic discussions that do not contribute to the forum's purpose.

4. **No Promotional Content:**
   - Refrain from promoting commercial products or services unless they are directly relevant to the discussion and contribute valuable insights.
   - Advertising, spamming, or soliciting without permission is not permitted.

5. **Privacy and Confidentiality:**
   - Respect the privacy of others. Do not share personal information about yourself or others without their consent.
   - Do not disclose confidential or sensitive information shared by other members.

6. **Moderation and Reporting:**
   - Follow the instructions of moderators and administrators. They are here to ensure the forum remains a safe and constructive environment.
   - Report any violations of the community guidelines to moderators promptly. Use the appropriate channels for reporting.

7. **Accountability:**
   - Take responsibility for your own posts and actions. Verify information before sharing it and acknowledge mistakes if they occur.
   - Understand that your contributions reflect on the community as a whole. Strive to maintain a positive and reputable forum.

8. **Accessibility and Inclusivity:**
   - Make efforts to ensure that discussions are inclusive and accessible to all members regardless of their background, beliefs, or dietary preferences.
   - Be mindful of language and terminology that may be offensive or exclusionary to certain groups.

9. **Continuous Learning:**
   - Stay open to new information and perspectives. Nutrition science is constantly evolving, and there is always more to learn.
   - Engage in discussions with an attitude of curiosity and willingness to reconsider your views based on evidence.

By adhering to these guidelines, we can foster a supportive and informative community where members can engage in meaningful discussions about nutrition and wellness.
`}
        />
      </div>
    </>
  );
}
