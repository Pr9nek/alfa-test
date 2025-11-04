import type { Product } from "../../store/useProductsStore";
import ProductsClient from "../../components/ProductsClient";
const API = 'https://dummyjson.com/products?limit=100';

// Тип для полной полезной нагрузки от DummyJSON
type DummyJsonPayload = {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
};

export default async function ProductsPage() {
    let initialProducts: Product[] = [];
    
    try {
        const res = await fetch(API, { cache: 'no-store' });
        if (res.ok) {
            const payload: DummyJsonPayload = await res.json(); 
            
            const data = Array.isArray(payload.products) ? payload.products : [];
            
            // Нормализация данных (как в сторе, но на сервере)
            initialProducts = data.map((p) => ({
                id: p.id,
                title: p.title,
                description: p.description,
                price: typeof p.price === 'number' ? p.price : undefined,
                image: p.thumbnail || (Array.isArray(p.images) && p.images[0]) || undefined,
                category: p.category,
            }));
        }
    } catch (e) {
        console.error('Server fetch failed:', e);
    }

    // Передаем загруженные данные клиентскому компоненту
    return <ProductsClient initialProducts={initialProducts} />;  
  }