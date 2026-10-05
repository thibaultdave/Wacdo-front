import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Collaborateurs } from './pages/collaborateurs/collaborateurs';
import { Restaurants } from './pages/restaurants/restaurants';
import { Postes } from './pages/postes/postes';
import { Affectations } from './pages/affectations/affectations';

export const routes: Routes = [
  {
      path: '',
      component: Home,
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'collaborateurs',
    component: Collaborateurs
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
