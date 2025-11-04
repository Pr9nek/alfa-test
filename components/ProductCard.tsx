"use client";

import { useRouter } from "next/navigation";
import Image from "next/image"; // Импортируем компонент Image
import { Product, useProductsStore } from "../store/useProductsStore";
import styles from "../styles/ProductCard.module.css";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const toggleLike = useProductsStore((s) => s.toggleLike);
  const removeProduct = useProductsStore((s) => s.removeProduct);
  const isLiked = useProductsStore((s) => !!s.likes[String(product.id)]);

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    router.push(`/products/${product.id}`);
  };

  const imageUrl = product.image as string | null | undefined;
  const finalImageUrl = imageUrl || "/placeholder-product.png";
  const isImageAvailable = !!product.image;

  return (
    <article className={styles.card} onClick={handleCardClick}>
      <div className={styles.media}>
        {isImageAvailable ? (
          // Используем Next.js Image Component
          // fill={true} заставляет изображение заполнить родительский div.media,
          // который должен иметь position: relative и заданные размеры.
          <Image
            src={finalImageUrl}
            alt={product.title}
            fill={true}
            sizes="(max-width: 768px) 100vw, 33vw"
            className={styles.productImage}
          />
        ) : (
          <div className={styles.placeholder}>No image</div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.description}>{product.description}</p>
      </div>

      <div className={styles.actions}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(product.id);
          }}
          className={`${styles.iconButton} ${isLiked ? styles.liked : ""}`}
          aria-label="like"
        >
          ♥
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/products/${product.id}/edit`);
          }}
          className={styles.iconButton}
          aria-label="edit"
        >
          ✎
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            removeProduct(product.id);
          }}
          className={styles.iconButton}
          aria-label="delete"
        >
          🗑
        </button>
      </div>
    </article>
  );
}

