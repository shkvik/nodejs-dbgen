import { Users } from './pg_schema/entities/Users'
import { dataSource } from './config'
import { fa, faker } from '@faker-js/faker';
import { DataSource, DeepPartial, Entity, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { Sales } from './pg_schema/entities/Sales';
import { SingleBar, Presets } from 'cli-progress'
import { Employees } from './pg_schema/entities/Employees';
import { Departments } from './pg_schema/entities/Departments';
import { Teams } from './pg_schema/entities/Teams';
import { Orders } from './pg_schema/entities/Orders';
import { Customers } from './pg_schema/entities/Customers';
import { Transactions } from './pg_schema/entities/Transactions';
import { StudentGrades } from './pg_schema/entities/StudentGrades';
import { Students } from './pg_schema/entities/Students';
import { Responses } from './pg_schema/entities/Responses';
import { SalesReps } from './pg_schema/entities/SalesReps';
import { Movies } from './pg_schema/entities/Movies';
import { Purchases } from './pg_schema/entities/Purchases';
import { Products } from './pg_schema/entities/Products';
import { Projects } from './pg_schema/entities/Projects';
import { Salaries } from './pg_schema/entities/Salaries';

declare global {
  interface Function {
    bindNext(thisArg: any, ...argArray: any[]): any
  }
}

Function.prototype.bindNext = function (thisArg: any, ...argArray: any[]) {
  return this.bind(null, thisArg, ...argArray);
};


type DeepStructure<T> = T | (T extends Array<infer U> ? DeepStructure<U>[]
  : T extends Map<infer K, infer V> ? Map<DeepStructure<K>, DeepStructure<V>>
  : T extends Set<infer M> ? Set<DeepStructure<M>> : T extends object ? {
    [K in keyof T]?: DeepStructure<T[K]>;
  } : T);


type DeepCallbacks<T> = {
  [K in keyof Omit<T, 'id'>]?: (...args: any[]) => DeepStructure<T[K]>;
}


function createEntity<Entity>(targetEntity: new () => Entity) {
  return function (params: { dataSource: DataSource, length: number }) {
    return async function createFakeSales(entityCallbacks: DeepCallbacks<Entity>) {
      const limit = 1000;
      const { length } = params;
      const barLimit = Math.ceil(length / limit);
      const creatingBar = new SingleBar({
        format: `Creating of ${targetEntity.name} | {bar} | {percentage}% || {value}/{total} Chunks`,
      }, Presets.legacy);
      creatingBar.start(barLimit, 0);
      const repository = dataSource.getRepository(targetEntity);
      const raws = new Array(Math.ceil(length / limit)).fill(null).map(
        (_, index) => new Array<Entity>(
          (length / (index + 1)) > limit ? limit : length - (limit * index)
        )
      );
      for (let i = 0; i < raws.length; i++) {
        for (let j = 0; j < raws[i].length; j++) {
          let obj: Partial<Entity> = {};
          for (const key in entityCallbacks) {
            if (typeof entityCallbacks[key] === 'function') {
              obj[key as keyof Entity] = entityCallbacks[key]();
            }
          }
          const raw = repository.create(obj as Entity);
          raws[i][j] = raw;
          creatingBar.update(i + 1);
        }
      }
      creatingBar.stop();
      const uploadingBar = new SingleBar({
        format: `Uploading of ${targetEntity.name} | {bar} | {percentage}% || {value}/{total} Chunks`,
      }, Presets.legacy);
      uploadingBar.start(barLimit, 0);
      const result: Entity[] = [];
      const promises = raws.map(async (raw) => {
        const dbRaw = await repository.save(raw);
        result.push(...dbRaw);
        uploadingBar.increment();
      });
      await Promise.all(promises);
      uploadingBar.stop();
      return result;

    }
  }
}

async function createEmployees() {
  // const employees = dataSource.getRepository(Employees);
  // const teams = dataSource.getRepository(Teams);
  // const departments = dataSource.getRepository(Departments);

  const departments = await createEntity(Departments)({ dataSource, length: 10 })({
    departmentName: faker.person.jobType,
  });
  const teams = await createEntity(Teams)({ dataSource, length: 10 })({
    teamName: faker.person.jobArea
  });
  return createEntity(Employees)({ dataSource, length: 100 })({
    name: faker.person.firstName,
    department: faker.person.jobType,
    salary: faker.number.int.bindNext({ min: 0, max: 10000, multipleOf: 50 }),
    department_2: faker.helpers.arrayElement.bindNext(departments),
    team: faker.helpers.arrayElement.bindNext(teams)
  });
}

async function createOrdersAndCustomers() {
  const customers = await createEntity(Customers)({ dataSource, length: 10 })({
    customerName: faker.person.fullName,
  });

  return createEntity(Orders)({ dataSource, length: 100 })({
    amount: faker.number.int.bindNext({ min: 0, max: 300, multipleOf: 10 }),
    orderDate: faker.date.between.bindNext({ from: '2020-01-01T00:00:00.000Z', to: '2023-01-01T00:00:00.000Z' }),
    customer: faker.helpers.arrayElement.bindNext(customers),
  });
}

async function createTransactions() {
  return createEntity(Transactions)({ dataSource, length: 50 })({
    transactionDate: faker.date.between.bindNext({ from: '2020-01-01T00:00:00.000Z', to: '2023-01-01T00:00:00.000Z' }),
    clientId: faker.number.int.bindNext({ min: 0, max: 10 }),
  });
}

async function createStudentGrades() {
  return createEntity(StudentGrades)({ dataSource, length: 50 })({
    studentId: faker.number.int.bindNext({ min: 0, max: 50 }),
    courseId: faker.number.int.bindNext({ min: 0, max: 10 }),
    grade: faker.number.int.bindNext({ min: 0, max: 100 }),
  });
}

async function createResponses() {
  return createEntity(Responses)({ dataSource, length: 50 })({
    employeeId: faker.number.int.bindNext({ min: 0, max: 50 }),
    responseTime: faker.number.int.bindNext({ min: 0, max: 100, multipleOf: 10 }),
  });
}

async function createSalesReps() {
  return createEntity(SalesReps)({ dataSource, length: 50 })({
    salesCount: faker.number.int.bindNext({ min: 0, max: 1000 }),
    month: faker.date.between.bindNext({ from: '2020-01-01T00:00:00.000Z', to: '2020-06-01T00:00:00.000Z' })
  });
}

async function createMovies() {
  return createEntity(Movies)({ dataSource, length: 50 })({
    genre: () => faker.music.genre(),
    rating: () => String(faker.number.float({ min: 0, max: 10, fractionDigits: 1 }))
  });
}

async function createPurchases() {
  return createEntity(Purchases)({ dataSource, length: 50 })({
    clientId: () => faker.number.int({ min: 0, max: 10 }),
    categoryId: () => faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E']),
    purchaseAmount: () => faker.number.int({ min: 0, max: 1000 })
  });
}

async function createProducts() {
  return createEntity(Products)({ dataSource, length: 50 })({
    productId: () => faker.number.int({ min: 0, max: 50 }),
    sales: () => faker.number.int({ min: 0, max: 5000, multipleOf: 100 })
  });
}

async function createProjects() {
  return createEntity(Projects)({ dataSource, length: 50 })({
    budget: () => faker.number.int({ min: 0, max: 100_000, multipleOf: 1000 })
  });
}

async function createSalaries() {
  return createEntity(Salaries)({ dataSource, length: 50 })({
    employeeId: () => faker.number.int({ min: 0, max: 5 }),
    salary: () => faker.number.int({ min: 2000, max: 10000, multipleOf: 100 }),
    month: () => faker.date.between({ 
      from: '2020-01-01T00:00:00.000Z', 
      to: '2020-06-01T00:00:00.000Z'
    }).toDateString()
  });
}

async function main() {

  await dataSource.initialize()
    .then(() => console.log("Data Source has been initialized!"))
    .catch((err) => {
      console.error("Error during Data Source initialization", err)
    });


}
main()