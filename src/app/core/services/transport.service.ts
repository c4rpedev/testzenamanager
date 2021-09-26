import { Injectable } from '@angular/core';
import * as Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class TransportService {

  constructor() { }

  getTransport(): Promise <any> {   
    const Transport = Parse.Object.extend('transporte');
    const query = new Parse.Query(Transport);    
    return query.find();   
  }

  getTransportForAgency(agency: string): Promise <any> {   
    const Transport = Parse.Object.extend('transporte');
    const query = new Parse.Query(Transport);  
    query.equalTo('agencia', agency);  
    return query.find();   
  }
  getTransportForAgencyMunicipio(agency: string, municipio: string): Promise <any> {  
     
    const Transport = Parse.Object.extend('transporte');
    const query = new Parse.Query(Transport);  
    query.equalTo('Agencia', agency);  
    return query.find();   
  }
  updateTransport(transportId: string, transporte: any){
    (async () => {
      const query = new Parse.Query('transporte');
      try {
        // here you put the objectId that you want to update
        const object = await query.get(transportId);
        
        object.set('transporte', transporte);
        try {
          const response = await object.save();
          // You can use the "get" method to get the value of an attribute
          // Ex: response.get("<ATTRIBUTE_NAME>")
          // Access the Parse Object attributes using the .GET method
          console.log(response.get('agencia'));
          console.log(response.get('transporte'));
          console.log('transporte updated', response);
        } catch (error) {
          console.error('Error while updating transporte', error);
          }
        } catch (error) {
          console.error('Error while retrieving object transporte', error);
        }
    })();
  }
}
