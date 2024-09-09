import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Courses } from "./Courses";

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

  @OneToMany(() => Courses, (courses) => courses.student)
  courses: Courses[];
}
