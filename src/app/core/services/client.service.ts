import { Client } from './../models/client';
import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  selectedClient: Client;

  constructor() { }

  getClients() {
    const client = Parse.Object.extend('clients');
    const query = new Parse.Query(client);
    return query.find();
  }

  addClient(client: Client) {
    const myNewObject = new Parse.Object('clients');
    myNewObject.set('name', client.name);
    // myNewObject.set('firstLastName', client.firstLastName);
    // myNewObject.set('secondLastName', client.secondLastName);
    try {
      return myNewObject.save().then(res => {
      });
    } catch (error) {
      console.log(error);
    }
  }

}
