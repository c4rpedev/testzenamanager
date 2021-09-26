import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from 'src/app/core/models/product';
import { Router } from '@angular/router';

import * as Parse from 'parse'
import { StatesService } from './states.service';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  products: Array<Product>;
  name: String;
  img: string;
  path: string;
  results: any;
  //Aquí almaceno los datos del producto que se va a editar para una vez editado regresar a la vista de productos
  edit = false;
  productProvince: any;
  productCategory: any;
  productName: any;

  constructor(private http:HttpClient,
              private router: Router,
              private stateService: StatesService
              ) {

              }


  getProductFromCategory(category: string): Promise <any>{
    const Products = Parse.Object.extend('products');
      const query = new Parse.Query(Products);
      query.equalTo("category", category);
      return query.find();
  }

  //Obtener Productos por agencia y provincia
  getProductProperties(province: string, agency: string): Promise <any> {
    console.log(agency);
     console.log(this.stateService.getDeliveryTime(province));

    if(this.stateService.getDeliveryTime(province) == 5){

      const Products = Parse.Object.extend('products');
      const query = new Parse.Query(Products);
      const query2 = new Parse.Query(Products);
      const query3 = new Parse.Query(Products);
      if(province == 'Matanzas'){
        if(agency == 'franklin' || agency == 'domiciliohabana'){
          query.equalTo("productAgency", 'franklin');
          console.log('Entro');
        }else{
          query.containedIn("productAgency", [agency, null]);
          console.log('No Entro');
        }
        query2.equalTo('province', province);
        query3.containedIn("province", [province, "Occidente"]);

        const composedQuery = Parse.Query.and(query, query3);
        // const composedQueryF = Parse.Query.and(query, query2);
        // const composedQuery = Parse.Query.and(composedQueryF, query3);
        return composedQuery.find();
      }else{
        if(agency == 'franklin' || agency == 'domiciliohabana'){
          query.equalTo("productAgency", agency);
          console.log('Entro');
        }else{
          query.containedIn("productAgency", [agency, null]);
          console.log('No Entro');
        }
        query2.equalTo('province', province);
        query3.equalTo('province', "Occidente");

        //const composedQuery = Parse.Query.or(query, query2);
        const composedQueryF = Parse.Query.and(query, query3);
        const composedQuery = Parse.Query.or(composedQueryF, query2);
        return composedQuery.find();
      }


    }else{
      const Products = Parse.Object.extend('products');
      const query = new Parse.Query(Products);
      const query2 = new Parse.Query(Products);
      const query3 = new Parse.Query(Products);
      if(province == "Santiago de Cuba" || province == "Pinar del Río"){
        if(agency == 'esencialpack' || agency == 'domiciliohabana' || agency == 'franklin'){
          query.equalTo("productAgency",agency);
        }else{
          query.containedIn("productAgency",[agency, null]);
        }
        query2.equalTo('province', province);
        const composedQuery = Parse.Query.and(query, query2);
        return composedQuery.find();
      }else{
        query3.equalTo('province', "Oriente");
        if(agency == 'franklin' || agency == 'domiciliohabana'){
          query.equalTo("productAgency", agency);
        }else{
          query.containedIn("productAgency",
        [agency, null]);
        }

        query2.equalTo('province', province);
      //const composedQuery = Parse.Query.or(query, query2);
       const composedQueryF = Parse.Query.and(query, query3);
        const composedQuery = Parse.Query.or(composedQueryF, query2);
        return composedQuery.find();
      }


    }
  }

