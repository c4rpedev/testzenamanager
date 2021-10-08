import { AuthServices } from './../../../core/services/auth.service';
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
  listcatMayoreo: string[] = [];
  categoriaMayoreo: string;
  tipoMayoreo: string;
  cantMayoreo: number;
  mayoreo: [[string, string, number]] = [['', '', 0]];
  cleancategories = true;
  editar = false;
  caracterInvalid = false;
  passInvalid = false;
  categorias: any[] = [];
  img: string | ArrayBuffer =
    "https://parsefiles.back4app.com/vH5Y2pQQTnE8odu7xeMKMzviCtFuPHQAvQogW4GI/7b7b788e29df265cb59d20c2682aba24_product.jpg";


  constructor(public userService: UserService,
    public router: Router,
    public roleService: RoleService,
    public categoryService: CategoryService,
    public auth: AuthServices) { }

  ngOnInit(): void {
    this.getRoles();
    this.getCategories();
    this.initMayoreo();
    this.selectedRole = this.userService.selectedUser.userRole;
    if (this.userService.selectedUser.logo) {
      this.img = this.userService.selectedUser.logo['_url'];
    }
    this.initCategories();
    if(this.userService.selectedUser.createdAt){
      this.editar = true;
    }

  }

  initCategories(){
    if(this.userService.selectedUser.userCategories){
      this.categorias = this.userService.selectedUser.userCategories;
      this.userService.selectedUser.userCategories.forEach(element => {
        if(element != 'Todas'){
          this.listcatMayoreo.push(element);
        }
      });
    }
  }

  getRoles() {
    this.roleService.getRoles().then(res => {
      this.roles = res;
      console.log(this.roles)
    })
  }

  getCategories() {
    this.categoryService.getCategories().then(res => {
      res.forEach(element => {
        this.categories.push(element.attributes.name)
      })
    })
  }

  checkRepeatPassword(){
    if(this.userService.selectedUser.password != this.repeatpassword){
      this.passInvalid = true;
    }else{
      this.passInvalid = false;
    }
  }

  onSubmit(form: NgForm) {
    if (form.valid && this.passInvalid == false) {
      if(this.img != 'https://parsefiles.back4app.com/vH5Y2pQQTnE8odu7xeMKMzviCtFuPHQAvQogW4GI/7b7b788e29df265cb59d20c2682aba24_product.jpg'){
        this.userService.userImg = true;
      }
      // this.userService.selectedUser.phoneNumber = this.userService.selectedUser.phoneNumber.toString();
      if (this.userService.selectedUser.createdAt) {
        // EDITAR USUARIO
        if(this.auth.Agencia()){
          form.value.mayoreo = this.mayoreo;
        }else{
          if(this.auth.Admin()){
            form.value.priceCategories = this.mayoreo;
            form.value.userCategories = this.categorias;
          }
        }
        this.userService.admin = this.auth.Admin()
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
        this.userService.selectedUser.priceCategories = this.mayoreo;
        this.userService.selectedUser.userCategories = this.categorias;
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
    if(this.auth.Admin()){
      this.tipoMayoreo = '%';
    }
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
        for (let index = 0; index < this.listcatMayoreo.length; index++) {
          const element = this.listcatMayoreo[index];
          if (element == this.categoriaMayoreo) {
            this.listcatMayoreo.splice(index, 1);
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
    this.actualizarCategories();
    if (this.mayoreo.length == 1) {
      this.mayoreo.push(['', '', 0])
    };
    for (let index = 0; index < this.mayoreo.length; index++) {
      const element = this.mayoreo[index];
      if (element[0] == categoria) {
        this.listcatMayoreo.push(categoria);
        this.mayoreo.splice(index, 1);
        index = this.mayoreo.length;
      }
    }
  }

  initMayoreo() {
    if (this.auth.Agencia() && this.userService.selectedUser.mayoreo) {
      this.mayoreo = this.userService.selectedUser.mayoreo;
    }else{
      if(this.auth.Admin() && this.userService.selectedUser.priceCategories){
        this.mayoreo = this.userService.selectedUser.priceCategories;
      }
    }
  }

  //Quita del select las categorías que están ya en la tabla Mayoreo
  actualizarCategories() {
    if (this.mayoreo && this.cleancategories) {
      this.cleancategories = false;
      this.mayoreo.forEach(element => {
        for (let index = 0; index < this.listcatMayoreo.length; index++) {
          const cat = this.listcatMayoreo[index];
          if (cat == element[0]) {
            this.listcatMayoreo.splice(index, 1);
            index = this.listcatMayoreo.length;
          }
        }
      });
    }
  }

  //Gestionando el arreglo de Categorías de productos a los que puede acceder ese usuario
  selectCatProd(item: string) {
    let categoryNotIn = true;
    for (let index = 0; index < this.categorias.length; index++) {
      const element = this.categorias[index];
      if (item == element) {
        this.categorias.splice(index, 1)
        categoryNotIn = false;
      }
    }
    for (let index = 0; index < this.listcatMayoreo.length; index++) {
      const element = this.listcatMayoreo[index];
      if (item == element) {
        this.listcatMayoreo.splice(index, 1)
      }
    }
    if (categoryNotIn) {
      this.categorias.push(item);
      this.listcatMayoreo.push(item);
    }
  }

  verifyCatProd(item: string) {
    for (let index = 0; index < this.categorias.length; index++) {
      const element = this.categorias[index];
      if (item == element) {
        return true;
      }
    }
    return false;
  }

}
