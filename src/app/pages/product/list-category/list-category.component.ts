
import { Category } from './../../../core/models/category';
import { CategoryService } from './../../../core/services/category.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss']
})
export class ListCategoryComponent implements OnInit {
  categories: Array<any>;
  loading: boolean;

  constructor(private router: Router,
    public service: CategoryService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.loading = true;
    this.service.getCategories().then(res => {
      this.categories = res;
      this.loading = false;
    })
  }

  deleteCategory(category: any) {
    this.service.delete(category.id).then(res=>{
      this.getCategories();
    })
  }

}
