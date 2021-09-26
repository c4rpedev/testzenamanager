import {  Component, ViewChild, AfterViewInit } from '@angular/core';
import { DxPivotGridComponent, DxChartComponent } from 'devextreme-angular';
import { Order } from 'src/app/core/models/order';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements AfterViewInit {

  @ViewChild(DxPivotGridComponent, { static: false }) pivotGrid: DxPivotGridComponent;
  @ViewChild(DxChartComponent, { static: false }) chart: DxChartComponent;
  orders= new Array<Order>();
  pivotGridDataSource: any;

  constructor(private orderService: OrderService) {
   
  }

  ngAfterViewInit() {
    this.orderService.getOrderSucursal('buttymanager').then(res=>{      
      for (let order of res) {
        console.log('Order');
        this.orders.push(order.attributes);
      }
      this.pivotGridDataSource = {
        fields: [{
          caption: "Agencia",
          width: 120,
          dataField: "orderAgency",
          area: "row",
          sortBySummaryField: "Total"
        }, {
          caption: "Estado",
          dataField: "state",
          width: 150,
          area: "row"
        },
        {
          caption: "Provincia",
          width: 120,
          dataField: "orderProvince",
          area: "row",          
        }, {
          caption: "Municipio",
          dataField: "orderMunicipio",
          width: 150,
          area: "row"
        },{
          dataField: "createdAt",
          dataType: "date",
          area: "column"
        },{
          groupName: "date",
          groupInterval: "month",
          visible: false
        },{
          caption: "Cantidad de Ordenes",
          summaryType: "count",
          area: "data"
        },{
          caption: "Total",
          dataField: "orderPrice",
          dataType: "number",
          summaryType: "sum",
          format: "currency",
          area: "data"
        }],
        store: this.orders
      }                 
    }); 
    this.pivotGrid.instance.bindChart(this.chart.instance, {
      dataFieldsDisplayMode: "splitPanes",
      alternateDataFields: false
    });

    setTimeout(() => {
        var dataSource = this.pivotGrid.instance.getDataSource();
       
    }, 0);
  }

  // customizeTooltip(args:any) {
  //   return {
  //     html: args.seriesName + " | Total<div class='currency'>" + args.valueText + "</div>"
  //   };
  // }
}