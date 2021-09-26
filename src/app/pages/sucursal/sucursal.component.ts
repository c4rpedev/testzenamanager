import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SucursalService } from 'src/app/core/services/sucursal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sucursal',
  templateUrl: './sucursal.component.html',
  styleUrls: ['./sucursal.component.scss']
})
export class SucursalComponent implements OnInit {
  sucursal: string;
  sucursalId: string;
  sucursalName: any;
  loading: boolean;
  sucursalN: any = [];
  sucursalT: string;
  name: string;
  user: string;


  constructor( private sucursalService: SucursalService,
    private router: Router,) { }

  ngOnInit(): void {
    this.sucursalService.getSucursal().then(res =>{
      this.sucursalName = res;   
      console.log('tests');        
      console.log(this.sucursalName[0].attributes);

    });
  }

  onChangeSucursal(){
      this.sucursalService.getSucursalFromName(this.sucursal).then(res =>{
        this.sucursalId = res[0].id;        
       this.name = res[0].attributes.name;
       this.user = res[0].attributes.user;
              
      })
  }

  onSubmit(form: NgForm){
    if(form.valid){
      if(!this.sucursal){
        console.log('YESS');
        this.sucursalService.addSucursal(this.name, this.user);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Sucursal añadida',
          showConfirmButton: false,
          timer: 1500
        })
        this.router.navigate(['/edit-sucursal']);
  
      }else{
        console.log(this.sucursalN.name);      
        this.sucursalService.updateSucursal(this.sucursalId, this.name, this.user);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Sucursal actualizada',
          showConfirmButton: false,
          timer: 1500
        })
        this.router.navigate(['/edit-sucursal']);
      }
    }

  }
  deleteSucursal(form: NgForm){
    if(form.valid){
    Swal.fire({
      title: 'Estás seguro?',
      text: "No serás capaz de revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borralo!'
    }).then((result) => {
      if (result.isConfirmed) {
         
    
      this.sucursalService.deleteSucursal(this.sucursalId);
      
        Swal.fire(
          'Borrado!',
          'El producto ha sido eliminado.',
          'success'
        )
        this.router.navigate(['/edit-sucursal']);
      }
    })
  }
      
    
   
    
  }

  addSucursal(){

  }

}
