import { Users } from './pg_schema/entities/Users'
import { dataSource } from './config'
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';

function createTestUsers(userRepository: Repository<Users>) {
  const result = new Array(1000)
    .fill(null)
    .map(() => new Array<Users>(1000));

  for (let i = 0; i < 1000; i++) {
    for(let j = 0; j < 1000; j++){
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


async function main() {
  await dataSource.initialize()
    .then(() => console.log("Data Source has been initialized!"))
    .catch((err) => {
      console.error("Error during Data Source initialization", err)
    });
  
  const userRepository = dataSource.getRepository(Users)
  
  const fakeUsres = createTestUsers(userRepository);

  for(const usresChunk of fakeUsres){
    await userRepository.save(usresChunk);
  }

  console.log('users')

}
main()