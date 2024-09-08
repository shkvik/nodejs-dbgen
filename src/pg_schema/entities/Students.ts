import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cources } from "./Cources";

@Index("students_pkey", ["studentId"], { unique: true })
@Entity("students", { schema: "public" })
export class Students {
  @PrimaryGeneratedColumn({ type: "integer", name: "student_id" })
  studentId: number;

  @Column("character varying", {
    name: "student_name",
    nullable: true,
    length: 255,
  })
  studentName: string | null;

  @OneToMany(() => Cources, (cources) => cources.student)
  cources: Cources[];
}
