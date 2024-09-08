import { Users } from './pg_schema/entities/Users'
import { dataSource } from './config'
import { faker } from '@faker-js/faker';
import { DataSource, DeepPartial, Entity, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { Sales } from './pg_schema/entities/Sales';
import { SingleBar, Presets } from 'cli-progress'

declare global {
  interface Function {
    bindNext(thisArg: any, ...argArray: any[]): any
  }
}

Function.prototype.bindNext = function (thisArg: any, ...argArray: any[]) {
  return this.bind(null, thisArg, ...argArray);
};

function createTestUsers(userRepository: Repository<Users>) {
  const result = new Array(1000)
    .fill(null)
    .map(() => new Array<Users>(1000));

  for (let i = 0; i < 1000; i++) {
    for (let j = 0; j < 1000; j++) {
      const user = userRepository.create({
        username: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      });
      result[i][j] = user;
    }
  }
  return result;
}

type DeepStructure<T> = T | (T extends Array<infer U> ? DeepStructure<U>[]
  : T extends Map<infer K, infer V> ? Map<DeepStructure<K>, DeepStructure<V>>
  : T extends Set<infer M> ? Set<DeepStructure<M>> : T extends object ? {
    [K in keyof T]?: DeepStructure<T[K]>;
  } : T);


type DeepCallbacks<T> = {
  [K in keyof Omit<T, 'id'>]: (...args: any[]) => DeepStructure<T[K]>;
}


function createEntity<Entity>(targetEntity: new () => Entity) {
  return function (params: { dataSource: DataSource, matrix: number }) {
    return async function createFakeSales(entityCallbacks: DeepCallbacks<Entity>) {
      const creatingBar = new SingleBar({
        format:  `Creating of ${targetEntity.name} | {bar} | {percentage}% || {value}/{total} Chunks`,
      }, Presets.legacy);
      creatingBar.start(params.matrix, 0);
      const repository = dataSource.getRepository(targetEntity);
      const raws = new Array(params.matrix).fill(null).map(
        () => new Array<Entity>(params.matrix)
      );
      for (let i = 0; i < params.matrix; i++) {
        for (let j = 0; j < params.matrix; j++) {
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
      const UploadingBar = new SingleBar({
        format:  `Uploading of ${targetEntity.name} | {bar} | {percentage}% || {value}/{total} Chunks`,
      }, Presets.legacy);
      UploadingBar.start(params.matrix, 0);
      const promises = raws.map(async (raw) => {
        await repository.save(raw);
        UploadingBar.increment();
      });
      await Promise.all(promises);
      UploadingBar.stop();
    }
  }
}




async function main() {

  await dataSource.initialize()
    .then(() => console.log("Data Source has been initialized!"))
    .catch((err) => {
      console.error("Error during Data Source initialization", err)
    });

  await createEntity(Sales)({ dataSource, matrix: 1000 })({
    amount: faker.number.int.bindNext({ min: 0, max: 1_000_000 }),
    productId: faker.number.int.bindNext({ min: 1, max: 100 }),
    saleDate: faker.date.between.bindNext({ from: '2020-01-01T00:00:00.000Z', to: '2023-01-01T00:00:00.000Z' }),
  });
  // const fakeUsres = createTestUsers(userRepository);

  // for(const usresChunk of fakeUsres){
  //   await userRepository.save(usresChunk);
  // }

  console.log('users')

}
main()