import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("transactions_pkey", ["transactionId"], { unique: true })
@Entity("transactions", { schema: "public" })
export class Transactions {
  @PrimaryGeneratedColumn({ type: "integer", name: "transaction_id" })
  transactionId: number;

  @Column("integer", { name: "client_id", nullable: true })
  clientId: number | null;

  @Column("timestamp without time zone", {
    name: "transaction_date",
    nullable: true,
  })
  transactionDate: Date | null;
}
