"use client";

import { Product, useProductsStore } from "../store/useProductsStore";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard } from "../components/ProductCard";
import styles from "../styles/TestProducts.module.css";

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {

const [showFavorites, setShowFavorites] = useState(false);

// ИЗМЕНЕНИЕ: Добавлен флаг гидратации для всего компонента
const [isHydrated, setIsHydrated] = useState(false);

const {
setProducts, 
setPage, 
likes, 
page: currentPage, 
pageSize, 
products,
searchQuery,
setSearchQuery,
clearSearch,
filter,
setFilter,
clearFilter,
getFilteredProducts,
getTotalPages,
} = useProductsStore();

const [localCategory, setLocalCategory] = useState(filter.category || "");
const [localMinPrice, setLocalMinPrice] = useState(filter.minPrice?.toString() || "");
const [localMaxPrice, setLocalMaxPrice] = useState(filter.maxPrice?.toString() || "");

const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[];

useEffect(() => {
if (
    initialProducts.length > 0 &&
    useProductsStore.getState().products.length === 0
) {
    setProducts(initialProducts);
}
}, [initialProducts, setProducts]);

// ИЗМЕНЕНИЕ: Устанавливаем гидратацию после монтирования
// Используем requestAnimationFrame чтобы избежать синхронного setState
useEffect(() => {
    const raf = requestAnimationFrame(() => {
        setIsHydrated(true);
    });
    return () => cancelAnimationFrame(raf);
}, []);

const baseFiltered = getFilteredProducts();

const filtered = showFavorites
? baseFiltered.filter((p) => !!likes[String(p.id)])
: baseFiltered;

const totalPages = getTotalPages();
// const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

useEffect(() => {
if (currentPage > totalPages) setPage(totalPages);
}, [currentPage, totalPages, setPage]);

const start = (currentPage - 1) * pageSize;
const visible = filtered.slice(start, start + pageSize);

const handleApplyFilters = () => {
setFilter({
    category: localCategory || undefined,
    minPrice: localMinPrice ? parseFloat(localMinPrice) : undefined,
    maxPrice: localMaxPrice ? parseFloat(localMaxPrice) : undefined,
});
setPage(1);
};

const handleClearFilters = clearFilter;

// ИЗМЕНЕНИЕ: Если не гидратирован, показываем loading
if (!isHydrated) {
    return (
        <div className={styles.page}>
        <header className={styles.header}>
            <h1>Products</h1>
            <div className={styles.actions}>
            <Link href="/create-product" className={styles.createButton}>
                Create Product
            </Link>
            </div>
        </header>
        <div className={styles.loading}>Loading products...</div>
        </div>
    );
}

return (
<div className={styles.page}>
    <header className={styles.header}>
    <h1>Products</h1>
    <div className={styles.actions}>
        <Link href="/create-product" className={styles.createButton}>
        Create Product
        </Link>
        <div className={styles.filters}>
        <button
            onClick={() => {
            setShowFavorites(false);
            setPage(1);
            }}
            className={!showFavorites ? styles.active : ""}
        >
            All
        </button>
        <button
            onClick={() => {
            setShowFavorites(true);
            setPage(1);
            }}
            className={showFavorites ? styles.active : ""}
        >
            Favorites
        </button>
        </div>
    </div>
    </header>

    <div className={styles.searchBlock}>
    <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchInput}
    />
    {searchQuery && (
        <button
        onClick={clearSearch}
        className={styles.clearButton}
        >
        Clear Search
        </button>
    )}
    </div>

    <div className={styles.filterBlock}>
    <div className={styles.filterRow}>
        <select
        value={localCategory}
        onChange={(e) => setLocalCategory(e.target.value)}
        className={styles.filterSelect}
        >
        <option value="">All Categories</option>
        {categories.map((cat) => (
            <option key={cat} value={cat}>
            {cat}
            </option>
        ))}
        </select>

        <input
        type="number"
        placeholder="Min Price"
        value={localMinPrice}
        onChange={(e) => setLocalMinPrice(e.target.value)}
        className={styles.filterInput}
        />

        <input
        type="number"
        placeholder="Max Price"
        value={localMaxPrice}
        onChange={(e) => setLocalMaxPrice(e.target.value)}
        className={styles.filterInput}
        />

        <button
        onClick={handleApplyFilters}
        className={styles.applyButton}
        >
        Apply
        </button>

        <button
        onClick={handleClearFilters}
        className={styles.clearButton}
        >
        Clear Filters
        </button>
    </div>
    </div>

    {(searchQuery || filter.category || filter.minPrice || filter.maxPrice) && (
    <div className={styles.activeFilters}>
        <span>Active filters:</span>
        {searchQuery && <span className={styles.tag}>Search: {searchQuery}</span>}
        {filter.category && <span className={styles.tag}>Category: {filter.category}</span>}
        {filter.minPrice && <span className={styles.tag}>Min: ${filter.minPrice}</span>}
        {filter.maxPrice && <span className={styles.tag}>Max: ${filter.maxPrice}</span>}
    </div>
    )}

    <div className={styles.grid}>
    {visible.length === 0 && products.length === 0 ? (
        <div className={styles.loading}>Loading products...</div>
    ) : visible.length === 0 ? (
        <div className={styles.noResults}>No products found matching your criteria</div>
    ) : (
        visible.map((product) => (
        <ProductCard key={product.id} product={product} />
        ))
    )}
    </div>

    <footer className={styles.pager}>
    <button
        onClick={() => setPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
    >
        Prev
    </button>
    <span>
        {currentPage} / {totalPages}
    </span>
    <button
        onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
    >
        Next
    </button>
    </footer>
</div>
);
}