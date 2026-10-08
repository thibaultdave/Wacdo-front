import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Collaborators } from './pages/collaborators/collaborators';
import { Restaurants } from './pages/restaurants/restaurants';
import { Postes } from './pages/postes/postes';
import { Affectations } from './pages/affectations/affectations';

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
    path: 'postes',
    component: Postes
  },
  {
    path: 'affectations',
    component: Affectations
  },
];