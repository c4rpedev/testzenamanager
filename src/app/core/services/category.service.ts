import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Category } from './../models/category';
import { Injectable } from '@angular/core';
import * as Parse from 'parse'

@Injectable({
  providedIn: 'root'
})

export class CategoryService {
  name: String;

  constructor(private http: HttpClient,
    private router: Router) { }

  getCategories(): Promise<any> {
    const Category = Parse.Object.extend('category');
    const query = new Parse.Query(Category);
    return query.find();
  }

  addCategory(category: Category) {
    (async () => {
      const myNewObject = new Parse.Object('category');
      myNewObject.set('name', category.name);
      myNewObject.set('active', true);
      try {
        const result = await myNewObject.save();
        console.log('Category created', result);
        this.router.navigate(['/list-category']);
      } catch (error) {
        console.error('Error while creating Category: ', error);
      }
    })();
  }

  async delete(id: string) {
    const query = new Parse.Query('category');
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
