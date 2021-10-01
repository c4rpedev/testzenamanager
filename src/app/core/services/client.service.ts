import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthServices } from './auth.service';
import { Client } from './../models/client';
import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  selectedClient: Client;
  emailExist =  false;

  constructor(private auth: AuthServices, private router: Router) {
    this.selectedClient = new Client();
  }

  getClients() {
    if (this.auth.Admin()) {
      const client = Parse.Object.extend('clients');
      const query = new Parse.Query(client);
      return query.find();
    } else {
      const client = Parse.Object.extend('clients');
      const query = new Parse.Query(client);
      query.equalTo('agency', this.auth.logedUser.userName);
      return query.find();
    }
  }

  async addClient(client: Client) {

    //Validando que no exista un cliente con este correo
    const Client2 = Parse.Object.extend('clients');
    const query2 = new Parse.Query(Client2);
    query2.equalTo('name', client.name);
    query2.equalTo('agency', this.auth.logedUser.userName);
    query2.limit(1);
    await query2.find().then(async ress => {
      if (ress[0]) {
        this.emailExist = true;
      } else {
        this.emailExist = false;
        //Creando ID
        const Client = Parse.Object.extend('clients');
        const query = new Parse.Query(Client);
        query.descending('createdAt');
        query.equalTo('agency', this.auth.logedUser.userName);
        query.limit(1);
        await query.find().then(async res => {
          let id = 1;
          if (res[0]) {
            id = parseInt(res[0].attributes.clientId) + 1;
          }
          const myNewObject = new Parse.Object('clients');
          myNewObject.set('clientId', id.toString());
          myNewObject.set('name', client.name);
          myNewObject.set('email', client.email);
          myNewObject.set('phoneNumber', client.phoneNumber);
          myNewObject.set('agency', this.auth.logedUser.userName);
          try {
            return myNewObject.save().then(res => {
            });
          } catch (error) {
            console.log(error);
          }
        })
      }
    })
  }

  async deleteClient(id: string) {
    const query = new Parse.Query('clients');
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

  async editClient(Client: Client) {
    //Buscando el cliente por el ID
    const client = Parse.Object.extend('clients');
    const query = new Parse.Query(client);
    query.equalTo('clientId', this.selectedClient.clientId);
    query.find().then(async res => {
      //Verificando que existe el cliente
      if (res[0]) {
        const myNewObject = res[0];
        myNewObject.set('name', Client.name);
        myNewObject.set('email', Client.email);
        myNewObject.set('phoneNumber', Client.phoneNumber);
        await myNewObject.save();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Cliente actualizado!',
          showConfirmButton: false,
          timer: 1500
        })
        this.router.navigate(['/list-client']);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se encontró el cliente.',
        })
      }
    })
  }

  getClientByEmail(email: string){
    const Client = Parse.Object.extend('clients');
    const query = new Parse.Query(Client);
    query.equalTo('email', email);
    query.limit(1);
    return query.find()
  }

}
