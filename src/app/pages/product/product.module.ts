// Core Dependencies
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import { MyFilterPipe } from './search-by-name.pipe'

// configuration and services
//import { ProductRoutes } from "./product.routing";

// Components


import { ProductComponent } from "./product.component";
import { ListProductsComponent } from './list-products/list-products.component';
import { ListProductsSucursalComponent } from './list-products-sucursal/list-products-sucursal.component';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { CreateComboComponent } from './create-combo/create-combo.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatDialogModule } from "@angular/material/dialog";
import { PreviewProductComponent } from './preview-product/preview-product.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddCategoryComponent } from './add-category/add-category.component';
import { ListCategoryComponent } from './list-category/list-category.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    Ng2SearchPipeModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    RouterModule
    //RouterModule.forChild(ProductRoutes),
  ],
  declarations: [
    ProductComponent,
    ListProductsComponent,
    ListProductsSucursalComponent,
    AddProductComponent,
    EditProductComponent,
    CreateComboComponent,
    MyFilterPipe,
    PreviewProductComponent,
    AddCategoryComponent,
    ListCategoryComponent

  ],
  exports: [],
})
export class ProductModule {}
