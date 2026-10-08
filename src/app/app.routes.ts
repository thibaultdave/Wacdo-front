import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Collaborators } from './pages/collaborators/collaborators';
import { Restaurants } from './pages/restaurants/restaurants';
import { Jobs } from './pages/jobs/jobs';
import { Assignments } from './pages/assignments/assignments';

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