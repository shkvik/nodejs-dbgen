import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("project_stages_pkey", ["id"], { unique: true })
@Entity("project_stages", { schema: "public" })
export class ProjectStages {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "project_id", nullable: true })
  projectId: number | null;

  @Column("character varying", {
    name: "stage",
    nullable: true,
    length: 255,
    default: () => "NULL::character varying",
  })
  stage: string | null;

  @Column("date", { name: "start_date", nullable: true })
  startDate: string | null;
}
