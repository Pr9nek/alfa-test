"use client";

import Image from "next/image";
import { useProductsStore } from "../store/useProductsStore";
import styles from "../styles/ProductDetail.module.css";
import Link from "next/link"; 
import ProductNotFound from "./ProductNotFound";

export default function ProductDisplay({ productId }: { productId: string }) {
const product = useProductsStore((s) => s.getById(productId));

if (!product) {
return <ProductNotFound />;
}

const imageUrl = product.image as string | null | undefined;
const finalImageUrl = imageUrl || "/placeholder-product.png"; 

return (
<div className={styles.page}>
    <Link href="/products" className={styles.back}>
    ← Back to products
    </Link>

    <div className={styles.container}>
    <div className={styles.left}>
        <Image
        src={finalImageUrl}
        alt={product.title}
        fill={true} 
        className={styles.image} 
        sizes="(max-width: 768px) 100vw, 300px"
        />
    </div>

    <div className={styles.right}>
        <h1>{product.title}</h1>
        <p className={styles.desc}>{product.description}</p>
        {product.price && <p className={styles.price}>${product.price}</p>}
    </div>
    </div>
</div>
);
}
