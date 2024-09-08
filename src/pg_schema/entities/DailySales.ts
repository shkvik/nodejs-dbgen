import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("daily_sales_pkey", ["id"], { unique: true })
@Entity("daily_sales", { schema: "public" })
export class DailySales {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("date", { name: "date", nullable: true })
  date: string | null;

  @Column("integer", { name: "sales", nullable: true })
  sales: number | null;
}
