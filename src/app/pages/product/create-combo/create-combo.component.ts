import { AuthServices } from 'src/app/core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';
import { Order } from 'src/app/core/models/order';
import { GetProvincesService } from 'src/app/core/services/get-provinces.service';
import { OrderService } from 'src/app/core/services/order.service';
import Swal from 'sweetalert2';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/core/models/product';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-add-order',
  templateUrl: './create-combo.component.html',
  styleUrls: ['./create-combo.component.scss']
})
export class CreateComboComponent implements OnInit {
  provinces: any [] = [];
  order: Order = new Order();
  products: Array<any> = [{}];
  subtotal: number;
  total:number = 0;
  product: Product = new Product();
  user: string;
  admin: boolean;
  filePath:String;
  img: string | ArrayBuffer =
  "https://bulma.io/images/placeholders/480x480.png";
  photosrc: String;
  file: File;
  constructor(
    private router: Router,
    private userService: UserService,
    private provinceService: GetProvincesService,
    private orderService: OrderService,
    private service: ProductService,
    private auth: AuthServices
  ) { }

  ngOnInit(): void {
      this.user = this.auth.logedUser.userName;
      this.admin = this.auth.Admin();

    this.provinces = this.provinceService.getProvinces();
     this.products = history.state.product;

     this.products.forEach(element => {
       this.subtotal = +element.price;
       this.product.productProvince = element.province;
       this.total = this.total + this.subtotal
     });

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

    saveCombo(form: NgForm){
      if(form.valid){
        this.service.addCombo(this.product, this.img.toString(), this.products, this.user);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Producto añadido',
          showConfirmButton: false,
          timer: 1500
        })
        this.router.navigate(['/']);
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Complete todos los campos obligatorios!',
        })
      }

    }


}
