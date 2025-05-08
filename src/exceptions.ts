export class EntityAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EntityAlreadyExistsError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class EntityNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EntityAlreadyExistsError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
