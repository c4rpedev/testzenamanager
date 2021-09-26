import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {

  constructor() { }


  updateMunicipio(provinciaId: string, municipio: any){
    (async () => {
      const query = new Parse.Query('municipios');
      try {
        // here you put the objectId that you want to update
        const object = await query.get(provinciaId);
       
        object.set('municipios', municipio);
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
  addMunicipio(municipio: any, province: string){
    console.log(municipio);
    console.log(province);
    (async () => {
      const myNewObject = new Parse.Object('municipios');
      myNewObject.set('provincia', province);
      myNewObject.set('municipios', municipio);
      try {
        const result = await myNewObject.save();
        // Access the Parse Object attributes using the .GET method
        console.log('municipios created', result);
      } catch (error) {
        console.error('Error while creating municipios: ', error);
      }
    })();
  }
  deleteMunicipio(provinciaId: string){
    (async () => {
      const query = new Parse.Query('municipios');
      try {
        // here you put the objectId that you want to delete
        const object = await query.get(provinciaId);
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
  getMunicipio(province: string): Promise <any> {    
      const Municipios = Parse.Object.extend('municipios');
      const query = new Parse.Query(Municipios);    
      query.equalTo('provincia', province);
      return query.find();   
  }
}
