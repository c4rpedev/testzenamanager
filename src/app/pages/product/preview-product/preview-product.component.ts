import { AuthServices } from './../../../core/services/auth.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from 'src/app/core/models/product';

@Component({
  selector: 'app-preview-product',
  templateUrl: './preview-product.component.html',
  styleUrls: ['./preview-product.component.scss']
})
export class PreviewProductComponent implements OnInit {
  product: any;
  productTable: Array<any>;
  photosrc: String;
  img: string | ArrayBuffer =
  "https://bulma.io/images/placeholders/480x480.png";

  constructor(
    public auth: AuthServices,
    public dialogRef: MatDialogRef<PreviewProductComponent>,
    @Inject(MAT_DIALOG_DATA) public products: any) { }

  ngOnInit(): void {
    this.product = this.products['products'];
    this.productTable = this.product.products;
    console.log(this.products['products']);
    console.log(this.product);
  }

  price(product: any): number{
    var price = product.price;
    var category = product.category
    var cost = parseInt(product.cost);
    var find = false;
    var pri = 0;
    //Verificando si es Agencia para Calcular Precio
    if(this.auth.logedUser.userRole != 'Agencia'){
      return price;
    }else{
      //VERIFICANDO SI TIENE PRICECATEGORIES PARA AÑADIRLO AL CÁLCULO
      if(this.auth.logedUser.priceCategories){
        this.auth.logedUser.priceCategories.forEach(element => {
          if(element[0] == category){
            price = ((parseInt(element[2].toString()) * cost / 100) + cost);
          }
        });
      }
      //VERIFICANDO Y APLICANCO MAYOREO
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

  ShowProvices(products: string[]){
    var pro = ""
    products.forEach(element => {
      if(pro == ""){
        pro = element;
      }else{
        pro = pro + ', ' + element;
      }
    });
    return pro;
  }

  print(){
    window.print();
  }
}
