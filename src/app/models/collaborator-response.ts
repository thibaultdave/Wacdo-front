import { Assignment } from './assignment';

export interface Collaborator {
      id: number;
      name: string;
      firstName: string;
      email: string;
      firstHireDate: string;
      admin: boolean;
      assignments: Assignment[];
}