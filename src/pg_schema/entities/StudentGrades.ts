import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("student_grades_pkey", ["id"], { unique: true })
@Entity("student_grades", { schema: "public" })
export class StudentGrades {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "student_id", nullable: true })
  studentId: number | null;

  @Column("integer", { name: "course_id", nullable: true })
  courseId: number | null;

  @Column("integer", { name: "grade", nullable: true })
  grade: number | null;
}
