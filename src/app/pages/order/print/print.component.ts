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

  constructor(public orderService: OrderService) { }



  ngOnInit(): void {
    this.dataSource = this.orderService.dataSource;
    this.albaranes = this.orderService.albaranes;
    this.orderService.displayedColumns.forEach(element => {
      if(element != 'accions'){
        this.displayedColumns.push(element);
      }
    });
    this.dataSource.paginator = this.paginator;
    console.log(this.dataSource);

    // this.displayedColumns = this.orderService.displayedColumns;
    // console.log(this.dataSource);
    // console.log(this.orderService.printOrders);
    // console.log(this.orderService.printOrders[0].attributes.orderClientName)
  }

  print() {
    window.print();
  }

}
