import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("user_visits_pkey", ["id"], { unique: true })
@Entity("user_visits", { schema: "public" })
export class UserVisits {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "user_id", nullable: true })
  userId: number | null;

  @Column("date", { name: "visit_date", nullable: true })
  visitDate: string | null;

  @Column("integer", { name: "visit_count", nullable: true })
  visitCount: number | null;
}
