import { OrderService } from 'src/app/core/services/order.service';
import { AuthServices } from 'src/app/core/services/auth.service';
import { Product } from 'src/app/core/models/product';
import { CategoryService } from './../../../core/services/category.service';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';
import { GetProvincesService } from 'src/app/core/services/get-provinces.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { DOCUMENT } from '@angular/common';
import { UserService } from 'src/app/core/services/user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { PreviewProductComponent } from '../preview-product/preview-product.component';
import { StatesService } from 'src/app/core/services/states.service';
import { MunicipioService } from 'src/app/core/services/municipio.service';


@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {
  product: Product = new Product();
  admin: boolean;
  who: string;
  products: Array<any>;
  productsEdit: Array<any> = [];
  productsAttr: Array<any> = [];
  productsCart: Array<any> = [];
  provinces: any = [];
  provincesP: any;
  selectedProvince: null;
  selectedMunicipio: null;
  selectedCategory: null;
  img: String;
  user: string;
  term: string;
  loading: boolean;
  categorys: any = [];
  municipios: any[] = [];

  //variable para mostrar otro valor por defecto en los select cuando se edita un product
  editProv = false;
  editCat = false;
  // categorys: any = ['Combo', 'Producto', 'restaurante1', 'masterpizza', 'combos todo x 1 precio' ];

  productState: boolean;



  constructor(private service: ProductService,
    private router: Router,
    private provinceService: GetProvincesService,
    private userService: UserService,
    private municipioService: MunicipioService,
    private categoryService: CategoryService,
    private orderService: OrderService,
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
      this.who = history.state.who;
      this.getProvinces();
     // this.getProductForProvince();
     this.getCategories();
     this.initProvince('La Habana');

     //En caso de editar un producto, inicializar los filtros para mostrar la vista de dicho producto
     if(this.service.edit){
       this.selectedProvince = this.service.productProvince;
       this.selectedCategory = this.service.productCategory;
       this.term = this.service.productName;
       this.service.edit = false;
       this.editProv = true;
       this.editCat = true;
       this.getProductForProvince();
     }

  }

  getCategories() {
    this.categoryService.getCategories().then(res => {
      this.categorys = res;
    })
  }

  openDialog(product: any): void {
    const dialogRef = this.dialog.open(PreviewProductComponent, {
      width: '600px',
      data: { products: product }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

  initProvince(province: string) {
    this.municipioService.getMunicipio(province).then(res => {
      this.municipios = res[0].attributes['municipios'];
    })

  }

  price(price: any, category: string): number{
    var find = false;
    var pri = 0;
    if(this.auth.logedUser.userRole != 'Agencia'){
      return price;
    }else{
      if(this.auth.logedUser.mayoreo){
        this.auth.logedUser.mayoreo.forEach(element => {
          if(element[0] == category){
            find = true;
            if(element[1] == '%'){
              pri = ((parseInt(element[2].toString()) * price / 100) + price);
            }else{
              pri = (parseInt(element[2].toString()) + price);
            }
          }
        });
      }
    }
    if(find){
      return pri;
    }else{
      return price;
    }
  }

  addOrder() {
    if (this.productsCart.length > 0) {
      this.router.navigate(['/b']);
      this.router.navigateByUrl('/add-order', { state: { product: this.productsCart, province: this.selectedProvince } });
    } else {
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
    console.log('1')
    this.service.productProvince = this.selectedProvince;
    this.service.productCategory = this.selectedCategory;
    this.service.productName = this.term;
    console.log('2')
    this.productsEdit.push(product);
    this.productsAttr.push(productsA);
    console.log('3')
    this.router.navigate(['/b']);
    this.router.navigateByUrl('/edit-product', { state: { product: this.productsEdit, productA: this.productsAttr } });
  };

  createCombo() {
    if (this.productsCart.length > 1) {
      this.router.navigate(['/b']);
      this.router.navigateByUrl('/create-combo', { state: { product: this.productsCart } });
    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Seleccione al menos 2 productos para crear un combo.',
        showConfirmButton: false,
        timer: 1500
      })
    }

  };
  getProvinces() {
    this.provincesP = this.provinceService.getProvinces();
    for (const province of this.provincesP) {
      this.municipioService.getMunicipio(province.name).then(res => {
        console.log(res[0].attributes['municipios'][0].municipio);
        if (res[0].attributes['municipios'][0].municipio != '') {
          this.provinces.push(province);
          console.log('PRovinces');
          console.log(this.provinces);
        }
      })

    }

  }

  saveMunicipio(){
    this.orderService.orderMunicipio = this.selectedMunicipio;
  }

  getProductForProvince() {
    this.editProv = false;
    if (this.auth.Admin()) {
      this.loading = true;
      this.service.getProductsbyProvince(this.selectedProvince).then(res => {
        this.products = res;
        this.loading = false;
      })
    } else {
      this.loading = true;
      this.service.getProductsbyProvinceAndAgency(this.selectedProvince, this.auth.logedUser.userName).then(res => {
        this.products = res;
        this.loading = false;
      })
    }
    this.initProvince(this.selectedProvince);
  }
  isAdmin() {
    this.admin = this.auth.Admin();
  }
  addToCart(product: any) {
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
  changeState(id: string, state: boolean) {
    console.log('Changed');
    console.log(id);
    console.log(state);

    this.service.updateProductState(id, !state);

  }


}
