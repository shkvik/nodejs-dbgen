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
  @Field() employee_performance: number;

  static [Symbol.hasInstance](instance: any) {
    const fields = Reflect.getMetadata('fields', TablesConfig.prototype) || [];
    return fields.every(
      (field: string) => Object.hasOwn(instance, field)
        && Number.isInteger(instance[field])
        && instance[field] >= 0
    );
  }
}


export const getConfig = () => {

  const fileContents = readFileSync('config.yaml', 'utf8');
  const config = load(fileContents) as TablesConfig;

  if(config instanceof TablesConfig){
    return config;
  } else {
    throw new Error('Incorrect config')
  }
}
