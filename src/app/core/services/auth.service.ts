import { UserService } from 'src/app/core/services/user.service';
import { AnimationDriver } from '@angular/animations/browser';
import { Inject, Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { DOCUMENT } from '@angular/common';
import { stringify } from '@angular/compiler/src/util';
import { updateLanguageServiceSourceFile } from 'typescript';
import * as Parse from 'parse';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthServices {

  users: String;
  userLoggedIn: boolean;      // other components can check on this variable for the login status of the user
  error: string;

  /////NewLogin
  public logedUser: User;
  check = false;
  // roles: Role[];

  constructor(private router: Router,
    public userService: UserService,
    @Inject(DOCUMENT) public document: Document
  ) {
    this.logedUser = new User();
  }

  /////New Login
  login(User: User) {
    //Buscando el usuario por el email
    const user = Parse.Object.extend('users');
    const query = new Parse.Query(user);
    query.equalTo('emailId', User.emailId);
    query.find().then(async res => {
      //Verificando que existe el usuario
      if (res[0]) {
        //Verificando si la contraseña está bien
        const userpass = CryptoJS.AES.decrypt(res[0].attributes.password.trim(), this.userService.clave.trim()).toString(CryptoJS.enc.Utf8);
        if (User.password == userpass) {
          //Generando token y guardando los datos del usuario en logedUser
          this.check = true;
          const token = this.generateToken();
          localStorage.setItem("x-access-token", token);
          this.logedUser = res[0].attributes as User;
          //Guardando token en BD
          const myNewObject = res[0];
          myNewObject.set('token', token);
          myNewObject.set('tokendate', new Date());
          await myNewObject.save();
          this.router.navigate(['/orders']);
        } else {
          this.error = 'Contraseña incorrecta.';
        }
      } else {
        this.error = 'Usuario no registrado.';
      }
    });
  }

  generateToken() {
    let result = '';
    let n = 500;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < n; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async checkToken() {
    // var now = new Date().getTime();
    const token = localStorage.getItem("x-access-token");
    if (token) {
      const user = Parse.Object.extend('users');
      const query = new Parse.Query(user);
      query.equalTo('token', token);
      const res = await query.find()
      if (res[0]) {
        // const time = res[0].attributes.tokendate.getTime();
        // var diff = now - time;
        // console.log(diff/(1000*60*60));
        // console.log(time);
        this.check = true;
        this.logedUser = res[0].attributes as User;
      } else {
        console.log('token no válido');
        this.check = false;
        this.router.navigate(['/']);
      }
    } else {
      this.check = false;
      console.log('no se envió un token');
      this.router.navigate(['/']);
    }
  }

  logout() {
    localStorage.clear();
    this.check = false;
    console.log('cerrar sesión')
    this.router.navigate(['/']);
  }

  Admin(){
    if(this.logedUser.userRole == 'Administrador'){
      return true;
    }else{
      return false;
    }
  }

  Agencia(){
    if(this.logedUser.userRole == 'Agencia'){
      return true;
    }else{
      return false;
    }
  }

  Sucursal(){
    if(this.logedUser.userRole == 'Sucursal'){
      return true;
    }else{
      return false;
    }
  }

  //Old
  getUser(): String {
    this.users = this.logedUser.userName;
    return this.users;
  }


}
