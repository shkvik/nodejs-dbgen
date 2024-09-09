import { Presets, SingleBar } from "cli-progress";
import { DataSource } from "typeorm";
import { Departments } from "./pg_schema/entities/Departments";
import { faker } from "@faker-js/faker";
import { Teams } from "./pg_schema/entities/Teams";
import { Employees } from "./pg_schema/entities/Employees";

type DeepStructure<T> = T | (T extends Array<infer U> ? DeepStructure<U>[]
  : T extends Map<infer K, infer V> ? Map<DeepStructure<K>, DeepStructure<V>>
  : T extends Set<infer M> ? Set<DeepStructure<M>> : T extends object ? {
    [K in keyof T]?: DeepStructure<T[K]>;
  } : T);


type DeepCallbacks<T> = {
  [K in keyof Omit<T, 'id'>]?: (...args: any[]) => DeepStructure<T[K]>;
}

class Generator {
  private dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [__dirname + '/pg_schema/entities/*{.ts,.js}'],
    logging: false,
  });

  constructor(
    private readonly minimumPrimary: number,
    private readonly secondaryDenominator: number,
  ){

  }

  private async createEmployees(
    primarySize: number = this.minimumPrimary, 
    secondaryDenominator = this.secondaryDenominator
  ) {
    const secondarySize = Math.floor(primarySize/secondaryDenominator);

    const departments = await this.createEntity(Departments)(secondarySize)({
      departmentName: () => faker.person.jobType(),
    });
    const teams = await this.createEntity(Teams)(secondarySize)({
      teamName: () => faker.person.jobArea()
    });
    return this.createEntity(Employees)(primarySize)({
      department_2: () => faker.helpers.arrayElement(departments),
      department: () => faker.person.jobType(),
      salary: () => faker.number.int({ min: 0, max: 10000, multipleOf: 50 }),
      name: () => faker.person.firstName(),
      team: () => faker.helpers.arrayElement(teams)
    });
  }

  private createEntity<Entity>(targetEntity: new () => Entity) {
    return (length: number) => {
      return async (entityCallbacks: DeepCallbacks<Entity>) => {
        const limit = 1000;
        const barLimit = Math.ceil(length / limit);
        const creatingBar = new SingleBar({
          format: `Creating of ${targetEntity.name} | {bar} | {percentage}% || {value}/{total} Chunks`,
        }, Presets.legacy);
        creatingBar.start(barLimit, 0);
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
}