import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("student_scores_pkey", ["id"], { unique: true })
@Entity("student_scores", { schema: "public" })
export class StudentScores {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "student_id", nullable: true })
  studentId: number | null;

  @Column("character varying", { name: "subject", nullable: true, length: 255 })
  subject: string | null;

  @Column("integer", { name: "score", nullable: true })
  score: number | null;
}
