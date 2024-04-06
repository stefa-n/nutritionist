import Image from "next/image";
import styles from "../styles/Challenge.module.css";

export default function ComChallenge({
  type,
  title,
  description,
  reward,
  submitted,
  progress,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
        backgroundColor: "#333",
        padding: "10px",
        borderRadius: "10px",
      }}
    >
      <div className={styles.checkbox}>
        <input id={`com.${type}`} type="checkbox" disabled={submitted} />
      </div>
      <div className={styles.challenge}>
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>
        <p className={styles.description}>{progress} progress</p>
      </div>
      <p className={styles.reward}>
        x<span id={`cval.${type}`}>{reward}</span>
        <Image
          src={require(`@/public/images/icons/${type}.png`)}
          width={30}
          height={30}
        />{" "}
      </p>
    </div>
  );
}
