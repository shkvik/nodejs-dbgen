import { Presets, SingleBar } from "cli-progress";
import { DataSource, Repository } from "typeorm";
import { Departments } from "./pg_schema/entities/Departments";
import { faker } from "@faker-js/faker";
import { Teams } from "./pg_schema/entities/Teams";
import { Employees } from "./pg_schema/entities/Employees";
import { Customers } from "./pg_schema/entities/Customers";
import { Orders } from "./pg_schema/entities/Orders";
import { Transactions } from "./pg_schema/entities/Transactions";
import { StudentGrades } from "./pg_schema/entities/StudentGrades";
import { Responses } from "./pg_schema/entities/Responses";
import { SalesReps } from "./pg_schema/entities/SalesReps";
import { Movies } from "./pg_schema/entities/Movies";
import { Purchases } from "./pg_schema/entities/Purchases";
import { Products } from "./pg_schema/entities/Products";
import { Projects } from "./pg_schema/entities/Projects";
import { Salaries } from "./pg_schema/entities/Salaries";
import { ProductPrices } from "./pg_schema/entities/ProductPrices";
import { OrderStatuses } from "./pg_schema/entities/OrderStatuses";
import { ProjectStages } from "./pg_schema/entities/ProjectStages";
import { DailySales } from "./pg_schema/entities/DailySales";
import { UserVisits } from "./pg_schema/entities/UserVisits";
import { MonthlySales } from "./pg_schema/entities/MonthlySales";
import { CustomerOrders } from "./pg_schema/entities/CustomerOrders";
import { ProductRevenue } from "./pg_schema/entities/ProductRevenue";
import { EmployeeSales } from "./pg_schema/entities/EmployeeSales";
import { EmployeePerformance } from "./pg_schema/entities/EmployeePerformance";
import { Authors } from "./pg_schema/entities/Authors";
import { Books } from "./pg_schema/entities/Books";
import { Students } from "./pg_schema/entities/Students";
import { Courses } from "./pg_schema/entities/Courses";
import { readFileSync } from 'fs';
import { join } from 'path';
import { TablesConfig } from "./config";

type DeepStructure<T> = T | (T extends Array<infer U> ? DeepStructure<U>[]
  : T extends Map<infer K, infer V> ? Map<DeepStructure<K>, DeepStructure<V>>
  : T extends Set<infer M> ? Set<DeepStructure<M>> : T extends object ? {
    [K in keyof T]?: DeepStructure<T[K]>;
  } : T);


type DeepCallbacks<T> = {
  [K in keyof Omit<T, 'id'>]?: (...args: any[]) => DeepStructure<T[K]>;
}


function CreateTableMethod() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const tableMethods = Reflect.getMetadata('tableMethods', target) || [];
    const originalMethod = descriptor.value;

    descriptor.value = function (target, ...args: any[]) {
      return originalMethod.apply(target, args);
    };
    
    tableMethods.push(descriptor.value);
    Reflect.defineMetadata('tableMethods', tableMethods, target);
    return descriptor;
  }
}


