import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTeamProjectDto {
  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
