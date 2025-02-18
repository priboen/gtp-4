import { User } from '../models';

export const userProvider = {
  provide: 'USER_REPOSITORY',
  useValue: User,
};
