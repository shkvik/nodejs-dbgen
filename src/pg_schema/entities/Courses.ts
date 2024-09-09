import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Students } from "./Students";

@Index("courses_pkey", ["courseId"], { unique: true })
@Entity("courses", { schema: "public" })
export class Courses {
  @PrimaryGeneratedColumn({ type: "integer", name: "course_id" })
  courseId: number;

  @Column("character varying", {
    name: "course_name",
    nullable: true,
    length: 255,
  })
  courseName: string | null;

  @ManyToOne(() => Students, (students) => students.courses, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "student_id", referencedColumnName: "studentId" }])
  student: Students;
}
