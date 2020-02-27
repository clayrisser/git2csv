import CSV from 'csv-string';
import { Commit } from './types';

export function parseGitLog(gitLog: string): Commit[] {
  const matches = gitLog.match(/(.+\n)+\n\s{4}((.+)\n)+/g);
  return (matches || []).reduce(
    (commits: Commit[], commit: string): Commit[] => {
      const dateString = commit.match(/Date:\s+(.+)/)?.[1];
      if (!dateString) return commits;
      const hash = commit.match(/commit ([^\s]+)/)?.[1];
      if (!hash) return commits;
      const authorName = commit.match(/Author: (.+) /)?.[1];
      if (!authorName) return commits;
      const authorEmail = commit.match(/Author: .+ <([^\s]+)>/)?.[1];
      if (!authorEmail) return commits;
      const message = commit.match(/\n{2}\s+((.|\s)+)/)?.[1];
      if (!message) return commits;
      commits.push({
        date: new Date(dateString),
        hash,
        message,
        author: {
          name: authorName,
          email: authorEmail
        }
      });
      return commits;
    },
    []
  );
}

export function commits2Csv(commits: Commit[]): string {
  return CSV.stringify([
    ['date', 'message', 'hash', 'authorName', 'authorEmail'],
    ...commits.reduce((lines: string[][], commit: Commit) => {
      const line = [
        commit.date.toUTCString(),
        commit.message,
        commit.hash,
        commit.author.name,
        commit.author.email
      ];
      lines.push(line);
      return lines;
    }, [])
  ]);
}

export default function git2Csv(gitLog: string): string {
  return commits2Csv(parseGitLog(gitLog));
}
