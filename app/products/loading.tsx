import styles from '../../styles/ProductsLoading.module.css';

export default function ProductsLoading() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Products</h1>
        <div className={styles.headerPlaceholder}></div>
      </header>
      <div className={styles.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={styles.skeletonCard}>
            <div className={styles.skeletonImage}></div>
            <div className={styles.skeletonContent}>
              <div className={styles.skeletonTitle}></div>
              <div className={styles.skeletonDescription}></div>
              <div className={styles.skeletonDescription}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

