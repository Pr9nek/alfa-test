import styles from '../styles/Loading.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <p className={styles.text}>Загрузка...</p>
    </div>
  );
}

