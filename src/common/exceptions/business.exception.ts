export class BusinessException extends Error {
  constructor(
    message: string,
    readonly code = 'BAD_REQUEST',
    readonly httpStatus = 400,
  ) {
    super(message);
    this.name = new.target.name;
  }
}
