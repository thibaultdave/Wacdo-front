import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Collaborators } from './pages/collaborators/collaborators';
import { CreateCollaborator } from './pages/create-collaborator/create-collaborator';
import { Restaurants } from './pages/restaurants/restaurants';
import { Jobs } from './pages/jobs/jobs';
import { Assignments } from './pages/assignments/assignments';
import { UpdateCollaborator } from './pages/update-collaborator/update-collaborator';

export const routes: Routes = [
  {
      path: '',
      component: Home,
  },
  {
      path: 'home',
      component: Home,
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'collaborators',
    component: Collaborators
  },
  {
    path: 'collaborators/new',
    component: CreateCollaborator
  },
  {
    path: 'collaborators/update/:id',
    component: UpdateCollaborator
  },
  {
      path: 'restaurants',
      component: Restaurants
  },
  {
    path: 'jobs',
    component: Jobs
  },
  {
    path: 'assignments',
    component: Assignments
  },
];