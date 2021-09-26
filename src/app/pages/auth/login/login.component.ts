// import { Role } from './../../models/role';
import { User } from './../../../core/models/user';
import { Router } from '@angular/router';
import { AuthServices } from './../../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error: string;
  user = new User();
  constructor(public authService: AuthServices, public route: Router) { }

  ngOnInit(): void {
  }

  Login(form: NgForm) {
    this.authService.login(form.value);
  }

}
