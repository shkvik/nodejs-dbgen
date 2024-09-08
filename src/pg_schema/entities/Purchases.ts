import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("purchases_pkey", ["purchaseId"], { unique: true })
@Entity("purchases", { schema: "public" })
export class Purchases {
  @PrimaryGeneratedColumn({ type: "integer", name: "purchase_id" })
  purchaseId: number;

  @Column("integer", { name: "client_id", nullable: true })
  clientId: number | null;

  @Column("character varying", {
    name: "category_id",
    nullable: true,
    length: 255,
  })
  categoryId: string | null;

  @Column("integer", { name: "purchase_amount", nullable: true })
  purchaseAmount: number | null;
}
