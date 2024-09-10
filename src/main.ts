import { Generator } from './generator';

(async () => {
  const gen = new Generator(100, 10);
  await gen.run();
})();