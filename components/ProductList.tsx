// 'use client';

// import { useEffect } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useProductsStore } from '../store/useProductsStore';
// import { useMounted } from '../hooks/useMounted';
// import styles from '../styles/TestProducts.module.css';

// export function ProductList() {
//   const mounted = useMounted();

//   const state = useProductsStore(s => ({
//     products: s.products,
//     visible: s.getVisibleProducts(),
//     fetchProducts: s.fetchAndSetProducts,
//   }));

//   useEffect(() => {
//     if (!mounted && state.products.length === 0) {
//       state.fetchProducts();
//     }
//   }, [mounted, state.products.length, state.fetchProducts]);

//   if (!mounted) {
//     return <div className={styles.loading}>Loading...</div>;
//   }

//   return (
//     <div className={styles.grid}>
//       {state.visible.map(product => (
//         <article key={product.id} className={styles.card}>
//           <Link href={`/products/${product.id}`}>
//             <div className={styles.media}>
//               {product.image ? (
//                 <Image src={product.image} alt={product.title} />
//               ) : (
//                 <div className={styles.placeholder}>No image</div>
//               )}
//             </div>
//             <div className={styles.content}>
//               <h3>{product.title}</h3>
//               <p>{product.description}</p>
//             </div>
//           </Link>
//         </article>
//       ))}
//     </div>
//   );
// }

// export default ProductList;