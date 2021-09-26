import { Component, OnInit } from '@angular/core';
import { Complain } from 'src/app/core/models/complain';
import { ComplainService } from 'src/app/core/services/complain.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { Router } from '@angular/router';
import { Order } from 'src/app/core/models/order';
@Component({
  selector: 'app-add-complain',
  templateUrl: './add-complain.component.html',
  styleUrls: ['./add-complain.component.scss']
})
export class AddComplainComponent implements OnInit {
  complain: Complain = new Complain();
  user: string;
  fileSrc: String;
  filePath:String;
  file: string | ArrayBuffer;
  urls = new Array<string>();
  order: Order = new Order();
  orderId: string;
  constructor(
    private userService: UserService,
    private complainService: ComplainService,
    private router: Router) { }

  ngOnInit(): void {
    this.order = history.state.order;
    
    this.complain.complainClient = this.order.orderClientName;
    this.complain.complainOrder = this.order.orderId;
    this.user = this.userService.getUser;
    console.log(this.user);
    
  }

  detectFiles(event: any) {
    this.urls = [];
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.urls.push(e.target.result);
        }
        reader.readAsDataURL(file);        
      }
    } 
  }

  onSubmit(form: NgForm){
    console.log(this.user);
    
    if(form.valid){
      this.complainService.createComplain(this.complain, this.user, this.urls)
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Queja registrada',
        showConfirmButton: false,
        timer: 1500
      })
      this.router.navigate(['/list-complain']);
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Complete todos los campos obligatorios!',        
      })
    } 
  }

}
