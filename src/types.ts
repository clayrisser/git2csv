export interface Author {
  name: string;
  email: string;
}

export interface Commit {
  hash: string;
  date: Date;
  message: string;
  author: Author;
}
