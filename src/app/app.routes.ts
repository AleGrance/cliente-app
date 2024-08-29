import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MenusComponent } from './pages/menus/menus.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { ControlComponent } from './pages/control/control.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

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
  {
    path: 'control',
    component: ControlComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
];
