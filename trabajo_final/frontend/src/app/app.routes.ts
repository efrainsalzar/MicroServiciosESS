import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { MedicoDashboardComponent } from './pages/medico-dashboard/medico-dashboard.component';
import { PacienteDashboardComponent } from './pages/paciente-dashboard/paciente-dashboard.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent
  },
  {
    path: 'medico-dashboard',
    component: MedicoDashboardComponent
  },
  {
    path: 'paciente-dashboard',
    component: PacienteDashboardComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
