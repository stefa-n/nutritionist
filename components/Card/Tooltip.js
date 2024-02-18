import Image from "next/image";
import styles from "./Tooltip.module.css";

export default function Tooltip({type, text, color}) {
    return (
        <div className={styles.wrapper} style={{backgroundColor: `${color}`}}>
            <Image src={require(`@/public/images/icons/${type}.png`)} alt={type} width={18} height={18} className={styles.icon}/>
            <p className={styles.text}>{text}</p>
        </div>
    );
}
