import { Injectable } from '@angular/core';
import { GetProvincesService } from './get-provinces.service';

@Injectable({
  providedIn: 'root'
})
export class StatesService {
  provincesArray : Array<any> = this.provinces.getOccidente();
  deliveryTime: number;

  constructor(private provinces: GetProvincesService) { }
  getDeliveryProvince(province: string){
    console.log(this.provincesArray);
    for (const p of this.provincesArray) {
      if(p.name == province){
        return 5;        
      }
    }    
    return 7;
  }
  getDeliveryTime(province: string){           
    return 8;
  }
}
