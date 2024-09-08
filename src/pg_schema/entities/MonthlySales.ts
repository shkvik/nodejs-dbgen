import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("monthly_sales_pkey", ["id"], { unique: true })
@Entity("monthly_sales", { schema: "public" })
export class MonthlySales {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "region",
    nullable: true,
    length: 255,
    default: () => "NULL::character varying",
  })
  region: string | null;

  @Column("date", { name: "month", nullable: true })
  month: string | null;

  @Column("integer", { name: "sales", nullable: true })
  sales: number | null;
}
