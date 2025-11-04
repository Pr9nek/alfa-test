import styles from "../../styles/CreateProduct.module.css";
import CreateProductForm from "../../components/CreateProductForm";

export default function CreateProductPage() {
  return (
    <div className={styles.page}>
      <CreateProductForm />
    </div>
  );
}