import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("product_prices_pkey", ["id"], { unique: true })
@Entity("product_prices", { schema: "public" })
export class ProductPrices {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "product_id", nullable: true })
  productId: number | null;

  @Column("date", { name: "date", nullable: true })
  date: string | null;

  @Column("integer", { name: "price", nullable: true })
  price: number | null;
}
