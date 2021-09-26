import { Role } from './../models/role';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import * as Parse from 'parse';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  name: String;

  constructor(private router: Router) { }

  getRoles(): Promise<any> {
    const Role = Parse.Object.extend('roles');
    const query = new Parse.Query(Role);
    return query.find();
  }

  addRole(role: Role) {
    //VERIFICANDO SI YA EXISTE El ROL A GUARDAR
    const rolefind = Parse.Object.extend('roles');
    const query = new Parse.Query(rolefind);
    query.equalTo('name', role.name);
    query.find().then( async res => {
      if (res[0]) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ya existe el rol ingresado.',
        })
      } else {
        const myNewObject = new Parse.Object('roles');
        myNewObject.set('name', role.name);
        myNewObject.set('active', true);
        try {
          await myNewObject.save();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Rol añadido!',
            showConfirmButton: false,
            timer: 1500
          })
          this.router.navigate(['/list-role']);
        } catch (error) {
          console.error('Error while creating Category: ', error);
        }
      }
    });
  }

  async delete(id: string) {
    const query = new Parse.Query('roles');
    try {
      const object = await query.get(id);
      try {
        const response = await object.destroy()
        return response;
      } catch (error) {
        console.error('Error while deleting ParseObject', error);
        return error;
      }
    } catch (error) {
      console.error('Error while retrieving ParseObject', error);
      return error;
    }
  }

}
