import { AuthServices } from 'src/app/core/services/auth.service';
import { CategoryService } from './../../../core/services/category.service';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { Product } from 'src/app/core/models/product';
import { GetProvincesService } from 'src/app/core/services/get-provinces.service';
import { ProductService } from 'src/app/core/services/product.service';
import { TransportService } from 'src/app/core/services/transport.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  product: Product = new Product();
  provinces: any [] = [];
  categories: Array<any>;
  agencys: Array<string> = [];
  provincesProduct: Array<string> = [];
  selectchange = true;
  filePath:String;
  img: string | ArrayBuffer =
  "https://parsefiles.back4app.com/vH5Y2pQQTnE8odu7xeMKMzviCtFuPHQAvQogW4GI/7b7b788e29df265cb59d20c2682aba24_product.jpg";
  photosrc: String;
  selectedProvince: null;
  file: File;
  user: string;
  transporte: any [] = [];
  editField: string;
  comboProducts: Product = new Product();
  productList: Array<any> = [
    { id: '', name: '', age: '', companyName: '', country: '', city: '' },

  ];

  awaitingPersonList: Array<any> = [
    { id: 6, name: 'George Vega', age: 28, companyName: 'Classical', country: 'Russia', city: 'Moscow' },

  ];

  name = 'Paste it';
  val:any;
   displayedColumns: string[] ;
  dataSource: any[] = [];

  data(event:ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    let row_data = pastedText.split('\n');
    this.displayedColumns = [ "Nombre", "UM", "Cantidad" ];
    //delete row_data[0];
    // Create table dataSource
    let data:any=[];
    row_data.forEach(row_data=>{
        let row:any={};
      this.displayedColumns.forEach((a, index)=>{row[a]= row_data.split('\t')[index]});
      data.push(row);
    })
    this.dataSource = data;
    console.log(this.dataSource);
    }

  constructor(private service: ProductService,
              private provinceService: GetProvincesService,
              private router: Router,
              private transportService: TransportService,
              public categoryService: CategoryService,
              public auth: AuthServices,
                @Inject(DOCUMENT) public document: Document) {
                this.selectedProvince = null;
              }

  ngOnInit(): void {
    this.getCategories();
    this.provinces = this.provinceService.getProvinces();
      this.user = this.auth.logedUser.userName;
    this.transportService.getTransport().then(res =>{
      this.transporte = res;
    });
  }

  getCategories() {
    this.categoryService.getCategories().then(res => {
      this.categories = res;
      console.log(this.categories)
    })
  }

  //Para inhabilitar la primera opción dle select de categorías
  ChangeSelect(){
    this.selectchange = false;
  }

  photo(event: any) {
    this.filePath = event.files;

    console.log("Path");
    console.log(this.filePath);
    this.file = event[0];

      const reader = new FileReader();


      reader.readAsDataURL(event.target.files[0]);

      reader.onload = event => {
        this.img = reader.result;

      };

}

  saveProduct(form: NgForm){
    if(form.valid){
      this.product.productAgency = "empty";
      this.product.productAgencys = this.agencys;
      this.product.productProvince = "empty";
      this.product.productProvinces = this.provincesProduct;
      console.log(this.product)
      this.service.addProduct(this.product, this.img.toString(), this.dataSource, this.user);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Producto añadido',
        showConfirmButton: false,
        timer: 1500
      })
      this.router.navigate(['/list-product']);
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Complete todos los campos obligatorios!',
      })
    }

  }


  //Gestionando el arreglo de Agencias
  selectAgency(item: string){
    let agencyNotIn = true;
    for (let index = 0; index < this.agencys.length; index++) {
      const element = this.agencys[index];
      if (item == element) {
        this.agencys.splice(index, 1)
        agencyNotIn = false;
      }
    }
    if (agencyNotIn) {
      this.agencys.push(item);
    }
  }

  verifyAgency(item: string){
    for (let index = 0; index < this.agencys.length; index++) {
      const element = this.agencys[index];
      if (item == element) {
        return true;
      }
    }
    return false;
  }

  //Gestionando el arreglo de Provincias
  selecProvince(item: string){
    let provinceNotIn = true;
    for (let index = 0; index < this.provincesProduct.length; index++) {
      const element = this.provincesProduct[index];
      if (item == element) {
        this.provincesProduct.splice(index, 1)
        provinceNotIn = false;
      }
    }
    if (provinceNotIn) {
      this.provincesProduct.push(item);
    }
  }

  verifyProvince(item: string){
    for (let index = 0; index < this.provincesProduct.length; index++) {
      const element = this.provincesProduct[index];
      if (item == element) {
        return true;
      }
    }
    return false;
  }

  //---Editable Table -- //


    updateList(id: number, property: string, event: any) {
      const editField = event.target.textContent;
      this.productList[id][property] = editField;
    }

    remove(id: any) {
      this.awaitingPersonList.push(this.productList[id]);
      this.productList.splice(id, 1);
    }

    add() {
        const person = this.awaitingPersonList[0];
        this.productList.push(this.productList);
        console.log(this.productList);

        this.awaitingPersonList.splice(0, 1);
    }

    changeValue(id: number, property: string, event: any) {
      this.editField = event.target.textContent;
    }

}
