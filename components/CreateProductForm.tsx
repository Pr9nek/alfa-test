"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProductsStore } from "../store/useProductsStore";
import styles from "../styles/CreateProduct.module.css";

export default function CreateProduct() {
const router = useRouter();
const addProduct = useProductsStore((s) => s.addProduct);
const [form, setForm] = useState({
title: "",
description: "",
price: "",
image: "",
});
const [error, setError] = useState("");

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();

if (!form.title.trim() || !form.description.trim()) {
    setError("Title and description are required");
    return;
}

addProduct({
    id: `new-${Date.now()}`,
    title: form.title.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    image: form.image.trim(),
    created: true,
});

router.push("/products");
};

return (
<div className={styles.page}>
    <h1>Create Product</h1>
    <form onSubmit={handleSubmit} className={styles.form}>
    <div className={styles.field}>
        <label>Title *</label>
        <input
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        required
        />
    </div>
    <div className={styles.field}>
        <label>Description *</label>
        <textarea
        value={form.description}
        onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
        }
        required
        />
    </div>
    <div className={styles.field}>
        <label>Price</label>
        <input
        type="number"
        value={form.price}
        onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
        />
    </div>
    <div className={styles.field}>
        <label>Image URL</label>
        <input
        type="url"
        value={form.image}
        onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
        />
    </div>
    {error && <div className={styles.error}>{error}</div>}
    <div className={styles.actions}>
        <button type="submit">Create</button>
        <button type="button" onClick={() => router.push("/products")}>
        Cancel
        </button>
    </div>
    </form>
</div>
);
}
