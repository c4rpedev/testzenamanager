import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetProvincesService {
  provinces = [      
    { name: "Pinar del Río", value: 1 },
    { name: "Artemisa", value: 2 },
    { name: "La Habana", value: 3 },
    { name: "Mayabeque", value: 4 },
    { name: "Matanzas", value: 5 },
    { name: "Cienfuegos", value: 6 },
    { name: "Villa Clara", value: 7 },
    { name: "Sancti Spíritus", value: 8 },
    { name: "Ciego de Ávila", value: 9 },
    { name: "Camagüey", value: 10 },
    { name: "Las Tunas", value: 11 },   
    { name: "Granma", value: 12 },
    { name: "Holguin", value: 13 },
    { name: "Santiago de Cuba", value: 14 },
    { name: "Guantánamo", value: 15 },
    { name: "Isla de la Juventud", value: 16 }
  ]
  provincesAdd = [       
    { name: "Occidente", value: 1 },
    { name: "Oriente", value: 1 },
    { name: "Pinar del Río", value: 1 },
    { name: "Artemisa", value: 2 },
    { name: "La Habana", value: 3 },
    { name: "Mayabeque", value: 4 },
    { name: "Matanzas", value: 5 },
    { name: "Cienfuegos", value: 6 },
    { name: "Villa Clara", value: 7 },
    { name: "Sancti Spíritus", value: 8 },
    { name: "Ciego de Ávila", value: 9 },
    { name: "Camagüey", value: 10 },
    { name: "Las Tunas", value: 11 },   
    { name: "Granma", value: 12 },
    { name: "Holguin", value: 13 },
    { name: "Santiago de Cuba", value: 14 },
    { name: "Guantánamo", value: 15 },
    { name: "Isla de la Juventud", value: 16 }
  ]
  occidente = [    
    { name: "Artemisa", value: 2 },
    { name: "La Habana", value: 3 },
    { name: "Mayabeque", value: 4 },
    { name: "Matanzas", value: 5 },
    { name: "Cienfuegos", value: 6 },
    { name: "Villa Clara", value: 7 },
    { name: "Sancti Spíritus", value: 8 },
    { name: "Ciego de Ávila", value: 9 },
    { name: "Camagüey", value: 10 },   
    { name: "Isla de la Juventud", value: 16 }
  ]
  constructor() { }

  getProvinces(){
    return this.provinces;
  }
  getProvincesAdd(){
    return this.provincesAdd;
  }
  getOccidente(){
    return this.occidente;
  }
}
