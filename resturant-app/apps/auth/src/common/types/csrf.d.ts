// csrf.d.ts
import 'express';

declare module 'express' {
  interface Request {
    csrfToken: () => string;
  }
}
