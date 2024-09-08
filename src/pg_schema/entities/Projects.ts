import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("projects_pkey", ["projectId"], { unique: true })
@Entity("projects", { schema: "public" })
export class Projects {
  @PrimaryGeneratedColumn({ type: "integer", name: "project_id" })
  projectId: number;

  @Column("integer", { name: "budget", nullable: true })
  budget: number | null;
}
