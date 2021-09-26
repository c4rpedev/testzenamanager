import { Injectable } from '@angular/core';
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireModule } from '@angular/fire';
@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private firestorage: AngularFireStorageModule, private firebase: AngularFireModule) {
     
   }
   
}
