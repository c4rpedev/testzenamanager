import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SmsService } from 'src/app/core/services/sms.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-send-sms',
  templateUrl: './send-sms.component.html',
  styleUrls: ['./send-sms.component.scss']
})
export class SendSmsComponent implements OnInit {
  text: string;
  constructor( public dialogRef: MatDialogRef<SendSmsComponent>,
                @Inject(MAT_DIALOG_DATA) public mobile: any, 
                private smsService: SmsService,) { }

  ngOnInit(): void {
    console.log('Mobile');
    console.log(this.mobile);
    
    
  }
  close(){
    this.dialogRef.close();
  }
  sendSms(form: NgForm){
    if(form.valid){
      this.smsService.send(this.mobile.mobile, this.text)
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'SMS enviado!',
        showConfirmButton: false,
        timer: 1500
      })
      this.dialogRef.close();
    }
   
  }

}
