import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("employee_performance_pkey", ["id"], { unique: true })
@Entity("employee_performance", { schema: "public" })
export class EmployeePerformance {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "employee_id", nullable: true })
  employeeId: number | null;

  @Column("integer", { name: "tasks_completed", nullable: true })
  tasksCompleted: number | null;
}