//Obtener Todos los Productos por provincia
  public getAllProductProperties(province: string): Promise <any> {
    if(this.stateService.getDeliveryTime(province) == 5){
      const Products = Parse.Object.extend('products');
    const query = new Parse.Query(Products);
    const query2 = new Parse.Query(Products);
    query2.equalTo('province', "Occidente");
    query.equalTo('province', province);
    const composedQuery = Parse.Query.or(query, query2);
    composedQuery.limit(1000)
    return composedQuery.find()

    }else{
      const Products = Parse.Object.extend('products');
      const query = new Parse.Query(Products);
      const query2 = new Parse.Query(Products);

      query.equalTo('province', province);
      if(province == "Santiago de Cuba" || province == "Pinar del Río"){
        return query.find();
      }else{
        query2.equalTo('province', "Oriente");
        const composedQuery = Parse.Query.or(query, query2);
        return composedQuery.find()
      }

    }

  }

 //NUEVO Obtener Productos por agencia y provincia
  getProductsbyProvinceAndAgency(province: string, agency: string){
    const Products = Parse.Object.extend('products');
      const query = new Parse.Query(Products);
      query.containedIn("productAgencys", [agency, 'Todas']);
      query.contains('productProvinces', province);

      // const query2 = new Parse.Query(Products);
      // query.contains("productAgencys", 'Todas');
      // query.contains('productProvinces', province);
      // const composedQuery = Parse.Query.or(query, query2);
      return query.find();
  }

  //NUEVO Obtener Todos los Productos por provincia
  getProductsbyProvince(province: string){
    const Products = Parse.Object.extend('products');
      const query = new Parse.Query(Products);
      query.contains('productProvinces', province);
      query.limit(1000)
      return query.find();
  }

  addProduct(product: Product, img: string, products: any[], user: string){
    (async () => {
      const myNewObject = new Parse.Object('products');
      // myNewObject.set('productId', product.productId);
      myNewObject.set('name', product.productName);
      myNewObject.set('price', +product.productPrice);
      myNewObject.set('cost', product.productCost);
      myNewObject.set('um', product.productUM);
      myNewObject.set('amount', +product.productAmount);
      myNewObject.set('province', product.productProvince);
      myNewObject.set('category', product.productCategory);
      myNewObject.set('productAgency', product.productAgency);
      myNewObject.set('picture', new Parse.File("product.jpg", { uri: img }));
      myNewObject.set('description', product.productDescription);
      myNewObject.set('products', products);
      myNewObject.set('productAgencys', product.productAgencys);
      myNewObject.set('productProvinces', product.productProvinces);
      try {
        const result = await myNewObject.save();
        // Access the Parse Object attributes using the .GET method
        console.log('products created', result);
      } catch (error) {
        console.error('Error while creating products: ', error);
      }
    })();
  }

  updateProduct(id: string, product: Product, img: string, products: any){
    (async () => {
      const query = new Parse.Query('products');
      try {
        // here you put the objectId that you want to update
        const myNewObject = await query.get(id);
        // myNewObject.set('productId', product.productId);
      myNewObject.set('name', product.productName);
      myNewObject.set('price', +product.productPrice);
      myNewObject.set('cost', product.productCost);
      myNewObject.set('um', product.productUM);
      myNewObject.set('amount', product.productAmount);
      myNewObject.set('province', product.productProvince);
      myNewObject.set('category', product.productCategory);
      myNewObject.set('picture', new Parse.File("product.jpg", { uri: img }));
      myNewObject.set('description', product.productDescription);
      myNewObject.set('products', products);
      myNewObject.set('productAgency', product.productAgency);
      myNewObject.set('productAgencys', product.productAgencys);
      myNewObject.set('productProvinces', product.productProvinces);
        try {
          const response = await myNewObject.save();
          // You can use the "get" method to get the value of an attribute
          // Ex: response.get("<ATTRIBUTE_NAME>")
          // Access the Parse Object attributes using the .GET method
          console.log(response.get('name'));
          console.log(response.get('cost'));
          console.log(response.get('amount'));
          console.log(response.get('province'));
          console.log(response.get('category'));
          console.log(response.get('picture'));
          console.log(response.get('description'));
          console.log(response.get('price'));
          console.log(response.get('um'));
          console.log(response.get('id'));
          console.log('products updated', response);
        } catch (error) {
          console.error('Error while updating products', error);
          }
        } catch (error) {
          console.error('Error while retrieving object products', error);
        }
    })();
  }

  deleteProduct(id: string){
    (async () => {
      const query = new Parse.Query('products');
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
  addCombo(product: Product, img: string, products: any[], agency: string){
    (async () => {
      const myNewObject = new Parse.Object('products');
      myNewObject.set('name', product.productName);
      myNewObject.set('price', +product.productPrice);
      myNewObject.set('cost', product.productCost);
      myNewObject.set('um', 'u');
      myNewObject.set('amount', +'1');
      myNewObject.set('province', product.productProvince);
      myNewObject.set('category', 'Combo');
      myNewObject.set('productAgency', agency);
      myNewObject.set('picture', new Parse.File("product.jpg", { uri: img }));
      myNewObject.set('description', product.productDescription);
      myNewObject.set('products', products);
      try {
        const result = await myNewObject.save();
        // Access the Parse Object attributes using the .GET method
        console.log('products created', result);
      } catch (error) {
        console.error('Error while creating products: ', error);
      }
    })();
  }

  updateProductState(id: string, state: boolean){
    (async () => {
      const query = new Parse.Query('products');
      try {
        // here you put the objectId that you want to update
        const myNewObject = await query.get(id);
        // myNewObject.set('productId', product.productId);

      myNewObject.set('state', state);
        try {
          const response = await myNewObject.save();
          // You can use the "get" method to get the value of an attribute
          // Ex: response.get("<ATTRIBUTE_NAME>")
          // Access the Parse Object attributes using the .GET method
          console.log(response.get('state'));
          console.log('products updated', response);
        } catch (error) {
          console.error('Error while updating products', error);
          }
        } catch (error) {
          console.error('Error while retrieving object products', error);
        }
    })();
  }


  //MIGRAR PRODUCTOS VIEJOS A NUEVOS!
  migrate(){
    const Products = Parse.Object.extend('products');
    const query = new Parse.Query(Products);
    query.limit(1000);
    return query.find();
  }

  updateP(id: string, agency: string[], province: string[] ){
    (async () => {
      const query = new Parse.Query('products');
      try {
        // here you put the objectId that you want to update
        const myNewObject = await query.get(id);
        // myNewObject.set('productId', product.productId);

      myNewObject.set('province', 'Empty');
      myNewObject.set('productAgency', 'Empty');
      myNewObject.set('productAgencys', agency);
      myNewObject.set('productProvinces', province);
        try {
          const response = await myNewObject.save();

        } catch (error) {
          console.error('Error while updating products', error);
          }
        } catch (error) {
          console.error('Error while retrieving object products', error);
        }
    })();
  }




}
