import { CategoryService } from './../../../core/services/category.service';
import { RoleService } from './../../../core/services/role.service';
import { User } from './../../../core/models/user';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  user: User = new User();
  mobNumberPattern = "^5+[0-9]{7}$";
  repeatpassword: any;
  roles: Array<any>;
  categories: Array<any> = [];
  isImg = false;
  filePath: String;
  file: File;
  photosrc: String;
  selectedRole: String;
  categoriaMayoreo: string;
  tipoMayoreo: string;
  cantMayoreo: number;
  mayoreo: [[string, string, number]] = [['', '', 0]];
  cleancategories = true;
  editar = false;
  img: string | ArrayBuffer =
    "https://parsefiles.back4app.com/vH5Y2pQQTnE8odu7xeMKMzviCtFuPHQAvQogW4GI/7b7b788e29df265cb59d20c2682aba24_product.jpg";


  constructor(public userService: UserService,
    public router: Router,
    public roleService: RoleService,
    public categoryService: CategoryService) { }

  ngOnInit(): void {
    this.getRoles();
    this.getCategories();
    this.initMayoreo();
    this.selectedRole = this.userService.selectedUser.userRole;
    if (this.userService.selectedUser.logo) {
      this.img = this.userService.selectedUser.logo['_url'];
    }
    if(this.userService.selectedUser.createdAt){
      this.editar = true;
    }

  }

  getRoles() {
    this.roleService.getRoles().then(res => {
      this.roles = res;
      console.log(this.roles)
    })
  }

  //Para controlar qué rol está seleccionado y mostrar u ocultar opciones en dependencia
  selectRole(rol: string) {
    this.selectedRole = rol;
  }

  getCategories() {
    this.categoryService.getCategories().then(res => {
      res.forEach(element => {
        this.categories.push(element.attributes.name)
      })
    })
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.userService.selectedUser.createdAt) {
        // EDITAR USUARIO
        form.value.mayoreo = this.mayoreo;
        this.userService.editUser(form.value, this.img.toString());
        Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: 'Actualizando Usuario, por favor espere.',
          showConfirmButton: false,
          timer: 15000
        })
      } else {
        // CREAR NUEVO USUARIO
        this.userService.selectedUser.mayoreo = this.mayoreo;
        this.userService.addUser(this.userService.selectedUser, this.img.toString());
        Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: 'Añadiendo Usuario, por favor espere.',
          showConfirmButton: false,
          timer: 15000
        })
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Complete todos los campos obligatorios!',
      })
    }
  }

  photo(event: any) {
    this.filePath = event.files;
    console.log("Path");
    console.log(this.filePath);
    this.file = event[0];
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = event => {
      this.img = reader.result;
      this.isImg = true;
    };
  }

  //Gestionando el arreglo de Mayoreo
  addMayoreo() {
    var success = true;
    if (this.categoriaMayoreo != '--Seleccione una categoría--' && this.categoriaMayoreo != null && this.tipoMayoreo != null && this.cantMayoreo != null) {
      this.mayoreo.forEach(element => {
        if (element[0] == this.categoriaMayoreo) {
          success = false;
        }
      });
      if (success) {
        if (this.mayoreo[0][0] == '') {
          this.mayoreo[0] = [this.categoriaMayoreo, this.tipoMayoreo, this.cantMayoreo];
        } else {
          this.mayoreo.push([this.categoriaMayoreo, this.tipoMayoreo, this.cantMayoreo])
        }
        for (let index = 0; index < this.categories.length; index++) {
          const element = this.categories[index];
          if (element == this.categoriaMayoreo) {
            this.categories.splice(index, 1);
            index = this.categoriaMayoreo.length;
          }
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Categoría no válida.',
        })
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Faltan datos!',
      })
    }
  }

  deleteMayoreo(categoria: string) {
    if (this.mayoreo.length == 1) {
      this.mayoreo.push(['', '', 0])
    };
    for (let index = 0; index < this.mayoreo.length; index++) {
      const element = this.mayoreo[index];
      if (element[0] == categoria) {
        this.categories.push(categoria);
        this.mayoreo.splice(index, 1);
        index = this.mayoreo.length;
      }
    }
  }

  initMayoreo() {
    if (this.userService.selectedUser.mayoreo) {
      this.mayoreo = this.userService.selectedUser.mayoreo;
    }
  }

  //Quita del select las categorías que están ya en la tabla Mayoreo
  actualizarCategories() {
    if (this.mayoreo && this.cleancategories) {
      this.cleancategories = false;
      this.mayoreo.forEach(element => {
        for (let index = 0; index < this.categories.length; index++) {
          const cat = this.categories[index];
          if (cat == element[0]) {
            this.categories.splice(index, 1);
            index = this.categories.length;
          }
        }
      });
    }
  }

}
