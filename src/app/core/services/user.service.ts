import { AuthServices } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { User } from './../models/user';
import { Injectable } from '@angular/core';
import * as Parse from 'parse';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: string;
  selectedUser: User;
  admin = false;
  clave = 'encryptClave';
  editPass = false;

  constructor(private auth: AuthServices, private router: Router) {
    this.selectedUser = new User();
    if (this.auth.logedUser) {
      this.user = this.auth.logedUser.userName;
    }
  }

  //Nuevos Métodos

  getUsers() {
    const user = Parse.Object.extend('users');
    const query = new Parse.Query(user);
    return query.find();
  }

  getUserbyEmail(email: string) {
    const user = Parse.Object.extend('users');
    const query = new Parse.Query(user);
    query.equalTo('emailId', email);
    return query.find();
  }

  getUserbyId(id: string) {
    const user = Parse.Object.extend('users');
    const query = new Parse.Query(user);
    query.equalTo('userId', id);
    return query.find();
  }

  addUser(user: User, img: string) {
    //VERIFICANDO SI YA EXISTE UN USUARIO CON ESE CORREO
    const userfind = Parse.Object.extend('users');
    const query = new Parse.Query(userfind);
    query.equalTo('emailId', user.emailId);
    query.find().then(res => {
      if (res[0]) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ya existe un usuario con ese Correo.',
        })
      } else {
        //VERIFICANDO SI NO HAY USUARIO CON ESE ID
        const userfind2 = Parse.Object.extend('users');
        const query2 = new Parse.Query(userfind2);
        query2.equalTo('userId', user.userId);
        query2.find().then(async ress => {
          if (ress[0]) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ya existe un usuario con ese ID.',
            })
          } else {
            //Creando ID
            const usss = Parse.Object.extend('users');
            const query5 = new Parse.Query(usss);
            query5.descending('createdAt');
            query5.limit(1);
            await query5.find().then(async res => {
              let id = 1;
              if (res[0]) {
                id = parseInt(res[0].attributes.userId) + 1;
              }

              const EncryptPassword = CryptoJS.AES.encrypt(user.password.trim(), this.clave.trim()).toString();

              const myNewObject = new Parse.Object('users');
              myNewObject.set('userId', id.toString());
              myNewObject.set('userName', user.userName);
              myNewObject.set('emailId', user.emailId);
              myNewObject.set('password', EncryptPassword);
              myNewObject.set('phoneNumber', user.phoneNumber.toString());
              myNewObject.set('userRole', user.userRole);
              myNewObject.set('active', true);
              myNewObject.set('mayoreo', user.mayoreo);
              myNewObject.set('logo', new Parse.File("logo.jpg", { uri: img }));

              try {
                await myNewObject.save().then(res => {
                  Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Usuario añadido!',
                    showConfirmButton: false,
                    timer: 1500
                  })
                  this.router.navigate(['/list-user']);
                });
              } catch (error) {
                console.log(error);
              }
            })
          }
        });
      }
    });
  }

  async editUser(User: User, img: string) {
    //Buscando el usuario por el ID
    const user = Parse.Object.extend('users');
    const query = new Parse.Query(user);
    query.equalTo('userId', this.selectedUser.userId);
    query.find().then(async res => {
      //Verificando que existe el usuario
      if (res[0]) {
        const myNewObject = res[0];
        myNewObject.set('userId', User.userId);
        myNewObject.set('userName', User.userName);
        myNewObject.set('emailId', User.emailId);
        myNewObject.set('phoneNumber', User.phoneNumber.toString());
        myNewObject.set('userRole', User.userRole);
        myNewObject.set('active', true);
        myNewObject.set('mayoreo', User.mayoreo);
        myNewObject.set('logo', new Parse.File("logo.jpg", { uri: img }));
        await myNewObject.save();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Usuario actualizado!',
          showConfirmButton: false,
          timer: 1500
        })
        if (this.admin) {
          this.admin = false;
          this.router.navigate(['/list-user']);
        } else {
          this.router.navigate(['/orders']);
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se encontró el usuario.',
        })
      }
    })
  }

  async deleteUser(id: string) {
    const query = new Parse.Query('users');
    try {
      // here you put the objectId that you want to delete
      const object = await query.get(id);
      try {
        return await object.destroy();
      } catch (error) {
        console.error('Error while deleting ParseObject', error);
      }
    } catch (error) {
      console.error('Error while retrieving ParseObject', error);
    }
  }

  getAgencys() {
    const user = Parse.Object.extend('users');
    const query = new Parse.Query(user);
    query.equalTo('userRole', 'Agencia');
    return query.find();
  }

  getSucursals() {
    const user = Parse.Object.extend('users');
    const query = new Parse.Query(user);
    query.equalTo('userRole', 'Sucursal');
    return query.find();
  }

  async changePass(password: string) {
    //Buscando el usuario por el ID
    const user = Parse.Object.extend('users');
    const query = new Parse.Query(user);
    query.equalTo('userId', this.selectedUser.userId);
    query.find().then(async res => {
      //Verificando que existe el usuario
      if (res[0]) {
        const EncryptPassword = CryptoJS.AES.encrypt(password.trim(), this.clave.trim()).toString();

        const myNewObject = res[0];
        myNewObject.set('password', EncryptPassword);
        await myNewObject.save();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Contraseña actualizada!',
          showConfirmButton: false,
          timer: 1500
        })

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se encontró el usuario.',
        })
      }
      this.router.navigate(['/list-user']);
    })
  }


  //Métodos antiguos

  get getUser() {
    return this.user;
  }

  isAdmin(user: string): boolean {
    if (user == 'buttymanager' || user == 'buttycomercial' || user == 'buttyoperaciones' || user == 'buttyekonomico' || user == 'comercial') {
      return true;
    } else {
      return false;
    }
  }

  isSucursal(user: string): boolean {

    if (user == 'sucursalhol' || user == 'sucursalstgo' || user == 'sucursalhab' || user == 'sucursalmtz' || user == 'santamarta') {
      return true;
    } else {
      return false;
    }
  }
  isRestaurant(user: string): boolean {
    if (user == 'restaurante1' || user == 'masterpizza') {
      return true;
    } else {
      return false;
    }
  }
  returnMail(user: string): string {
    if (user == 'destinocuba') {
      return 'tonet@destinocubaagency.com';
    }
    if (user == 'buttymaster') {
      return 'elikeen910911@gmail.com';
    }
    if (user == 'villarejo') {
      return 'carlosrv1218@gmail.com';
    }
    if (user == 'tushoponline') {
      return 'contacto@tsotienda.com';
    }
    if (user == 'raiko') {
      return 'bellomichel12@gmail.com';
    }
    if (user == 'esencialpack') {
      return 'p.oriente@gmail.com';
    }
    else {
      return 'false';
    }
  }

}
