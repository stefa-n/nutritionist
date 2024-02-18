import Image from "next/image";
import styles from "./styles/Card.module.css";

export default function Card({ name, image, calories, nutriscore, novascore }) {
    return (
        <div className={styles.wrapper}>
            <Image src={image} alt={name} width={200} height={200} className={styles.image}/>
            <div className={styles.textArea}>
                <p className={styles.title}>{name}</p>
            </div>
        </div>
    );
}
