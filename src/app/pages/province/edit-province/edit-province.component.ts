import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { GetProvincesService } from 'src/app/core/services/get-provinces.service';
import { MunicipioService } from 'src/app/core/services/municipio.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-edit-province',
  templateUrl: './edit-province.component.html',
  styleUrls: ['./edit-province.component.scss']
})
export class EditProvinceComponent implements OnInit  {
  name = 'Angular';  
  provinces: any [] = [];
  province: string ;  
  selectedProvince: string ; 
  productForm: FormGroup;  
  municipios: any;
  loading: boolean;
  municipiosR: Array<any> = [];
  constructor(private fb:FormBuilder, 
              private provinceService: GetProvincesService,
              private municipioService: MunicipioService) {  
     
    this.productForm = this.fb.group({  
      provincia: this.province,  
      quantities: this.fb.array([]) ,  
    });  
  }  

  ngOnInit(): void {
    this.provinces = this.provinceService.getProvinces();
   
  }

  changeProvince(){
    this.loading = true;
    this.municipioService.getMunicipio(this.selectedProvince).then(res=>{
      this.municipios = res;  
      console.log(this.municipios);
      this.municipiosR=this.municipios[0].attributes['municipios'];
      this.quantities().clear();
      this.municipiosR.forEach(element => {
        console.log(element);
        
        this.quantities().push(this.fb.group(element));  
      });
      this.loading = false;
    })
  }
    
  quantities() : FormArray {  
    return this.productForm.get("quantities") as FormArray  
  }  
     
  newQuantity(): FormGroup {  
    return this.fb.group({  
      municipio: '',  
    
    })  
  }  
     
  addQuantity() {  
    this.quantities().push(this.newQuantity());  
  }  
     
  removeQuantity(i:number) {  
    this.quantities().removeAt(i);  
    
  }  
     
  onSubmit() {  
    console.log(this.productForm.value['quantities']);  
    console.log(this.municipios[0].id);
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Municipios actualizados',
      showConfirmButton: false,
      timer: 1500
    })
    this.municipioService.updateMunicipio(this.municipios[0].id, this.productForm.value['quantities']);
  } 
} 