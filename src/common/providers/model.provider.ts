import { Events, Project, Task, TeamProject, User } from '../models';

export const userProvider = {
  provide: 'USER_REPOSITORY',
  useValue: User,
};

export const projectProvider = {
  provide: 'PROJECT_REPOSITORY',
  useValue: Project,
};

export const taskProvider = {
  provide: 'TASK_REPOSITORY',
  useValue: Task,
};

export const eventsProvider = {
  provide: 'EVENTS_REPOSITORY',
  useValue: Events,
};

export const teamProjectProvider = {
  provide: 'TEAM_PROJECT_REPOSITORY',
  useValue: TeamProject,
};
