import { AuthServices } from 'src/app/core/services/auth.service';
import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import * as Parse from 'parse'
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  //Variable para definir si regresar a la vista de archivado o a la lista de pedidos
  edit = false;
  Archivados = false;
  values: any;
  conditions: any;
  methods: any;
  user: string;
  ordersCount: number = 0;

  constructor(public auth: AuthServices) { }

  createOrder(order: Order, products: any[], user: string) {
    (async () => {
      const myNewObject = new Parse.Object('order');
      myNewObject.set('orderId', order.orderId);
      myNewObject.set('orderClientName', order.orderClientName);
      myNewObject.set('orderRecieverName', order.orderRecieverName);
      myNewObject.set('orderProvince', order.orderProvince);
      myNewObject.set('orderMunicipio', order.orderMunicipio);
      myNewObject.set('orderAddress', order.orderAddress);
      myNewObject.set('orderPhone', order.orderPhone);
      myNewObject.set('orderMobile', order.orderMobile);
      myNewObject.set('orderPrice', order.orderPrice);
      myNewObject.set('orderReference', order.orderReference);
      myNewObject.set('orderNote', order.orderNote);
      myNewObject.set('state', 'Nuevo');
      if (order.orderProvince == "Pinar del Río" ||
        order.orderProvince == "Matanzas" ||
        order.orderProvince == "Artemisa" ||
        order.orderProvince == "Cienfuegos" ||
        order.orderProvince == "Sancti Spíritus" ||
        order.orderProvince == "La Habana" ||
        order.orderProvince == "Ciego de Ávila" ||
        order.orderProvince == "Villa Clara" ||
        order.orderProvince == "Mayabeque" ||
        order.orderProvince == "Camagüey" ||
        order.orderProvince == "Isla de la Juventud") {
        myNewObject.set('orderDays', 5);
      } else {
        myNewObject.set('orderDays', 7);
      }
      myNewObject.set('productArray', products);
      myNewObject.set('orderAgency', user);
      try {
        const result = await myNewObject.save();
        // Access the Parse Object attributes using the .GET method
        console.log('order created', result);
      } catch (error) {
        console.error('Error while creating order: ', error);
      }
    })();
  }

  async createOrderPatugente(order: Order, url: string[], user: string) {

      const myNewObject = new Parse.Object('order');
      myNewObject.set('orderId', order.orderId);
      myNewObject.set('orderClientName', order.orderClientName);
      myNewObject.set('orderRecieverName', order.orderRecieverName);
      myNewObject.set('orderProvince', order.orderProvince);
      myNewObject.set('orderMobile', order.orderMobile);
      myNewObject.set('orderAgency', user);
      myNewObject.set('state', 'Nuevo');
      myNewObject.set('orderInvoice', new Parse.File("factura.pdf", { uri: url[0].toString() }));

      try {
        const result = await myNewObject.save();
        // Access the Parse Object attributes using the .GET method
        console.log('order created', result);
      } catch (error) {
        console.error('Error while creating order: ', error);
      }
  }
  updateOrder(order: Order, orderId: string, img: string, hasAlbaran: boolean): Observable<boolean> {
    return new Observable(observer => {
      console.log('In Service');

      (async () => {
        const query = new Parse.Query('order');
        try {
          // here you put the objectId that you want to update
          const myNewObject = await query.get(orderId);
          myNewObject.set('orderId', order.orderId);
          myNewObject.set('orderClientName', order.orderClientName);
          myNewObject.set('orderRecieverName', order.orderRecieverName);
          myNewObject.set('orderProvince', order.orderProvince);
          myNewObject.set('orderMunicipio', order.orderMunicipio);
          myNewObject.set('orderAddress', order.orderAddress);
          myNewObject.set('orderReference', order.orderReference);
          myNewObject.set('orderPhone', order.orderPhone);
          myNewObject.set('orderMobile', order.orderMobile);
          myNewObject.set('orderSucursal', order.orderSucursal);
          myNewObject.set('orderNote', order.orderNote);
          myNewObject.set('orderCancelMotive', order.orderCancelMotive);
          myNewObject.set('state', order.state);
          if (hasAlbaran && order.state != 'Finalizado') {
            myNewObject.set('orderAlbaran', new Parse.File("albaranes.jpg", { uri: img }));
            console.log("Poniendo albaran");

          }
          observer.next(true);
          observer.complete();

          try {
            const response = await myNewObject.save();
            // You can use the "get" method to get the value of an attribute
            // Ex: response.get("<ATTRIBUTE_NAME>")
            // Access the Parse Object attributes using the .GET method
            console.log(response.get('orderProvince'));
            console.log(response.get('orderMunicipio'));
            console.log(response.get('orderAddress'));
            console.log(response.get('orderPhone'));
            console.log(response.get('productArray'));
            console.log(response.get('orderId'));
            console.log(response.get('state'));
            console.log(response.get('orderClientName'));
            console.log(response.get('orderRecieverName'));
            console.log('order updated', response);
            observer.next(true);
            observer.complete();
          } catch (error) {
            console.error('Error while updating order', error);
            observer.error(error);
            observer.complete();
          }
        } catch (error) {
          console.error('Error while retrieving object order', error);
          observer.error(error);
          observer.complete();
        }
      })();

    });
  }

  updateOrderState(orderId: string, state: string) {
    (async () => {
      const query = new Parse.Query('order');
      try {
        // here you put the objectId that you want to update
        const myNewObject = await query.get(orderId);

        myNewObject.set('state', state);
        try {
          const response = await myNewObject.save();
          // You can use the "get" method to get the value of an attribute
          // Ex: response.get("<ATTRIBUTE_NAME>")
          // Access the Parse Object attributes using the .GET method

          console.log(response.get('state'));

        } catch (error) {
          console.error('Error while updating order', error);
        }
      } catch (error) {
        console.error('Error while retrieving object order', error);
      }
    })();
  }
  deleteOrder(id: string) {
    (async () => {
      const query = new Parse.Query('order');
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

  getOrder(agency: string): Promise<any> {

    if (agency == 'comercial') {
      const Orders = Parse.Object.extend('order');
      const query = new Parse.Query(Orders);
      const query2 = new Parse.Query(Orders);
      query.equalTo('orderAgency', 'patugente');
      query2.equalTo('orderSucursal', 'patugente');
      query.notEqualTo('state', 'Archivado');
      const composedQuery = Parse.Query.or(query, query2);
      query.limit(1000);
      return composedQuery.find()
    } else if (agency && agency != 'buttymanager' && agency != 'buttycomercial' && agency != 'buttyoperaciones' && agency != 'buttyekonomico') {
      const Orders = Parse.Object.extend('order');
      const query = new Parse.Query(Orders);
      query.equalTo('orderAgency', agency);
      query.notEqualTo('state', 'Archivado');
      query.limit(1000);
      return query.find()
    } else {
      const Orders = Parse.Object.extend('order');
      const query = new Parse.Query(Orders);
      // query.notEqualTo('orderAgency', 'patugente');
      query.notEqualTo('state', 'Archivado');
      query.limit(1000);
      return query.find()
    }


  }

  getOrderCompleted(agency: string): Promise<any> {
    console.log('Agencia');
    console.log(agency);


    if (agency == 'comercial') {
      const Orders = Parse.Object.extend('order');
      const query = new Parse.Query(Orders);
      const query2 = new Parse.Query(Orders);
      query.equalTo('orderAgency', 'patugente');
      query.equalTo('state', 'Archivado');
      query2.equalTo('orderSucursal', 'patugente');
      const composedQuery = Parse.Query.or(query, query2);
      query.limit(1000);
      return composedQuery.find()
    } else if (agency && agency != 'buttymanager' && agency != 'buttycomercial' && agency != 'buttyoperaciones' && agency != 'buttyekonomico') {
      const Orders = Parse.Object.extend('order');
      const query = new Parse.Query(Orders);
      query.equalTo('orderAgency', agency);
      query.equalTo('state', 'Archivado');
      query.limit(1000);
      return query.find()
    } else {
      const Orders = Parse.Object.extend('order');
      const query = new Parse.Query(Orders);
      query.notEqualTo('orderAgency', 'patugente');
      query.equalTo('state', 'Archivado');
      query.limit(1000);
      return query.find()
    }


  }

  getOrderSucursal(sucursal: string): Promise<any> {
    if (sucursal && sucursal != 'buttymanager' && sucursal != 'buttycomercial' && sucursal != 'buttyoperaciones' && sucursal != 'buttyekonomico') {
      const Orders = Parse.Object.extend('order');
      const query = new Parse.Query(Orders);
      query.equalTo('orderSucursal', sucursal);
      query.notEqualTo('state', 'Archivado');
      return query.find()
    } else {
      const Orders = Parse.Object.extend('order');
      const query = new Parse.Query(Orders);
      query.notEqualTo('state', 'Archivado');
      return query.find()
    }
  }

  getOrderCompletedSucursal(sucursal: string): Promise<any> {
    if (sucursal && sucursal != 'buttymanager' && sucursal != 'buttycomercial' && sucursal != 'buttyoperaciones' && sucursal != 'buttyekonomico') {
      const Orders = Parse.Object.extend('order');
      const query = new Parse.Query(Orders);
      query.equalTo('orderSucursal', sucursal);
      query.equalTo('state', 'Archivado');
      return query.find()
    } else {
      const Orders = Parse.Object.extend('order');
      const query = new Parse.Query(Orders);
      query.equalTo('state', 'Archivado');
      return query.find()
    }
  }

  orderCount() {
      this.user = this.auth.logedUser.userName;
      this.ordersCount = 0;
      this.getOrder(this.user).then(res => {
        for (const order of res) {
          if (order.attributes.state != 'Finalizado' && order.attributes.orderAlbaran._name != '4a8c781e7ebd7179677e6ab110914579_3b4e631189ab7135ce9a88c6d0385dab_product.png') {
            this.ordersCount++;
          }
        }
      })
  };

}
