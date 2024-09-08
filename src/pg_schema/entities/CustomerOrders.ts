import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("customer_orders_pkey", ["id"], { unique: true })
@Entity("customer_orders", { schema: "public" })
export class CustomerOrders {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "customer_id", nullable: true })
  customerId: number | null;

  @Column("date", { name: "order_date", nullable: true })
  orderDate: string | null;

  @Column("integer", { name: "order_amount", nullable: true })
  orderAmount: number | null;
}
