import { Assignment } from './assignment-response';

export interface Collaborator {
      id: number;
      name: string;
      firstName: string;
      email: string;
      firstHireDate: string;
      admin: boolean;
      assignments: Assignment[];
}