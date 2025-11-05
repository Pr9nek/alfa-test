'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/Error.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Что-то пошло не так</h1>
        <p className={styles.message}>
          Произошла непредвиденная ошибка. Пожалуйста, попробуйте снова.
        </p>
        {error.message && (
          <p className={styles.errorDetails}>
            {error.message}
          </p>
        )}
        <div className={styles.actions}>
          <button onClick={reset} className={styles.button}>
            Попробовать снова
          </button>
          <Link href="/products" className={styles.link}>
            Вернуться к продуктам
          </Link>
        </div>
      </div>
    </div>
  );
}

