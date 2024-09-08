import { Users } from './pg_schema/entities/Users'
import { dataSource } from './config'

async function main() {
  await dataSource.initialize()
    .then(() => console.log("Data Source has been initialized!"))
    .catch((err) => {
      console.error("Error during Data Source initialization", err)
    })
  const userRepository = dataSource.getRepository(Users)
  const users = await userRepository.save({
    username: 'TEST',
    email: 'TEST',
    password: 'TEST'
  });
  console.log(users)

}
main()