import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("employee_projects_pkey", ["id"], { unique: true })
@Entity("employee_projects", { schema: "public" })
export class EmployeeProjects {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "employee_id", nullable: true })
  employeeId: number | null;

  @Column("integer", { name: "project_id", nullable: true })
  projectId: number | null;
}
