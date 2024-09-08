import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Authors } from "./Authors";

@Index("books_pkey", ["bookId"], { unique: true })
@Entity("books", { schema: "public" })
export class Books {
  @PrimaryGeneratedColumn({ type: "integer", name: "book_id" })
  bookId: number;

  @Column("character varying", {
    name: "book_title",
    nullable: true,
    length: 255,
  })
  bookTitle: string | null;

  @ManyToOne(() => Authors, (authors) => authors.books, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "author_id", referencedColumnName: "authorId" }])
  author: Authors;
}
