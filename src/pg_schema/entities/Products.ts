import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("products_pkey", ["id"], { unique: true })
@Entity("products", { schema: "public" })
export class Products {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "product_id", nullable: true })
  productId: number | null;

  @Column("integer", { name: "sales", nullable: true })
  sales: number | null;
}
