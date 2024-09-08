import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Students } from "./Students";

@Index("cources_pkey", ["courceId"], { unique: true })
@Entity("cources", { schema: "public" })
export class Cources {
  @PrimaryGeneratedColumn({ type: "integer", name: "cource_id" })
  courceId: number;

  @Column("character varying", {
    name: "cource_name",
    nullable: true,
    length: 255,
  })
  courceName: string | null;

  @ManyToOne(() => Students, (students) => students.cources, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "student_id", referencedColumnName: "studentId" }])
  student: Students;
}
