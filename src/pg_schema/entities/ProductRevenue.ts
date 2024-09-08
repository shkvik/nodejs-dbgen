import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("product_revenue_pkey", ["id"], { unique: true })
@Entity("product_revenue", { schema: "public" })
export class ProductRevenue {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "product_id", nullable: true })
  productId: number | null;

  @Column("date", { name: "revenue_date", nullable: true })
  revenueDate: string | null;

  @Column("integer", { name: "revenue_amount", nullable: true })
  revenueAmount: number | null;
}
