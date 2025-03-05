import { IsNotEmpty, IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateEventsDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  date: Date;
}
