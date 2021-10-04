import { AgencyGuard } from './core/guards/agency.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { ListClientComponent } from './pages/client/list-client/list-client.component';
import { AddClientComponent } from './pages/client/add-client/add-client.component';
import { PrintComponent } from './pages/order/print/print.component';
import { ChangePasswordComponent } from './pages/user/change-password/change-password.component';
import { AddRoleComponent } from './pages/user/add-role/add-role.component';
import { ListRoleComponent } from './pages/user/list-role/list-role.component';
import { LogedGuard } from './core/guards/loged.guard';
import { AddCategoryComponent } from './pages/product/add-category/add-category.component';
import { ListCategoryComponent } from './pages/product/list-category/list-category.component';
import { AddUserComponent } from './pages/user/add-user/add-user.component';
import { ListUserComponent } from './pages/user/list-user/list-user.component';
import { ListCompletedOrderComponent } from './pages/order/list-completed-order/list-completed-order.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EditOrderComponent } from './pages/order/edit-order/edit-order.component';
import { AddOrderComponent } from './pages/order/add-order/add-order.component';
import { AddOrderSucursalComponent } from './pages/order/add-order-sucursal/add-order-sucursal.component';
import { ListOrdersComponent } from './pages/order/list-orders/list-orders.component';
import { ListProductsComponent } from './pages/product/list-products/list-products.component';
import { ListProductsSucursalComponent } from './pages/product/list-products-sucursal/list-products-sucursal.component';
import { ReportComponent } from './pages/report/report.component';
import { AddComplainComponent } from './pages/complain/add-complain/add-complain.component';
import { AddProductComponent } from './pages/product/add-product/add-product.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { AuthGuard } from './core/services/auth.guard';
import { EditProductComponent } from './pages/product/edit-product/edit-product.component';
import { CreateComboComponent } from './pages/product/create-combo/create-combo.component';
import { PrintViewComponent } from './pages/print-view/print-view.component';
import { EditComplainComponent } from './pages/complain/edit-complain/edit-complain.component';
import { ListComplainComponent } from './pages/complain/list-complain/list-complain.component';
import { EditProvinceComponent } from './pages/province/edit-province/edit-province.component';
import { EditTransportComponent } from './pages/transport/edit-transport/edit-transport.component';
import { SucursalComponent } from './pages/sucursal/sucursal.component';

const routes: Routes = [

  //-- Product --//
  {
    path: '', component: ListOrdersComponent,
    canActivate: [LogedGuard]
  },
  {
    path: 'list-product', component: ListProductsComponent,
    canActivate: [LogedGuard]
  },
  {
    path: 'list-product-sucursal', component: ListProductsSucursalComponent,
    canActivate: [LogedGuard]
  },
  {
    path: 'add-product', component: AddProductComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'edit-product', component: EditProductComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'create-combo', component: CreateComboComponent,
    canActivate: [LogedGuard]
  },
  {
    path: 'list-category', component: ListCategoryComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'add-category', component: AddCategoryComponent,
    canActivate: [AdminGuard]
  },
  //-- Order --//
  {
    path: 'orders', component: ListOrdersComponent,
    canActivate: [LogedGuard]
  },
  {
    path: 'orders-completed', component: ListCompletedOrderComponent,
    canActivate: [LogedGuard]
  },
  {
    path: 'add-order', component: AddOrderComponent,
    canActivate: [LogedGuard]
  },
  {
    path: 'add-order-sucursal', component: AddOrderSucursalComponent,
    canActivate: [LogedGuard]
  },
  {
    path: 'edit-order', component: EditOrderComponent,
    canActivate: [LogedGuard]
  },

  //-- Print --//
  {
    path: 'print-view', component: PrintViewComponent,
    canActivate: [LogedGuard]
  },
  {
    path: 'print', component: PrintComponent,
    canActivate: [LogedGuard]
  },

  //-- Clients --//
  {
    path: 'add-client', component: AddClientComponent,
    canActivate: [AgencyGuard]
  },
  {
    path: 'list-client', component: ListClientComponent,
    canActivate: [AgencyGuard],
  },

  //-- Complains --//
  {
    path: 'add-complain', component: AddComplainComponent,
    canActivate: [AgencyGuard]
  },
  {
    path: 'edit-complain', component: EditComplainComponent,
    canActivate: [AgencyGuard]
  },
  {
    path: 'list-complain', component: ListComplainComponent,
    canActivate: [AgencyGuard]
  },

  //-- User Related --//
  // { path: 'login', component: LoginComponent},
  { path: 'registro', component: RegistroComponent },

  //-- Reports --//
  {
    path: 'reports', component: ReportComponent,
    canActivate: [AdminGuard]
  },

  //-- Province --//
  {
    path: 'edit-province', component: EditProvinceComponent,
    canActivate: [AdminGuard]
  },

  //-- Transport --//
  {
    path: 'edit-transport', component: EditTransportComponent,
    canActivate: [AdminGuard]
  },

  //-- Sucursal --//
  {
    path: 'edit-sucursal', component: SucursalComponent,
    canActivate: [LogedGuard]
  },

  //-- User --//
  {
    path: 'list-user', component: ListUserComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'add-user', component: AddUserComponent,
    canActivate: [LogedGuard]
  },
  {
    path: 'change-pass', component: ChangePasswordComponent,
    canActivate: [LogedGuard]
  },
  {
    path: 'list-role', component: ListRoleComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'add-role', component: AddRoleComponent,
    canActivate: [AdminGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
