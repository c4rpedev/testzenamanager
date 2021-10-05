import { Client } from './../../../core/models/client';
import { ClientService } from './../../../core/services/client.service';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Order } from 'src/app/core/models/order';
import { GetProvincesService } from 'src/app/core/services/get-provinces.service';
import { OrderService } from 'src/app/core/services/order.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { DOCUMENT } from '@angular/common';
import { AuthServices } from 'src/app/core/services/auth.service';
import { MunicipioService } from 'src/app/core/services/municipio.service';
import { TransportService } from 'src/app/core/services/transport.service';
import { SmsService } from 'src/app/core/services/sms.service';
@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent implements OnInit {
  order: Order = new Order();
  products: Array<any> = [{}];
  subtotal: number;
  total: number = 0;
  totalAmount: number = 0;
  provinces: any[] = [];
  province: string;
  municipios: any[] = [];
  user: string;
  mobNumberPattern = "^5+[0-9]{7}$";
  fixNumberPattern = "^[0-9]{8}$";
  transportCost: number;
  streetNumber: string;
  street: string;
  streetB: string;
  localidad: string;
  transporteArray: any;
  transporteArrayM: any;
  clienteName: string;
  firstLastName: string;
  secondLastName: string;
  saveClient: boolean;
  alreadySavedClient = false;
  client = new Client();
  arrayClients: Client[] = [];
  options: string[] = [];
  lastName: [string[]] = [[]];
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  municipiolist = false;
  constructor(
    private router: Router,
    private smsService: SmsService,
    private provinceService: GetProvincesService,
    private orderService: OrderService,
    private municipioService: MunicipioService,
    private transportService: TransportService,
    public auth: AuthServices,
    private clientService: ClientService,
    @Inject(DOCUMENT) public document: Document
  ) { }

  ngOnInit(): void {
    this.provinces = this.provinceService.getProvinces();
    this.products = history.state.product;
    //  this.province =  history.state.province;
    this.order.orderProvince = history.state.province;
    if(this.orderService.orderMunicipio){
      this.order.orderMunicipio = this.orderService.orderMunicipio;
      this.municipiolist = true;
    }
    this.initProvince();
    this.user = this.auth.logedUser.userName;
    this.getTranspCost();
    this.getClients();
    this.prices();
    // this.getTransportCost();
  }

  //Autocompletar Cliente
  private _filter(value: string): string[] {
    this.clienteName = value;
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  getClients() {
    this.clientService.getClients().then(res => {
      res.forEach(element => {
        this.arrayClients.push(element.attributes as Client);
        this.options.push(element.attributes.name);
        this.lastName.push([element.attributes.firstLastName, element.attributes.secondLastName])
      });
      //Ejecutar autocompletar
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    })
  }

  SavedClient(name: string) {
    this.alreadySavedClient = true;
    this.saveClient = false;
    this.arrayClients.forEach(element => {
      if (element.name == name) {
        // this.clienteName = name;
        this.client.email = element.email;
        this.client.phoneNumber = element.phoneNumber;
      }
    });
  }

  initProvince() {
    this.municipioService.getMunicipio(this.order.orderProvince).then(res => {
      this.municipios = res[0].attributes['municipios'];
      console.log(this.municipios);
    })
  }

  changeProvince() {
    this.municipioService.getMunicipio(this.order.orderProvince).then(res => {
      this.municipios = res[0].attributes['municipios'];
      this.order.orderMunicipio = this.municipios[0]['municipio'];
    })
    this.transporteArrayM.transporte.forEach((element: any) => {
      if (element.municipio == this.province) {
        this.transportCost = 0;
        this.transportCost = +element.precio;
        this.total = this.totalAmount + this.transportCost;
      }
    });
  }

  getTranspCost() {
    this.transportService.getT().then(res => {
      var cost = 0;
      this.transporteArray = res[0].attributes;
      this.transporteArray.costos.forEach((element: any) => {
        if (element[0] == this.order.orderProvince) {
          cost = element[1];
          this.transportCost = element[1];
          console.log('costotransp' + this.transportCost)
        }
      });

      this.products.forEach(element => {
        this.subtotal = +element.price;
        this.total = this.total + this.subtotal
      });
      this.total = this.total + this.transportCost;
      console.log('TOTAL');
      console.log(this.total);
    })
  }

  sendSms(number: string) {
    if (this.order.orderClientName) {
      this.smsService.sendSMS(number, this.order.orderClientName, this.order.orderRecieverName, this.user);
    } else {
      this.smsService.sendSMS(number, ' ', this.order.orderRecieverName, this.user);
    }

  }

  prices() {
    this.products.forEach(element => {
      element.price = this.price(element.price, element.category);
    });
  }

  price(price: any, category: string): number {
    var find = false;
    var pri = 0;
    if (this.auth.logedUser.userRole != 'Agencia') {
      return price;
    } else {
      if (this.auth.logedUser.mayoreo) {
        this.auth.logedUser.mayoreo.forEach(element => {
          if (element[0] == category) {
            find = true;
            if (element[1] == '%') {
              pri = ((parseInt(element[2].toString()) * price / 100) + price);
            } else {
              pri = (parseInt(element[2].toString()) + price);
            }
          }
        });
      }
    }
    if (find) {
      return pri;
    } else {
      return price;
    }
  }

  async onSubmit(form: NgForm) {
    if (form.valid) {
      this.order.orderClientEmail = this.client.email;
      this.order.orderClientPhone = this.client.phoneNumber;
      //Guardar Cliente
      if (!this.alreadySavedClient) {
        this.order.orderClientName = this.clienteName + ' ' + form.value.firstLastName + ' ' + form.value.secondLastName;
        if (this.saveClient) {
          this.client.name = this.clienteName + ' ' + form.value.firstLastName + ' ' + form.value.secondLastName;
          await this.clientService.addClient(this.client).then(res => {
            if (this.clientService.emailExist) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ya existe un cliente con este nombre y apellidos.',
              })
            } else {
              this.SaveOrder();
            }
          });
        } else {
          this.SaveOrder();
        }
      } else {
        this.order.orderClientName = this.clienteName;
        this.SaveOrder();
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Complete todos los campos obligatorios!',
      })
    }

  }

  //Guardar Pedido
  SaveOrder() {
    if (this.streetB) {
      this.order.orderAddress = (this.localidad || "") + ' Calle ' + this.street + ' # ' + this.streetNumber + ' entre ' + (this.streetB || "");
    } else {
      this.order.orderAddress = (this.localidad || "") + ' Calle ' + this.street + ' # ' + this.streetNumber;
    }

    this.order.orderPrice = this.total;
    this.orderService.createOrder(this.order, this.products, this.user).then(res => {
      if (this.saveClient) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Pedido añadido, Cliente almacenado.',
          showConfirmButton: false,
          timer: 1500
        })
      } else {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Pedido añadido',
          showConfirmButton: false,
          timer: 1500
        })
      }
      this.router.navigate(['/orders']);
    });
    Swal.fire({
      position: 'top-end',
      icon: 'warning',
      title: 'Guardando pedido. Por favor espere.',
      showConfirmButton: false,
      timer: 1500
    })
  }


}
