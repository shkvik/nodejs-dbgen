import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Books } from "./Books";

@Index("authors_pkey", ["authorId"], { unique: true })
@Entity("authors", { schema: "public" })
export class Authors {
  @PrimaryGeneratedColumn({ type: "integer", name: "author_id" })
  authorId: number;

  @Column("character varying", {
    name: "author_name",
    nullable: true,
    length: 255,
  })
  authorName: string | null;

  @OneToMany(() => Books, (books) => books.author)
  books: Books[];
}