export class Generator {
  private readonly dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [__dirname + '/pg_schema/entities/*{.ts,.js}'],
    logging: false,
  });
  private readonly config = TablesConfig.getConfig();

  constructor(
    private readonly minPrimarySize: number = 100,
    private readonly minSecondarySize: number = 10,
  ) { }

  public async run() {
    await this.dataSource.initialize();

    await this.deleteSchema();
    await this.createSchema();

    await this.callTableMethods();
  }

  private async deleteSchema(): Promise<void> {
    await this.dataSource.query(readFileSync(join('sql/delete-schema.sql'), 'utf-8'));
    await this.dataSource.query(`VACUUM FULL`);
  }

  private async createSchema(): Promise<void> {
    await this.dataSource.query(readFileSync(join('sql/create-schema.sql'), 'utf-8'));
  }

  private async callTableMethods(){
    const methods: Array<(...args: any[]) => Promise<any>> = Reflect
      .getMetadata('tableMethods', Generator.prototype) || [];
    const uploadingBar = new SingleBar({
      format: `progress |{bar}| {percentage}% | tables created {value}/{total}`,
    }, Presets.legacy);
    uploadingBar.start(methods.length, 0);
    for(const method of methods){
      await method(this);
      uploadingBar.increment();
    }
    uploadingBar.stop();
  }

  @CreateTableMethod()
  private async createEmployeesDepartmentsTeams(
    employeesSize: number = this.config.employees || this.minPrimarySize,
    departmentsSize: number = this.config.departments || this.minSecondarySize,
    teamsSize: number = this.config.teams || this.minSecondarySize,
  ): Promise<Employees[]> {
    const departments = await this.createEntity(Departments)(teamsSize)({
      departmentName: () => faker.person.jobType(),
    });
    const teams = await this.createEntity(Teams)(departmentsSize)({
      teamName: () => faker.person.jobArea()
    });
    return this.createEntity(Employees)(employeesSize)({
      department_2: () => faker.helpers.arrayElement(departments),
      department: () => faker.person.jobType(),
      salary: () => faker.number.int({ min: 1500, max: 10000, multipleOf: 50 }),
      name: () => faker.person.firstName(),
      team: () => faker.helpers.arrayElement(teams)
    });
  }

  @CreateTableMethod()
  private async createOrdersAndCustomers(
    ordersSize: number = this.config.orders || this.minPrimarySize,
    customersSize: number = this.config.customers || this.minSecondarySize
  ): Promise<Orders[]> {
    const customers = await this.createEntity(Customers)(customersSize)({
      customerName: () => faker.person.fullName(),
    });
    return this.createEntity(Orders)(ordersSize)({
      amount: () => faker.number.int({ min: 0, max: 300, multipleOf: 10 }),
      customer: () => faker.helpers.arrayElement(customers),
      orderDate: () => faker.date.between({
        from: '2020-01-01T00:00:00.000Z',
        to: '2023-01-01T00:00:00.000Z'
      }),
    });
  }

  @CreateTableMethod()
  private async createBooksAndAuthors(
    booksSize: number = this.config.books || this.minPrimarySize,
    authorsSize: number = this.config.authors || this.minSecondarySize
  ): Promise<Books[]> {
    const authors = await this.createEntity(Authors)(authorsSize)({
      authorName: () => faker.person.firstName(),
    });
    return this.createEntity(Books)(booksSize)({
      author: () => faker.helpers.arrayElement(authors),
      bookTitle: () => faker.hacker.phrase()
    });
  }

  @CreateTableMethod()
  private async createCoursesAndStudents(
    coursesSize: number = this.config.courses || this.minPrimarySize,
    studentsSize: number = this.config.students || this.minSecondarySize
  ): Promise<Courses[]> {
    const students = await this.createEntity(Students)(studentsSize)({
      studentName: () => faker.person.firstName(),
    });
    return this.createEntity(Courses)(coursesSize)({
      student: () => faker.helpers.arrayElement([...students, null]),
      courseName: () => faker.lorem.sentence(4)
    });
  }

  @CreateTableMethod()
  private async createTransactions(
    size: number = this.config.transactions || this.minPrimarySize
  ): Promise<Transactions[]> {
    return this.createEntity(Transactions)(size)({
      clientId: () => faker.number.int({ min: 0, max: 10 }),
      transactionDate: () => faker.date.between({
        from: '2020-01-01T00:00:00.000Z',
        to: '2023-01-01T00:00:00.000Z'
      }),
    });
  }

  @CreateTableMethod()
  private async createStudentGrades(
    size: number = this.config.student_grades || this.minPrimarySize
  ): Promise<StudentGrades[]> {
    return this.createEntity(StudentGrades)(size)({
      studentId: () => faker.number.int({ min: 0, max: 50 }),
      courseId: () => faker.number.int({ min: 0, max: 10 }),
      grade: () => faker.number.int({ min: 0, max: 100 }),
    });
  }

  @CreateTableMethod()
  private async createResponses(
    size: number = this.config.responses || this.minPrimarySize
  ): Promise<Responses[]> {
    return this.createEntity(Responses)(size)({
      employeeId: () => faker.number.int({ min: 0, max: 50 }),
      responseTime: () => faker.number.int({ min: 0, max: 100, multipleOf: 10 }),
    });
  }

  @CreateTableMethod()
  private async createSalesReps(
    size: number = this.config.sales_reps || this.minPrimarySize
  ): Promise<SalesReps[]> {
    return this.createEntity(SalesReps)(size)({
      salesCount: () => faker.number.int({ min: 0, max: 1000 }),
      month: () => faker.date.between({
        from: '2020-01-01T00:00:00.000Z',
        to: '2020-06-01T00:00:00.000Z'
      }).toDateString()
    });
  }

  @CreateTableMethod()
  private async createMovies(
    size: number = this.config.movies || this.minPrimarySize
  ): Promise<Movies[]> {
    return this.createEntity(Movies)(size)({
      genre: () => faker.music.genre(),
      rating: () => faker.number.float({ min: 0, max: 9.9, fractionDigits: 1 }).toFixed(1)
    });
  }

  @CreateTableMethod()
  private async createPurchases(
    size: number = this.config.purchases || this.minPrimarySize 
  ): Promise<Purchases[]> {
    return this.createEntity(Purchases)(size)({
      clientId: () => faker.number.int({ min: 0, max: 10 }),
      categoryId: () => faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E']),
      purchaseAmount: () => faker.number.int({ min: 0, max: 1000 })
    });
  }

  @CreateTableMethod()
  private async createProducts(
    size: number = this.config.products || this.minPrimarySize
  ): Promise<Products[]> {
    return this.createEntity(Products)(size)({
      productId: () => faker.number.int({ min: 0, max: 50 }),
      sales: () => faker.number.int({ min: 0, max: 5000, multipleOf: 100 })
    });
  }

  @CreateTableMethod()
  private async createProjects(
    size: number = this.config.projects || this.minPrimarySize
  ): Promise<Projects[]> {
    return this.createEntity(Projects)(size)({
      budget: () => faker.number.int({ min: 0, max: 100_000, multipleOf: 1000 })
    });
  }

  @CreateTableMethod()
  private async createSalaries(
    size: number = this.config.salaries || this.minPrimarySize
  ): Promise<Salaries[]> {
    return this.createEntity(Salaries)(size)({
      employeeId: () => faker.number.int({ min: 0, max: 5 }),
      salary: () => faker.number.int({ min: 2000, max: 10000, multipleOf: 100 }),
      month: () => faker.date.between({
        from: '2020-01-01T00:00:00.000Z',
        to: '2020-06-01T00:00:00.000Z'
      }).toDateString()
    });
  }

  @CreateTableMethod()
  private async createProductPrices(
    size: number = this.config.product_prices || this.minPrimarySize
  ): Promise<ProductPrices[]> {
    return this.createEntity(ProductPrices)(size)({
      productId: () => faker.number.int({ min: 0, max: 10 }),
      price: () => faker.number.int({ min: 0, max: 500, multipleOf: 10 }),
      date: () => faker.date.between({
        from: '2020-01-01T00:00:00.000Z',
        to: '2020-06-01T00:00:00.000Z'
      }).toDateString(),
    });
  }

  @CreateTableMethod()
  private async createOrderStatuses(
    size: number = this.config.order_statuses || this.minPrimarySize
  ): Promise<OrderStatuses[]> {
    return this.createEntity(OrderStatuses)(size)({
      status: () => faker.helpers.arrayElement(['Shipped', 'Delivered', 'Pending']),
      orderId: () => faker.number.int({ min: 0, max: 10 }),
      statusDate: () => faker.date.between({
        from: '2020-01-01T00:00:00.000Z',
        to: '2020-06-01T00:00:00.000Z'
      }).toDateString(),
    });
  }

  @CreateTableMethod()
  private async createProjectStages(
    size: number = this.config.project_stages || this.minPrimarySize
  ): Promise<ProjectStages[]> {
    return this.createEntity(ProjectStages)(size)({
      projectId: () => faker.number.int({ min: 0, max: 5 }),
      stage: () => faker.helpers.arrayElement(['Planning', 'Execution', 'Review']),
      startDate: () => faker.date.between({
        from: '2020-01-01T00:00:00.000Z',
        to: '2020-06-01T00:00:00.000Z'
      }).toDateString(),
    });
  }

  @CreateTableMethod()
  private async createDailySales(
    size: number = this.config.daily_sales || this.minPrimarySize
  ): Promise<DailySales[]> {
    return this.createEntity(DailySales)(size)({
      sales: () => faker.number.int({ min: 0, max: 500, multipleOf: 10 }),
      date: () => faker.date.between({
        from: '2020-01-01T00:00:00.000Z',
        to: '2020-06-01T00:00:00.000Z'
      }).toDateString(),
    });
  }

  @CreateTableMethod()
  private async createUserVisits(
    size: number = this.config.user_visits || this.minPrimarySize
  ): Promise<UserVisits[]> {
    return this.createEntity(UserVisits)(size)({
      userId: () => faker.number.int({ min: 0, max: 5 }),
      visitCount: () => faker.number.int({ min: 0, max: 10 }),
      visitDate: () => faker.date.between({
        from: '2020-01-01T00:00:00.000Z',
        to: '2020-06-01T00:00:00.000Z'
      }).toDateString(),
    });
  }

  @CreateTableMethod()
  private async createMonthlySales(
    size: number = this.config.monthly_sales || this.minPrimarySize
  ): Promise<MonthlySales[]> {
    return this.createEntity(MonthlySales)(size)({
      region: () => faker.helpers.arrayElement(['North', 'South ', 'West', 'East']),
      sales: () => faker.number.int({ min: 0, max: 2000, multipleOf: 10 }),
      month: () => faker.date.between({
        from: '2020-01-01T00:00:00.000Z',
        to: '2020-06-01T00:00:00.000Z'
      }).toDateString(),
    });
  }

  @CreateTableMethod()
  private async createCustomerOrders(
    size: number = this.config.customer_orders || this.minPrimarySize
  ): Promise<CustomerOrders[]> {
    return this.createEntity(CustomerOrders)(size)({
      customerId: () => faker.number.int({ min: 0, max: 10 }),
      orderAmount: () => faker.number.int({ min: 0, max: 500, multipleOf: 10 }),
      orderDate: () => faker.date.between({
        from: '2020-01-01T00:00:00.000Z',
        to: '2020-06-01T00:00:00.000Z'
      }).toDateString(),
    });
  }

  @CreateTableMethod()
  private async createProductRevenue(
    size: number = this.config.product_revenue || this.minPrimarySize
  ): Promise<ProductRevenue[]> {
    return this.createEntity(ProductRevenue)(size)({
      productId: () => faker.number.int({ min: 0, max: 10 }),
      revenueAmount: () => faker.number.int({ min: 100, max: 800, multipleOf: 100 }),
      revenueDate: () => faker.date.between({
        from: '2020-01-01T00:00:00.000Z',
        to: '2020-06-01T00:00:00.000Z'
      }).toDateString(),
    });
  }

  @CreateTableMethod()
  private async createEmployeeSales(
    size: number = this.config.employee_sales || this.minPrimarySize
  ): Promise<EmployeeSales[]> {
    return this.createEntity(EmployeeSales)(size)({
      employeeId: () => faker.number.int({ min: 0, max: 10 }),
      salesAmount: () => faker.number.int({ min: 2000, max: 8000, multipleOf: 100 }),
      salesMonth: () => faker.date.between({
        from: '2020-01-01T00:00:00.000Z',
        to: '2020-01-01T00:00:00.000Z'
      }).toDateString(),
    });
  }

  @CreateTableMethod()
  private async createEmployeePerformance(
    size: number = this.config.employee_performance || this.minPrimarySize
  ): Promise<EmployeePerformance[]> {
    return this.createEntity(EmployeePerformance)(size)({
      employeeId: () => faker.number.int({ min: 0, max: 10 }),
      tasksCompleted: () => faker.number.int({ min: 10, max: 20 }),
    });
  }

  private createEntity<Entity>(targetEntity: new () => Entity) {
    return (length: number) => {
      return async (entityCallbacks: DeepCallbacks<Entity>) => {
        const limit = 1000;
        const repository = this.dataSource.getRepository(targetEntity);
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
          }
        }
        const results = await Promise.all(
          raws.map(async (raw) => repository.save(raw))
        );
        return results.flat();
      }
    }
  }
}