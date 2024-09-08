import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("movies_pkey", ["movieId"], { unique: true })
@Entity("movies", { schema: "public" })
export class Movies {
  @PrimaryGeneratedColumn({ type: "integer", name: "movie_id" })
  movieId: number;

  @Column("character varying", {
    name: "genre",
    nullable: true,
    length: 255,
    default: () => "NULL::character varying",
  })
  genre: string | null;

  @Column("numeric", {
    name: "rating",
    nullable: true,
    precision: 2,
    scale: 1,
    default: () => "NULL::numeric",
  })
  rating: string | null;
}
