import { AuthServices } from 'src/app/core/services/auth.service';
import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { UserService } from 'src/app/core/services/user.service';
import { ComplainService } from 'src/app/core/services/complain.service';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  user: string;
  complains: boolean = false;
  isOpened: String;
  admin: boolean;
  sucursal: boolean;
  restaurant: boolean;
  complainsCount: number =0;
  ordersCount: number =0;
  public screenWidth: any;
  public screenHeight: any;
  albaranes: string = 'albaranes.jpg'
  img: String;

  constructor(
    private complainService: ComplainService,
    public userService: UserService,
    public auth: AuthServices,
    public orderService: OrderService,
    @Inject(DOCUMENT) public document: Document) {

  }

  ngOnInit(): void {
      this.user = this.auth.logedUser.userName;
      if (this.auth.logedUser.logo['_url']) {
        this.img = this.auth.logedUser.logo['_url'];
      }
      this.admin = this.auth.Admin();
      this.sucursal = this.auth.Sucursal();
      this.restaurant = this.userService.isRestaurant(this.user);

      this.orderService.orderCount();

      this.complainService.getComplain(this.user).then(res=>{
       for (const complain of res) {
         if(complain.attributes.complainState == 'Nuevo'){
           this.complains = true;
           this.complainsCount++;
         }
       }
     })



      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
   }

  openMenu(){
    if(this.screenWidth<768){
      if(this.isOpened == "block"){
        this.isOpened = "none"
      }else{
        this.isOpened = "block"
      }
    }


  }
  isComercial(): boolean{
    if(this.user == 'buttycomercial' || this.user == 'comercial' ){
      return true;
    }else{
      return false;
    }
  }

}
