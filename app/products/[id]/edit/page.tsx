import styles from '../../../../styles/CreateProduct.module.css';
import EditProductForm from '../../../../components/EditProductForm'; 

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  if (!id) {
    return <div className={styles.page}>Invalid product id</div>;
  }

  return (
    <div className={styles.page}>
      <h1>Edit product</h1>
      <EditProductForm productId={id} />
    </div>
  );
}

