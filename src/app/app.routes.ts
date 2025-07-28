import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'inicio', loadComponent: () => import('./pages/inicio/inicio.component').then(m => m.InicioComponent) },
   { path: 'productos', loadComponent: () => import('./pages/productos/productos.component').then(m => m.ProductosComponent) },
    { path: 'ventas', loadComponent: () => import('./pages/carrito/carrito.component').then(m => m.CarritoComponent) },
    { path: 'metricas', loadComponent: () => import('./pages/metricas/metricas.component').then(m => m.MetricasComponent) },
    { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' },
];
