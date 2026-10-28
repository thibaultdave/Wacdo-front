import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Collaborators } from './pages/collaborators/collaborators';
import { CreateCollaborator } from './pages/collaborators/create-collaborator/create-collaborator';
import { Restaurants } from './pages/restaurants/restaurants';
import { Jobs } from './pages/jobs/jobs';
import { Assignments } from './pages/assignments/assignments';
import { UpdateCollaborator } from './pages/collaborators/update-collaborator/update-collaborator';
import { authGuard } from './guards/auth-guard';
import { CreateRestaurant } from './pages/restaurants/create-restaurant/create-restaurant';
import { UpdateRestaurant } from './pages/restaurants/update-restaurant/update-restaurant';
import { CreateJob } from './pages/jobs/create-job/create-job';
import { UpdateJob } from './pages/jobs/update-job/update-job';

export const routes: Routes = [
  {
      path: '',
      component: Home
  },
  {
      path: 'home',
      component: Home
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'collaborators',
    component: Collaborators,
    canActivate: [authGuard]
  },
  {
    path: 'collaborators/new',
    component: CreateCollaborator,
    canActivate: [authGuard]
  },
  {
    path: 'collaborators/update/:id',
    component: UpdateCollaborator,
    canActivate: [authGuard]
  },
  {
    path: 'restaurants',
    component: Restaurants,
    canActivate: [authGuard]
  },
  {
    path: 'restaurants/new',
    component: CreateRestaurant,
    canActivate: [authGuard]
  },
  {
    path: 'restaurants/update/:id',
    component: UpdateRestaurant,
    canActivate: [authGuard]
  },
  {
    path: 'jobs',
    component: Jobs,
    canActivate: [authGuard]
  },
  {
    path: 'jobs/new',
    component: CreateJob,
    canActivate: [authGuard]
  },
  {
    path: 'jobs/update/:id',
    component: UpdateJob,
    canActivate: [authGuard]
  },
  {
    path: 'assignments',
    component: Assignments,
    canActivate: [authGuard]
  },
];