import { Assignment } from './assignment-response';

export interface Restaurant {
      id: number;
      name: string;
      address: string;
      postalCode: string;
      city: string;
      assignments: Assignment[];
}