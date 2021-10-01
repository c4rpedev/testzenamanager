import { ClientService } from './../../../core/services/client.service';
import { Client } from './../../../core/models/client';
import { AuthServices } from './../../../core/services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {

  client: Client = new Client();
  firstlastName: string
  secondlastName: string
  editar = false;
  img: string | ArrayBuffer =
    "https://parsefiles.back4app.com/vH5Y2pQQTnE8odu7xeMKMzviCtFuPHQAvQogW4GI/7b7b788e29df265cb59d20c2682aba24_product.jpg";

  constructor(
    public clientService: ClientService,
    public router: Router,
    public auth: AuthServices
  ) { }

  ngOnInit(): void {
    if(this.clientService.selectedClient.clientId){
      this.editar = true;
    }
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.clientService.selectedClient.clientId) {
        // EDITAR CLIENTE
        this.clientService.editClient(form.value);
        Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: 'Actualizando Cliente, por favor espere.',
          showConfirmButton: false,
          timer: 15000
        })
      } else {
        // CREAR NUEVO CLIENTE
        this.clientService.selectedClient.name = this.clientService.selectedClient.name + ' ' + this.firstlastName + ' ' + this.secondlastName;
        this.clientService.addClient(this.clientService.selectedClient).then(res=>{
          if(this.clientService.emailExist){
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ya existe un cliente con este nombre y apellidos.',
            })
          }else{
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Cliente añadido.',
              showConfirmButton: false,
              timer: 15000
            })
            this.router.navigate(['/list-client']);
          }
        });
        Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: 'Añadiendo Cliente, por favor espere.',
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

}
