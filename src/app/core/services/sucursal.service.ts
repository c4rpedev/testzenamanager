import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {

  constructor() { }

  getSucursal(): Promise <any> {   
    const Sucursal = Parse.Object.extend('sucursales');
    const query = new Parse.Query(Sucursal);    
    return query.find();   
  }

  getSucursalFromUser(user: string): Promise <any> {   
    const Sucursal = Parse.Object.extend('sucursales');
    const query = new Parse.Query(Sucursal);    
    query.equalTo('user', user);  
    return query.find();   
  }
  
  getSucursalFromName(name: string): Promise <any> {   
    const Sucursal = Parse.Object.extend('sucursales');
    const query = new Parse.Query(Sucursal);    
    query.equalTo('name', name);  
    return query.find();   
  }

  updateSucursal(sucursalId: string, name: string, user: string){
    console.log('ID');
    console.log(sucursalId);
    
    (async () => {
      const query = new Parse.Query('sucursales');
      try {
        // here you put the objectId that you want to update
        const object = await query.get(sucursalId);
       
        object.set('name', name);
        object.set('user', user);
        try {
          const response = await object.save();
          // You can use the "get" method to get the value of an attribute
          // Ex: response.get("<ATTRIBUTE_NAME>")
          // Access the Parse Object attributes using the .GET method
          console.log(response.get('provincia'));
          console.log(response.get('municipios'));
          console.log('municipios updated', response);
        } catch (error) {
          console.error('Error while updating municipios', error);
          }
        } catch (error) {
          console.error('Error while retrieving object municipios', error);
        }
    })();
  }
  addSucursal(name: string, user: string){
    (async () => {
      const myNewObject = new Parse.Object('sucursales');
      myNewObject.set('name', name);
      myNewObject.set('user', user);
      try {
        const result = await myNewObject.save();
        // Access the Parse Object attributes using the .GET method
        console.log('municipios created', result);
      } catch (error) {
        console.error('Error while creating municipios: ', error);
      }
    })();
  }

  deleteSucursal(id: string){
    (async () => {
      const query = new Parse.Query('sucursales');
      try {
        // here you put the objectId that you want to delete
        const object = await query.get(id);
        try {
          const response = await object.destroy();
          console.log('Deleted ParseObject', response);
        } catch (error) {
          console.error('Error while deleting ParseObject', error);
        }
      } catch (error) {
        console.error('Error while retrieving ParseObject', error);
      }
    })();
  }

}
