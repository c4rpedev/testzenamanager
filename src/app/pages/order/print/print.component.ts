import { Router } from '@angular/router';
import { OrderService } from 'src/app/core/services/order.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {

  dataSource: any;
  displayedColumns: any[] = [];
  albaranes: any;

  @ViewChild(MatPaginator) paginator: MatPaginator

  constructor(public orderService: OrderService, private router: Router) { }



  async ngOnInit() {
    await this.init();
    this.print();


    // this.displayedColumns = this.orderService.displayedColumns;
    // console.log(this.dataSource);
    // console.log(this.orderService.printOrders);
    // console.log(this.orderService.printOrders[0].attributes.orderClientName)
  }

  async init(){
    this.dataSource = this.orderService.dataSource;
    this.dataSource.paginator = this.paginator;
    this.albaranes = this.orderService.albaranes;
    await this.orderService.displayedColumns.forEach(element => {
      if(element != 'accions'){
        this.displayedColumns.push(element);
      }
    });

  }

  print() {
    window.print();
    this.router.navigate(['/orders']);
  }

}
