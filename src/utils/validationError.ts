export class ValidationError extends Error {
  errors: string[];

  constructor(errors: string[]) {
    super(errors.join(' '));
    this.errors = errors;
    this.name = 'ValidationError';
  }
}
