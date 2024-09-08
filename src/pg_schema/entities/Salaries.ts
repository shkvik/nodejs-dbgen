import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("salaries_pkey", ["id"], { unique: true })
@Entity("salaries", { schema: "public" })
export class Salaries {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "employee_id", nullable: true })
  employeeId: number | null;

  @Column("date", { name: "month", nullable: true })
  month: string | null;

  @Column("integer", { name: "salary", nullable: true })
  salary: number | null;
}
