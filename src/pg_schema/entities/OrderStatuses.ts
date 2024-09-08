import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("order_statuses_pkey", ["id"], { unique: true })
@Entity("order_statuses", { schema: "public" })
export class OrderStatuses {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "order_id", nullable: true })
  orderId: number | null;

  @Column("character varying", {
    name: "status",
    nullable: true,
    length: 255,
    default: () => "NULL::character varying",
  })
  status: string | null;

  @Column("date", { name: "status_date", nullable: true })
  statusDate: string | null;
}
