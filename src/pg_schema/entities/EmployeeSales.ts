import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("employee_sales_pkey", ["id"], { unique: true })
@Entity("employee_sales", { schema: "public" })
export class EmployeeSales {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "employee_id", nullable: true })
  employeeId: number | null;

  @Column("date", { name: "sales_month", nullable: true })
  salesMonth: string | null;

  @Column("integer", { name: "sales_amount", nullable: true })
  salesAmount: number | null;
}
