import { User } from './../../core/models/user';
import { UserService } from './../../core/services/user.service';
import { AuthServices } from './../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/core/models/order';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
import { ProductView } from 'src/app/core/models/product-view';

@Component({
  selector: 'app-print-view',
  templateUrl: './print-view.component.html',
  styleUrls: ['./print-view.component.scss'],
  providers: [DatePipe]
})
export class PrintViewComponent implements OnInit {
  orders: Order = new Order();
  dateS: string;
  displayedColumns: string[];
  dataSource: any[] = [];
  nameProduct: string;
  row_data: Array<any> = [];
  prod: any;
  productview: ProductView = new ProductView;
  agency: User;
  img: String;

  constructor(private datePipe: DatePipe,
    public auth: AuthServices,
    public userService: UserService) {
    this.dateS = formatDate(new Date(), 'yyyy/MM/dd', 'en');
  }

  ngOnInit(): void {
    this.orders = history.state.order;
    this.nameProduct = history.state.order.productArray[0].name;
    this.data();
    this.dataAgency();

  }

  dataAgency() {
    if (this.orders.orderAgencyId) {
      console.log('orderagencyID--> ' + this.orders.orderAgencyId)
      this.userService.getUserbyId(this.orders.orderAgencyId).then(res => {
        if (res[0]) {
          this.agency = res[0].attributes as User;
          if (this.agency.logo['_url']) {
            this.img = this.agency.logo['_url']
          }
        }
      });
    }
  }

  data() {
    for (const product of this.orders.productArray) {
      // console.log('product');
      // console.log(product);


      if (product.products.length == 0) {
        // console.log('IFFF');
        this.prod = <Object>product;
        this.productview = {
          Nombre: this.prod.name,
          UM: this.prod.um,
          Cantidad: this.prod.amount
        };
        console.log(this.productview);

        this.row_data.push(this.productview);
        console.log(this.row_data);


      } else {
        // console.log('ELSSS');
        this.prod = <Object>product.products;
        this.productview = {
          Nombre: product['name'],
          UM: '',
          Cantidad: ''
        };
        this.row_data.push(this.productview);
        for (const p of this.prod) {
          this.row_data.push(p);
        }

        console.log(this.row_data);

        //this.row_data= product.products;
      }
    }

    // let row_data = this.orders.productArray[0].products;
    this.displayedColumns = ["Nombre", "UM", "Cantidad"];
    let data: any = [];
    this.dataSource = this.row_data;
    console.log('DATASOURCE');
    console.log(this.dataSource);


  }
  print() {
    window.print();
  }
}
