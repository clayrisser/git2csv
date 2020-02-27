import { handle } from '@oclif/errors';
import Git2Csv from './git2Csv';

(async () => {
  try {
    await Git2Csv.run();
  } catch (err) {
    handle(err);
    process.exit(1);
  }
})();
