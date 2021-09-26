import { AuthServices } from 'src/app/core/services/auth.service';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';
import { GetProvincesService } from 'src/app/core/services/get-provinces.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { DOCUMENT } from '@angular/common';
import { UserService } from 'src/app/core/services/user.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { PreviewProductComponent } from '../preview-product/preview-product.component';
import { StatesService } from 'src/app/core/services/states.service';
import { MunicipioService } from 'src/app/core/services/municipio.service';
import { SucursalService } from 'src/app/core/services/sucursal.service';


@Component({
  selector: 'app-list-products',
  templateUrl: './list-products-sucursal.component.html',
  styleUrls: ['./list-products-sucursal.component.scss']
})
export class ListProductsSucursalComponent implements OnInit {
  admin: boolean;
  who:string;
  products: Array<any>;
  productsEdit: Array<any> = [];
  productsAttr: Array<any> = [];
  productsCart: Array<any> = [];
  provinces: any = [];
  provincesP: any;
  selectedProvince: null;
  selectedCategory: null;
  img: String;
  user: string;
  term: string;
  loading: boolean;
  categorys: any = ['Combo', 'Producto', 'Restaurante 1' ];
  productState: boolean;



  constructor(private service: ProductService,
    private router: Router,
    private provinceService: GetProvincesService,
    private userService: UserService,
    private municipioService: MunicipioService,
    private sucursalService: SucursalService,
    public auth: AuthServices,
    public dialog: MatDialog,
    @Inject(DOCUMENT) public document: Document

    ) {
      this.selectedCategory = null;
      this.selectedProvince = null;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
       this.user = this.auth.logedUser.userName;
       this.isAdmin();
      this.who= history.state.who;
      this.getSucursal();
      this.getProductForProvince();

  }

  openDialog(product: any): void {
    const dialogRef = this.dialog.open(PreviewProductComponent, {
      width: '600px',
      data: {products: product}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }



  addOrder() {
    if(this.productsCart.length > 0){
      this.router.navigate(['/b']);
    this.router.navigateByUrl('/add-order', { state: {product: this.productsCart, province: this.selectedProvince}});
    }else{
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Seleccione al menos 1 productos para crear un pedido.',
        showConfirmButton: false,
        timer: 1500
      })
    }

  };

  editProduct(product: any, productsA: any) {
    this.productsEdit.push(product);
    this.productsAttr.push(productsA);
    this.router.navigate(['/b']);
    this.router.navigateByUrl('/edit-product', { state: {product: this.productsEdit, productA: this.productsAttr}});
  };

  createCombo() {
    if(this.productsCart.length > 1){
      this.router.navigate(['/b']);
      this.router.navigateByUrl('/create-combo', { state: {product: this.productsCart}});
    }else{
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Seleccione al menos 2 productos para crear un combo.',
        showConfirmButton: false,
        timer: 1500
      })
    }

  };
  getSucursal(){

      console.log('Su');
      console.log(this.user);


      this.sucursalService.getSucursalFromUser(this.user).then(res=>{
        console.log('Sucursal');

        console.log(res);

      })



  }

  getProductForProvince() {

      this.loading = true;
      this.service.getProductFromCategory(this.user).then(res=>{
        this.products = res;
        this.loading = false;
        console.log(this.products);

      })

  }
  isAdmin(){
    this.admin = this.auth.Admin();
  }
  addToCart(product: any){
    Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Producto añadido',
    showConfirmButton: false,
    timer: 1500
  })
    console.log(product);
    this.productsCart.push(product);
    console.log(this.productsCart);
  }
  changeState(id: string, state: boolean){
    console.log('Changed');
    console.log(id);
    console.log(state);

   this.service.updateProductState(id, !state);

  }

}
