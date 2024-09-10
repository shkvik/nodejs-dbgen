import { Generator } from './generator';

(async () => {
  const gen = new Generator(50, 10);
  await gen.run();
})();