import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Employees } from "./Employees";

@Index("teams_pkey", ["teamId"], { unique: true })
@Entity("teams", { schema: "public" })
export class Teams {
  @PrimaryGeneratedColumn({ type: "integer", name: "team_id" })
  teamId: number;

  @Column("character varying", {
    name: "team_name",
    nullable: true,
    length: 255,
    default: () => "NULL::character varying",
  })
  teamName: string | null;

  @OneToMany(() => Employees, (employees) => employees.team)
  employees: Employees[];
}
