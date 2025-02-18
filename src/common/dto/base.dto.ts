export class BaseDto<T = any> {
  constructor(partial: T) {
    Object.assign(this, partial);
  }
}
