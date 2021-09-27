import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ListOrdersComponent } from '../order/list-orders/list-orders.component'
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'order',
        component: ListOrdersComponent
      },
      { path: '', pathMatch: 'full', redirectTo: 'order' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
