import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Orders } from "./Orders";

@Index("customers_pkey", ["customerId"], { unique: true })
@Entity("customers", { schema: "public" })
export class Customers {
  @PrimaryGeneratedColumn({ type: "integer", name: "customer_id" })
  customerId: number;

  @Column("character varying", {
    name: "customer_name",
    nullable: true,
    length: 255,
  })
  customerName: string | null;

  @OneToMany(() => Orders, (orders) => orders.customer)
  orders: Orders[];
}
