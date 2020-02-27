import fs from 'fs-extra';
import path from 'path';
import { Command } from '@oclif/command';
import { createInterface } from 'readline';
import git2Csv from '.';

const logger = console;

export default class Git2Csv extends Command {
  static description = 'generate csv from git commits';

  static examples = ['$ git log | git2csv commits.csv'];

  static flags = {};

  static args = [{ name: 'OUTPUT', required: true }];

  async run() {
    const { args } = this.parse(Git2Csv);
    const readline = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });
    const outputPath = path.resolve(args.OUTPUT);
    const input = (
      await new Promise<string[]>((resolve, reject) => {
        const lines: string[] = [];
        readline.on('line', (line: string) => lines.push(line));
        readline.on('close', () => resolve(lines));
        readline.on('error', reject);
      })
    ).join('\n');
    await fs.writeFile(outputPath, git2Csv(`${input}\n`));
    logger.info(`created ${outputPath}`);
  }
}
