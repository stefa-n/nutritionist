import Image from "next/image";
import styles from "./styles/Topbar.module.css";
import { useState } from "react";

export default function Topbar() {
    const [calories, setCalories] = useState('<500');
    const [nutriscore, setNutriscore] = useState('A');
    const [novascore, setNovascore] = useState('1');

    const changeCalories = () => {
        switch(calories) {
            case '<500':
                setCalories('<1000');
                break;
            case '<1000':
                setCalories('<1500');
                break;
            case '<1500':
                setCalories('<2000');
                break;
            case '<2000':
                setCalories('<2500');
                break;
            case '<2500':
                setCalories('<500');
                break;
        }
    }

    const changeNutriscore = () => {
        switch(nutriscore) {
            case 'A':
                setNutriscore('B');
                break;
            case 'B':
                setNutriscore('C');
                break;
            case 'C':
                setNutriscore('D');
                break;
            case 'D':
                setNutriscore('E');
                break;
            case 'E':
                setNutriscore('A');
                break;
        }
    }

    const changeNovascore = () => {
        switch(novascore) {
            case '1':
                setNovascore('2');
                break;
            case '2':
                setNovascore('3');
                break;
            case '3':
                setNovascore('4');
                break;
            case '4':
                setNovascore('1');
                break;
        }
    }
    // <Image src={require("@/public/images/logo.svg")} alt="Nutritionist" width={188} height={105} className={`${styles.logo}`}/>
    return (
        <div className={styles.wrapper}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                <input className={`${styles.searchBar}`} type="text" placeholder="Caută produse..." />
                <div className={`${styles.categories}`}>
                    <div className={`${styles.calories}`} onClick={changeCalories}>
                        <Image src={require("@/public/images/icons/cals.png")} className={styles.categoryImages}/>Calorii: {calories} <span style={{fontSize: '12px', margin: 0}}>kcal</span>
                    </div>
                    <div className={`${styles.nutriscore}`} onClick={changeNutriscore}>
                        <Image src={require("@/public/images/icons/nutri.png")} className={styles.categoryImages}/>Nutri-score: {nutriscore}
                    </div>
                    <div className={`${styles.novascore}`} onClick={changeNovascore}>
                        <Image src={require("@/public/images/icons/nova.png")} className={styles.categoryImages}/>NOVA-score: {novascore}
                    </div>
                </div>
            </div>
            <div className={styles.cont}>
                <Image src={require("@/public/images/icons/cont.png")} width={50} style={{width: '15px', height: 'auto', marginTop: '2px', marginRight: '2px'}}/>
                <span>Cont</span>
            </div>
        </div>
    );
}