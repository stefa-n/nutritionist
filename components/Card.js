import { useEffect, useState } from "react";

import Image from "next/image";
import styles from "./styles/Card.module.css";
import Tooltip from "./Card/Tooltip";

export default function Card({ barcode, brand, name, image, calories, onClick }) {
    const [nutriscore, setNutriscore] = useState("");
    const [novascore, setNovascore] = useState("");
    
    useEffect(() => {
        fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setNutriscore(data.product.nutriscore_tags[0].toUpperCase());
                setNovascore(data.product.nova_group);
            });
        }, []);

    return (
        <div className={styles.wrapper} onClick={onClick}>
            <Image src={image} alt={name} width={200} height={200} className={styles.image}/>
            <div className={styles.textArea}>
                <p className={styles.title}>{brand} - {name}</p>
                <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', position: 'absolute', bottom: '8px', width: '100%'}}>
                    <Tooltip type="cals" text={calories + "kcal"} color="#C3E8A6"/>
                    <Tooltip type="nutri" text={"NU:" + nutriscore} color="#D0576D"/>
                    <Tooltip type="nova" text={"NO:" + novascore} color="#F0FEFF"/>
                </div>
            </div>
        </div>
    );
}
