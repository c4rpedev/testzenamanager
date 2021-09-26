import { AuthServices } from 'src/app/core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Complain } from 'src/app/core/models/complain';
import { ComplainService } from 'src/app/core/services/complain.service';
import { UserService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-complain',
  templateUrl: './edit-complain.component.html',
  styleUrls: ['./edit-complain.component.scss']
})
export class EditComplainComponent implements OnInit {
  loading: boolean;
  complain: Complain = new Complain();
  complainPic: any;
  urlPic: {
    [key: string]: string
};
  complainId: string;
  user: string;
  admin: boolean;
  index:number = 0;
  indexR:number = 0;
  urls = new Array<string>();
  urlsResult = new Array<string>();
  constructor(
    private complainService: ComplainService,
    private router: Router,
    public auth: AuthServices,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.complain = history.state.complain;
    this.complainPic = history.state.complain;
    this.index = +this.complainPic.complainPicNum;
    this.indexR = +this.complainPic.resultPicNum;
    this.complainId = history.state.complainId;
    this.user = history.state.user;
    this.admin = this.auth.Admin();
    this.getComplainPictures();

  }


  isAdmin(): boolean{
    console.log(this.admin);

    return this.admin;
  }
  getComplainPictures(){
    this.loading = false;
    console.log(this.index);
    console.log(this.complainPic.complainPicture0._url);
    for (let index = 0; index < this.index; index++) {
     this.urls.push(this.complainPic['complainPicture'+index]._url)
    }
    if(this.indexR != 0){
      for (let indexR = 0; indexR < this.indexR; indexR++) {
        this.urlsResult.push(this.complainPic['resultPicture'+indexR]._url);
        console.log('URLResult');
         console.log(this.urlsResult);
       }
    }

  }

  detectFiles(event: any) {
    this.urlsResult = [];
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.urlsResult.push(e.target.result);
        }
        reader.readAsDataURL(file);
      }
    }
  }
  onSubmit(form: NgForm){
    if(form.valid){
      this.complainService.updateComplain(this.complain, this.complainId, this.urlsResult);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Queja actualizada',
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
