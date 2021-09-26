import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';
import { Order } from 'src/app/core/models/order';
import { GetProvincesService } from 'src/app/core/services/get-provinces.service';
import { OrderService } from 'src/app/core/services/order.service';

import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { SucursalService } from 'src/app/core/services/sucursal.service';
import '../../../../assets/js/smtp.js';
declare let Email: any;
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SendSmsComponent } from '../send-sms/send-sms.component';
import { UserService } from 'src/app/core/services/user.service';
@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss']
})
export class EditOrderComponent implements OnInit {
  order: Order = new Order();
  orderId: string;
  user: string;
  admin: boolean;
  sucursal: boolean;
  sucursalName: any [] = [];
  products: Array<any> = [{}];
  subtotal: number;
  total:number = 0;
  img: string | ArrayBuffer =
  "https://bulma.io/images/placeholders/480x480.png";
  pdf: string | ArrayBuffer;
  photosrc: String;
  isImg = false;
  filePath:String;
  file: File;
  constructor(
    private router: Router,
    private sucursalService: SucursalService,
    private orderService: OrderService,
    private userService: UserService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.order = history.state.order;
    if(history.state.order.orderAlbaran){
      this.img=  history.state.order.orderAlbaran._url;
    }
    if(history.state.order.orderInvoice){
      this.pdf = history.state.order.orderInvoice._url;
    }
    this.orderId = history.state.orderId;
    this.user = history.state.user;
    this.admin = history.state.admin;
    this.sucursal = history.state.sucursal;

    this.products = this.order.productArray;
     //this.order.orderProvince = this.products[0].province;
     console.log('Products');
     console.log(history.state.orderId);

     console.log(this.products[0].province);
     this.products.forEach(element => {
       this.subtotal = +element.price;
       this.total = this.total + this.subtotal
       console.log(this.total);

     });
     this.sucursalService.getSucursal().then(res =>{
      this.sucursalName = res;
      console.log('tests');
      console.log(this.sucursalName);
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
        this.isImg = true;
      };
}
sendEmail(){
  let emailuser = this.userService.returnMail(this.order.orderAgency);
    if(emailuser != 'false'){
      Email.send({
        Host : 'smtp.elasticemail.com',
        Username : 'buttymanager@gmail.com',
        Password : '050DF30919104610A6C9C87876384842B48E',
        To : emailuser,
        From : 'buttymanager@gmail.com',
        Subject : `Pedido ${this.order.orderId} Finalizado`,
        Body : `
        <b>Nuestro equipo le notifica que el pedido.</b> <br/> <b>Número: ${this.order.orderId} <b/> se encuentra Finalizado.<br/> Para su comprobación le enviamos el albarán adjunto. Le deseamos un buen día`,
        Attachments : [
          {
            name : this.order.orderId+'.jpg',
            path : this.img.toString()
          }]
        }).then( message => {alert("Correo de confirmación enviado a Agencia"); } );
    }
}
  onSubmit(form: NgForm){
    // var albaranes = 'albaranes.jpg'
    var hasAlbaran = false;
    console.log(form);

    if(form.valid || form.disabled){
      if( this.order.state != 'Nuevo' && this.order.state != 'Revisado' && this.order.state != 'En Proceso'){
        // if(this.isImg){
        hasAlbaran = true
        // }
       }

      this.orderService.updateOrder(this.order, this.orderId, this.img.toString(), hasAlbaran).subscribe(
        success =>{
          console.log('Show MSG');
          this.orderService.orderCount();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Pedido actualizado',
            showConfirmButton: false,
            timer: 1500
          })
          if(this.order.state == 'Finalizado'){
              this.sendEmail();
           }
           if(this.orderService.values && this.orderService.conditions && this.orderService.methods){
            this.orderService.edit = true;
           }
           if(this.orderService.Archivados){
             this.orderService.Archivados = false;
            this.router.navigate(['/orders-completed']);
           }else{
            this.router.navigate(['/orders']);
           }

        }
      );

    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Complete todos los campos obligatorios!',
      })
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SendSmsComponent, {
      width: '600px',
      data: {mobile: this.order.orderMobile}
    });
  }

  print(){
    this.router.navigate(['/b']);
    this.router.navigateByUrl('/print-view', { state: {order: this.order}});
  }

}
