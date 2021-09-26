import { Role } from './../../../core/models/role';
import { NgForm } from '@angular/forms';
import { RoleService } from './../../../core/services/role.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {
  role = new Role();
  img: string | ArrayBuffer =
    "https://parsefiles.back4app.com/vH5Y2pQQTnE8odu7xeMKMzviCtFuPHQAvQogW4GI/7b7b788e29df265cb59d20c2682aba24_product.jpg";

  constructor(private service: RoleService) { }

  ngOnInit(): void {
  }

  saveRole(form: NgForm) {
    if (form.valid) {
      this.service.addRole(form.value);
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Añadiendo rol. Por favor espere.',
        showConfirmButton: false,
        timer: 1500
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Complete todos los campos obligatorios!',
      })
    }
  }

}
