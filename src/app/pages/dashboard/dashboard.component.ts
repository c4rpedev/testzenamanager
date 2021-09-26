import { AuthServices } from 'src/app/core/services/auth.service';
import { Component, OnInit } from '@angular/core';
// import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  user: string;

  constructor( public auth: AuthServices) {

  }

  ngOnInit(): void {
    this.auth.checkToken();

    // this.auth.user$.subscribe(user =>{
    //   this.user = user.nickname;
    // })

    // console.log("Auth user"+this.auth.user$);


    // if(!this.auth.user$){
    //   this.auth.loginWithRedirect();
    // }

  }

}
