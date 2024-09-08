import { Users } from './pg_schema/entities/Users'
import { dataSource } from './config'
import { faker } from '@faker-js/faker';
import { DataSource, DeepPartial, Entity, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { Sales } from './pg_schema/entities/Sales';

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
  return function (dataSource: DataSource) {
    return async function createFakeSales(entityCallbacks: DeepCallbacks<Entity>) {
      const repository = dataSource.getRepository(targetEntity);
      const raws = new Array(1000)
        .fill(null)
        .map(() => new Array<Entity>(1000));

      for (let i = 0; i < 1000; i++) {
        for (let j = 0; j < 1000; j++) {
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
      for (const sale of raws) {
        await repository.save(sale);
      }
    }
  }
}




async function main() {
  await dataSource.initialize()
    .then(() => console.log("Data Source has been initialized!"))
    .catch((err) => {
      console.error("Error during Data Source initialization", err)
    });

  const userRepository = dataSource.getRepository(Users)

  const fakeSales = await createEntity(Sales)(dataSource)({
    amount: faker.number.int.bind(null, { min: 0, max: 1_000_000 }),
    productId: faker.number.int.bind(null, { min: 1, max: 100 }),
    saleDate: faker.date.between.bind(null, { from: '2020-01-01T00:00:00.000Z', to: '2023-01-01T00:00:00.000Z' }),
  });
  // const fakeUsres = createTestUsers(userRepository);

  // for(const usresChunk of fakeUsres){
  //   await userRepository.save(usresChunk);
  // }

  console.log('users')

}
main()