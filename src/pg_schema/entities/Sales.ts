import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("sales_pkey", ["id"], { unique: true })
@Entity("sales", { schema: "public" })
export class Sales {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "product_id", nullable: true })
  productId: number | null;

  @Column("timestamp without time zone", { name: "sale_date", nullable: true })
  saleDate: Date | null;

  @Column("integer", { name: "amount", nullable: true })
  amount: number | null;
}
