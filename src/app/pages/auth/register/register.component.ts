import { AuthServices } from './../../../core/services/auth.service';
// import { Role } from './../../models/role';
// import { User } from './../../models/user';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  repeatpassword: any;
  correctCI = false;
  error: string;

  constructor(public authService: AuthServices, public route: Router) { }

  ngOnInit(): void {
  }

  Register(form: NgForm) {
    form.value.active = true;
    // this.authService.register(form.value)
    //   .subscribe(res => {
    //     this.error = null;
    //     localStorage.setItem("x-access-token", res['token']);

    //     // guardando datos del usuario en caché
    //     this.authService.findUser()
    //       .subscribe(res => {
    //         this.authService.logedUser = res as User;
    //         this.authService.roles = res['roles'] as Role[];
    //         this.route.navigate(['/home']);
    //       });
    //   },
    //     err => {
    //       this.error = err['error']['message'];
    //     })
  }

//verificar si es un CI real
  validarCI(form: NgForm) {
    let CI = form.value.CI.toString();
    if(CI.length != 11){
      this.correctCI = true;
    }else{
     this.correctCI = false;
    }
  }
}

