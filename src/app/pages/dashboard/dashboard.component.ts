import { AuthServices } from 'src/app/core/services/auth.service';
import { Component, Inject, OnInit } from '@angular/core';
// import { AuthService } from '@auth0/auth0-angular';
import {
  WoocommerceProductsService
} from 'ngx-wooapi';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  user: string;

  constructor( public auth: AuthServices,
    private wooProducs: WoocommerceProductsService
     ) {

  }

  ngOnInit(): void {
    this.auth.checkToken();
    console.log(this.auth.check);
    console.log('viene')
    this.wooProducs.retrieveProducts().subscribe(response => {
      console.log('response')
      console.log(response);
    }, err => {
      console.log('error')
      console.log(err);
    });

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
