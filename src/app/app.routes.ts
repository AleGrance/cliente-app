import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MenusComponent } from './pages/menus/menus.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'menus',
    component: MenusComponent,
  },
  {
    path: 'pedidos',
    component: PedidosComponent,
  },
];
