import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("products_pkey", ["id"], { unique: true })
@Entity("products", { schema: "public" })
export class Products {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "product_id", nullable: true })
  productId: number | null;

  @Column("character varying", {
    name: "name",
    nullable: true,
    length: 255,
    default: () => "NULL::character varying",
  })
  name: string | null;

  @Column("timestamp without time zone", { name: "sale_date", nullable: true })
  saleDate: Date | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("integer", { name: "price", nullable: true })
  price: number | null;

  @Column("integer", { name: "sales", nullable: true })
  sales: number | null;

  @Column("integer", { name: "stock", nullable: true, default: () => "0" })
  stock: number | null;

  @Column("integer", { name: "quantity", nullable: true, default: () => "0" })
  quantity: number | null;
}
