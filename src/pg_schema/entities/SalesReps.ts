import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("sales_reps_pkey", ["salesRepId"], { unique: true })
@Entity("sales_reps", { schema: "public" })
export class SalesReps {
  @PrimaryGeneratedColumn({ type: "integer", name: "sales_rep_id" })
  salesRepId: number;

  @Column("date", { name: "month", nullable: true })
  month: string | null;

  @Column("integer", { name: "sales_count", nullable: true })
  salesCount: number | null;
}
