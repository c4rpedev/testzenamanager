import { UserService } from 'src/app/core/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { GetProvincesService } from 'src/app/core/services/get-provinces.service';
import { TransportService } from 'src/app/core/services/transport.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-transport',
  templateUrl: './edit-transport.component.html',
  styleUrls: ['./edit-transport.component.scss']
})
export class EditTransportComponent implements OnInit {
  loading: boolean;
  transporte: any[] = [];
  agencias: any[] = [];
  agency: string;
  transportForm: FormGroup;
  transporteArray: any;
  transporteArrayM: any;
  provincesP: any;
  disable = true;
  provinceArray: [[string, number]] = [['', 0]];

  constructor(private transportService: TransportService,
    private fb: FormBuilder,
    private userService: UserService,
    private provinceService: GetProvincesService) {

    this.transportForm = this.fb.group({
      agency: this.agency,
      quantities: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.getProvinces();
    // this.getAgencys();
    this.transportService.getTransport().then(res => {
      this.transporte = res;
    });
  }

  //NEW
  getProvinces() {
    this.provincesP = this.provinceService.getProvinces();
    this.getCostProvinces();
  }

  getCostProvinces() {
    this.transportService.getT().then(res => {
      if (res[0]) {
        this.provinceArray = res[0].attributes.costos;
      }
      // for (let index = 0; index < this.provincesP.length; index++) {
      //   const element = this.provincesP[index];
      //   var find = false;
      //   for (let j = 0; j < this.provinceArray.length; index++) {
      //     const elementJ = this.provinceArray[j];
      //     if (elementJ[j] == element.name) {
      //       find = true;
      //     }
      //   }
      //   if (!find) {
      //     if (this.provinceArray[0][0] == '') {
      //       this.provinceArray[0] = [element.name, 0];
      //     } else {
      //       this.provinceArray.push([element.name, 0]);
      //     }
      //   }
      // }
    })
  }

  getCost(province: string){
    for (let index = 0; index < this.provinceArray.length; index++) {
      const element = this.provinceArray[index];
      if(element[0] == province){
        return element[1];
      }
    }
  }

  update(provincia: string, value: string) {
    const val = parseInt(value);
    var existe = false;
    for (let index = 0; index < this.provinceArray.length; index++) {
      const element = this.provinceArray[index];
      if (element[0] == provincia) {
        element[1] = val;
        var existe = true;
      }
    }
    if (!existe) {
      if (this.provinceArray[0][0] == '') {
        this.provinceArray[0] = [provincia, val];
      } else {
        this.provinceArray.push([provincia, val]);
      }
    }
  }

  onSubmit() {
    Swal.fire({
      position: 'top-end',
      icon: 'warning',
      title: 'Actualizando costos de transporte. Por favor espere.',
      showConfirmButton: false,
      timer: 1500
    })
    this.transportService.updateT(this.provinceArray);
  }

  //OLD
  getAgencys() {
    this.userService.getAgencys().then(res => {
      this.agencias = res;
    })
  }

  quantities(): FormArray {
    return this.transportForm.get("quantities") as FormArray
  }

  newQuantity(): FormGroup {
    return this.fb.group({
      municipio: '',
      precio: '',
    })
  }

  addQuantity() {
    this.quantities().push(this.newQuantity());
  }

  removeQuantity(i: number) {
    this.quantities().removeAt(i);

  }

  onChangeAgency() {
    this.loading = true;
    this.transportService.getTransportForAgency(this.agency).then(res => {
      this.transporteArray = res;
      console.log(this.transporteArray);
      if (this.transporteArray[0]) {
        this.transporteArrayM = this.transporteArray[0].attributes;
        console.log(this.transporteArrayM.transporte);
        this.quantities().clear();
        this.transporteArrayM.transporte.forEach((element: any) => {
          console.log(element);
          this.quantities().push(this.fb.group(element));
        });
      }
      this.loading = false;
    })
  }
  keys(): Array<string> {
    return Object.keys(this.transporteArray);
  }
  // onSubmit() {
  //   Swal.fire({
  //     position: 'top-end',
  //     icon: 'success',
  //     title: 'Transporte actualizado',
  //     showConfirmButton: false,
  //     timer: 1500
  //   })
  //   this.transportService. updateTransport(this.transporteArray[0].id, this.transportForm.value['quantities']);
  // }


}
