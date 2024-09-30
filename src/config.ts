import 'reflect-metadata';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';

function Field() {
  return function (target: any, propertyKey: string) {
    const fields = Reflect.getMetadata('fields', target) || [];
    fields.push(propertyKey);
    Reflect.defineMetadata('fields', fields, target);
  };
}

export class TablesConfig {

  @Field() users: number;
  @Field() sales: number;
  @Field() employees: number;
  @Field() departments: number;
  @Field() teams: number;
  @Field() orders: number;
  @Field() customers: number;
  @Field() books: number;
  @Field() authors: number;
  @Field() courses: number;
  @Field() students: number;
  @Field() transactions: number;
  @Field() student_grades: number;
  @Field() student_scores: number;
  @Field() responses: number;
  @Field() sales_reps: number;
  @Field() movies: number;
  @Field() purchases: number;
  @Field() products: number;
  @Field() projects: number;
  @Field() salaries: number;
  @Field() product_prices: number;
  @Field() order_statuses: number;
  @Field() project_stages: number;
  @Field() daily_sales: number;
  @Field() user_visits: number;
  @Field() monthly_sales: number;
  @Field() customer_orders: number;
  @Field() product_revenue: number;
  @Field() employee_sales: number;
  @Field() employee_projects: number;
  @Field() employee_performance: number;

  static [Symbol.hasInstance](instance: any): boolean {
    const fields = Reflect.getMetadata('fields', TablesConfig.prototype) || [];
    return fields.every(
      (field: string) => Object.hasOwn(instance, field)
        && Number.isInteger(instance[field])
        && instance[field] >= 0
    );
  }

  static getConfig(): TablesConfig {
    const config = load(readFileSync('config.yaml', 'utf8')) as TablesConfig;
    if(config instanceof TablesConfig){
      return config;
    }
    throw new Error(`config is not correct!`)
  }
}
