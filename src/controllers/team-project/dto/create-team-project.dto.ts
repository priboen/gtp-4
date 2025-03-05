import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTeamProjectDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
