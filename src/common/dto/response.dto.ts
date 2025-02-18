import { BaseDto } from './base.dto';

export class ResponseDto<T = any> extends BaseDto {
  data: T;
  message: string;
  constructor(data: Partial<ResponseDto<T>>) {
    super(data);
    Object.assign(this, data);
  }
}
