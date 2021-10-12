import { WooCommerceService } from './../../core/services/woo-commerce.service';
import { AuthServices } from 'src/app/core/services/auth.service';
import { Component, Inject, OnInit } from '@angular/core';
// import { AuthService } from '@auth0/auth0-angular';
import {
  WoocommerceProductsService
} from 'ngx-wooapi';
import { ContentObserver } from '@angular/cdk/observers';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  user: string;

  constructor( public auth: AuthServices,
    private wooProducs: WoocommerceProductsService,
    private wooService: WooCommerceService
     ) {

  }

  ngOnInit(): void {
    this.auth.checkToken();
    console.log(this.auth.check);
    console.log('viene')

    this.wooService.getProducts().subscribe(res=>{
      console.log('PRODUCTS!!!!')
      console.log('REESSSSS!!!!')
      console.log(res)
    },
    err=>{
      console.log('PRODUCTS!!!!')
      console.log('ERRRRRR!!!!')
      console.log(err)
    })

    this.wooService.getOrders().subscribe(res=>{
      console.log('ORDERS!!!!')
      console.log('REESSSSS!!!!')
      console.log(res)
    },
    err=>{
      console.log('ORDERS!!!!')
      console.log('ERRRRRR!!!!')
      console.log(err)
    })

    // this.wooProducs.retrieveProducts().subscribe(response => {
    //   console.log('response')
    //   console.log(response);
    // }, err => {
    //   console.log('error')
    //   console.log(err);
    // });

    // console.log('ya')

    // this.auth.user$.subscribe(user =>{
    //   this.user = user.nickname;
    // })

    // console.log("Auth user"+this.auth.user$);


    // if(!this.auth.user$){
    //   this.auth.loginWithRedirect();
    // }

  }

}
