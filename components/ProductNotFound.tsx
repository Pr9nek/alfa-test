import Link from 'next/link';
import styles from '../styles/ProductNotFound.module.css';

export default function ProductNotFound() {
    return (
        <div className={styles.container}>
        <div className={styles.content}>
            <h2 className={styles.title}>Продукт не найден</h2>
            <p className={styles.message}>
            Продукт, который вы ищете, не существует или был удалён.
            </p>
            <Link href="/products" className={styles.link}>
            Вернуться к списку продуктов
            </Link>
        </div>
        </div>
    );
}