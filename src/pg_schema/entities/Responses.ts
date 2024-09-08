import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("responses_pkey", ["id"], { unique: true })
@Entity("responses", { schema: "public" })
export class Responses {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "employee_id", nullable: true })
  employeeId: number | null;

  @Column("integer", { name: "response_time", nullable: true })
  responseTime: number | null;
}
