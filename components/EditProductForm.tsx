"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/CreateProduct.module.css"
import { useProductsStore, Product } from "../store/useProductsStore";

export default function EditProductForm({ productId }: { productId: string }) {
const router = useRouter();

// Хуки Zustand
const getById = useProductsStore((s) => s.getById);
const editProduct = useProductsStore((s) => s.editProduct);
const upsertProduct = useProductsStore((s) => s.upsertProduct);

const product = getById(productId);

// const [initialProduct, setInitialProduct] = useState<Product | null>(product ?? null);
const [title, setTitle] = useState(product?.title || "");
const [description, setDescription] = useState(product?.description || "");
const [image, setImage] = useState(product?.image || "");
const [price, setPrice] = useState(
product?.price ? String(product.price) : ""
);
const [error, setError] = useState("");

if (!product) {
return <div>Product not found</div>;
}

const onSubmit = (e: React.FormEvent) => {
e.preventDefault();
if (!title.trim() || !description.trim()) {
    setError("Title and description are required");
    return;
}

const updated: Partial<Product> = {
    title: title.trim(),
    description: description.trim(),
    image: image.trim() || undefined,
    price: price ? Number(price) : undefined,
};

const original = getById(productId);
if (original) {
    editProduct(productId, updated);
} else {
    // Это условие срабатывает, если продукт был удален из стора 
    // между загрузкой страницы и сохранением. 
    // В реальном приложении здесь обычно нужна более строгая обработка ошибки.
    upsertProduct({
    id: productId,
    title: updated.title || "",
    description: updated.description || "",
    image: updated.image,
    price: updated.price,
    created: true,
    });
}

router.push(`/products/${productId}`);
};

return (
<form className={styles.form} onSubmit={onSubmit}>
    <label>
    Title*
    <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
    />
    </label>

    <label>
    Description*
    <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
    />
    </label>

    <label>
    Image URL
    <input value={image} onChange={(e) => setImage(e.target.value)} />
    </label>

    <label>
    Price
    <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
    />
    </label>

    {error && <div className={styles.error}>{error}</div>}

    <div className={styles.actions}>
    <button type="submit">Save</button>
    <button type="button" onClick={() => router.push(`/products/${productId}`)}>
        Cancel
    </button>
    </div>
</form>
);
}
