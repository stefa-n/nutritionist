import { useState, useEffect } from 'react';
import Card from '../Card';
import styles from '../styles/Submissions.module.css';

const Submissions = () => {
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            const accessToken = localStorage.getItem('access_token');
            const response = await fetch(`/api/submissions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessToken }),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch submissions');
            }
            const data = await response.json();
            setSubmissions(data);
        };
        fetchSubmissions();
    }, []);

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', maxWidth: '1000px'}}>
            <p style={{width: '100%', float: 'left'}}>My Submissions</p>
            <div className={styles.submissions}>
                {submissions.map((product) => (
                    <div key={product.id}>
                        <Card barcode={product.barcode} key={product.id} brand={product.brand} name={product.product_name} image={product.image} calories={product.kcal} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Submissions;
