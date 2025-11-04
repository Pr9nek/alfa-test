import styles from '../../../styles/ProductDetail.module.css';
import ProductDetailComponent from '@/components/ProductDetailComponent';

export default async function ProductDetail({params}: {params: {id: string}}) {
  const { id } = await params;

  return (
    <div className={styles.page}>
      <ProductDetailComponent productId={id} /> 
    </div>
  );
}
