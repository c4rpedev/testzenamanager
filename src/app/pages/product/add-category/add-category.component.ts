import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from './../../../core/services/category.service';
import { Category } from './../../../core/models/category';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
    category: Category = new Category();
    img: string | ArrayBuffer =
    "https://parsefiles.back4app.com/vH5Y2pQQTnE8odu7xeMKMzviCtFuPHQAvQogW4GI/7b7b788e29df265cb59d20c2682aba24_product.jpg";

    constructor(private service: CategoryService,
                private router: Router) {}

    ngOnInit(): void {
    }

    saveProduct(form: NgForm){
      if(form.valid){
        this.service.addCategory(form.value);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Categoría añadida',
          showConfirmButton: false,
          timer: 1500
        })
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Complete todos los campos obligatorios!',
        })
      }

    }

  }
