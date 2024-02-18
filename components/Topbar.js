import Image from "next/image";
import styles from "./styles/Topbar.module.css";

export default function Topbar() {
    return (
        <div className={styles.wrapper}>
            <Image src={require("@/public/images/logo.svg")} alt="Nutritionist" width={188} height={105} className={`${styles.logo}`}/>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                <input className={`${styles.searchBar}`} type="text" placeholder="Caută produse..." />
                <div className={`${styles.categories}`}>
                    <div className={`${styles.calories}`}>
                        <Image src={require("@/public/images/icons/cals.png")} width={50} style={{width: '15px', height: '15px', marginTop: '2px', marginRight: '2px'}}/> { `Calorii: <500` }<span style={{fontSize: '12px', margin: 0}}>kcal</span>
                    </div>
                    <div className={`${styles.nutriscore}`}>
                        <Image src={require("@/public/images/icons/nutri.png")} width={50} style={{width: '15px', height: '15px', marginTop: '2px', marginRight: '2px'}}/> { `Nutri-score: E` } 
                    </div>
                    <div className={`${styles.novascore}`}>
                        <Image src={require("@/public/images/icons/nova.png")} width={50} style={{width: '15px', height: '15px', marginTop: '2px', marginRight: '2px'}}/> { `NOVA-score: 2` } 
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
