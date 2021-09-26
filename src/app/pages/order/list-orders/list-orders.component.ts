import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/core/services/order.service';
import Swal from 'sweetalert2';
import { DOCUMENT } from '@angular/common';
import { AuthServices } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { MatTableDataSource } from '@angular/material/table';


import { Order } from 'src/app/core/models/order';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { StatesService } from 'src/app/core/services/states.service';
import { MunicipioService } from 'src/app/core/services/municipio.service';
import { TransportService } from 'src/app/core/services/transport.service';
import { GetProvincesService } from 'src/app/core/services/get-provinces.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { stringify } from '@angular/compiler/src/util';
import { SucursalService } from 'src/app/core/services/sucursal.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export const CONDITIONS_LIST = [

  { value: "is-equal", label: "Es igual" },
  { value: "is-not-equal", label: "No es igual" },
];

export const CONDITIONS_FUNCTIONS = {
  // search method base on conditions list value
  "is-equal": function (value, filterdValue) {
    let valueF = value.toString().toLowerCase();
    return (valueF.indexOf(filterdValue) !== -1);
  },
  "is-not-equal": function (value, filterdValue) {
    let valueF = value.toString().toLowerCase();
    return valueF.indexOf(filterdValue) == -1;
  },
};

export const CONDITIONS_FUNCTIONSES = {
  // search method base on conditions list value
  "is-equal": function (value, filterdValue) {
    return value == filterdValue;
  },
  "is-not-equal": function (value, filterdValue) {

    return value != filterdValue;
  },
};

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.scss']
})
export class ListOrdersComponent implements OnInit {
  options: string[] = ['Delhi', 'Mumbai', 'Banglore'];
  orders: Array<any> = [];
  user: string;
  admin: boolean;
  sucursal: boolean;
  restaurante: boolean;
  loading: boolean;
  // displayedColumns: string[] = ['id', 'date', 'agency', 'client', 'products', 'reciver', 'province', 'municipio','phone', 'state', 'accions'];

  dataSource: any;
  state: string = 'Selecciona un estado';
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  province: string;
  provinces: any[] = [];
  municipios: any[] = [];
  transporte: any[] = [];
  sucursalArray: any[] = [];
  startdate: string;
  enddate: string;
  albaranes: string = 'albaranes.jpg'
  public displayedColumns: string[];


  public conditionsList = CONDITIONS_LIST;
  public searchValue: any = {};
  public searchCondition: any = {};

  private _filterMethods = CONDITIONS_FUNCTIONS;
  private _filterMethodsEs = CONDITIONS_FUNCTIONSES;

  filterForm = new FormGroup({
    fromDate: new FormControl(),
    toDate: new FormControl(),
  });

  isnotequal: string = 'is-not-equal';
  get fromDate() { return this.filterForm.get('fromDate').value; }
  get toDate() { return this.filterForm.get('toDate').value; }
  filterSelectObj = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private orderService: OrderService,
    private userService: UserService,
    private router: Router,
    private stateService: StatesService,
    private municipioService: MunicipioService,
    private provinceService: GetProvincesService,
    private transportService: TransportService,
    private sucursalService: SucursalService,
    public auth: AuthServices,
    @Inject(DOCUMENT) public document: Document) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // Object to create Filter for

  }

  async ngOnInit() {
    //this.initEqualOption();
      this.loading = true;
      this.user = this.auth.logedUser.userName;
      this.restaurante = this.userService.isRestaurant(this.user);
      this.provinces = this.provinceService.getProvinces();
      this.transportService.getTransport().then(res => {
        this.transporte = res;
      });
      this.sucursalService.getSucursal().then(res => {
        this.sucursalArray = res;
      });
      if (this.auth.Admin()) {
        this.orderService.getOrderSucursal(this.user).then(res => {
          res.forEach((element: any) => {
            this.orders.push(element);
          });
          this.dataSource = new MatTableDataSource<Order>(this.orders);

          console.log(this.dataSource);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sortingDataAccessor = (item: any, property: any) => {
            switch (property) {
              case 'date': return item.attributes.createdAt;
              case 'id': return item.attributes.orderId;
              default: return item[property];
            }
          }
          this.sort.sort(({ id: 'date', start: 'desc' }) as MatSortable);
          this.dataSource.sort = this.sort;
          this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
          this.dataSource.filterPredicate = (p: any, filtre) => {
            let result = true;
            let keys = Object.keys(p.attributes); // k
            for (const key of keys) {
              let searchCondition = filtre.conditions[key]; // et search filter method
              if (this.fromDate && this.toDate) {
                if (!(p.attributes.createdAt >= this.fromDate && p.attributes.createdAt <= this.toDate)) {
                  result = false; // if one of the filters method not succeed the row will be remove from the filter result
                  break;
                }
              }
              if (searchCondition && searchCondition !== "none") {
                if (
                  filtre.methods[searchCondition](p.attributes[key], filtre.values[key]) ===
                  false
                ) {
                  // invoke search filter
                  result = false; // if one of the filters method not succeed the row will be remove from the filter result
                  break;
                }
              }
            }
            return result;
          };

          this.isAdmin();
          this.loading = false;
          this.sucursal = this.auth.Sucursal();

          if (this.admin || this.sucursal) {
            this.displayedColumns = ['id', 'date', 'agency', 'client', 'products', 'reciver', 'province', 'municipio', 'mobile', 'phone', 'state', 'accions'];
          } else {
            this.displayedColumns = ['id', 'date', 'client', 'products', 'reciver', 'province', 'municipio', 'mobile', 'phone', 'state', 'accions'];
          }
          if (this.orderService.edit) {
            this.searchValue = this.orderService.values;
            this.searchCondition = this.orderService.conditions;
            this._filterMethods = this.orderService.methods;
            this.orderService.edit = false;
            this.applyFilter();
          }else{
            this.orderService.conditions = null;
          }
        })
      } else {
        this.orderService.getOrder(this.user).then(res => {
          res.forEach((element: any) => {
            this.orders.push(element);
          });
          console.log('orders!!!!!')
          console.log(this.orders);
          console.log('RESSSS!!!')
          console.log(res)
          this.dataSource = new MatTableDataSource<Order>(this.orders);


          this.dataSource.paginator = this.paginator;
          this.dataSource.sortingDataAccessor = (item: any, property: any) => {
            switch (property) {
              case 'date': return item.attributes.createdAt;
              case 'id': return item.attributes.orderId;
              default: return item[property];
            }
          }
          this.sort.sort(({ id: 'date', start: 'desc' }) as MatSortable);
          this.dataSource.sort = this.sort;
          this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
          this.dataSource.filterPredicate = (p: any, filtre) => {
            let result = true;
            let keys = Object.keys(p.attributes); // k
            for (const key of keys) {
              let searchCondition = filtre.conditions[key]; // et search filter method
              if (this.fromDate && this.toDate) {
                if (!(p.attributes.createdAt >= this.fromDate && p.attributes.createdAt <= this.toDate)) {
                  result = false; // if one of the filters method not succeed the row will be remove from the filter result
                  break;
                }
              }
              if (searchCondition && searchCondition !== "none") {
                if (
                  filtre.methods[searchCondition](p.attributes[key], filtre.values[key]) ===
                  false
                ) {
                  // invoke search filter
                  result = false; // if one of the filters method not succeed the row will be remove from the filter result
                  break;
                }
              }
            }
            return result;
          };

          // this.dataSource.filterPredicate = (data: any, filter: string) => {
          //   return data.attributes['state'] == filter;
          //  };
          this.isAdmin();
          this.checkState();
          this.loading = false;

          if (this.admin || this.sucursal || this.restaurante) {
            this.displayedColumns = ['id', 'date', 'agency', 'sucursal', 'client', 'products', 'reciver', 'province', 'municipio', 'mobile', 'phone', 'state', 'accions'];
          } else {
            this.displayedColumns = ['id', 'date', 'client', 'products', 'reciver', 'province', 'municipio', 'mobile', 'phone', 'state', 'accions'];
          }

          if (this.orderService.edit) {
            this.searchValue = this.orderService.values;
            this.searchCondition = this.orderService.conditions;
            this._filterMethods = this.orderService.methods;
            this.orderService.edit = false;
            this.applyFilter();
          }else{
            this.orderService.conditions = null;
          }

        })
      }



  }


  initEqualOption() {
    this.searchCondition.orderId = 'is-equal';
    this.searchCondition.orderAgency = 'is-equal';
    this.searchCondition.orderSucursal = 'is-equal';
    this.searchCondition.orderClientName = 'is-equal';
    this.searchCondition.orderRecieverName = 'is-equal';
    this.searchCondition.orderProvince = 'is-equal';
    this.searchCondition.orderMunicipio = 'is-equal';
    this.searchCondition.orderPhone = 'is-equal';
    this.searchCondition.orderMobile = 'is-equal';
    this.searchCondition.state = 'is-equal';
  }


  applyFilter() {
    let searchFilter: any = {
      values: this.searchValue,
      conditions: this.searchCondition,
      methods: this._filterMethods,
    };

    this.orderService.values = this.searchValue;
    this.orderService.conditions = this.searchCondition;
    this.orderService.methods = this._filterMethods;

    this.dataSource.filter = searchFilter;
  }

  clearColumnDate(): void {
    this.filterForm = new FormGroup({
      fromDate: new FormControl(),
      toDate: new FormControl(),
    });
    this.applyFilter();
  }
  // --- applyFilter for other columns diferents a Recibe y Cliente
  applyFilterEs() {

    let searchFilter: any = {
      values: this.searchValue,
      conditions: this.searchCondition,
      methods: this._filterMethodsEs,
    };

    this.dataSource.filter = searchFilter;
  }


  clearColumn(columnKey: string): void {
    this.searchValue[columnKey] = null;
    this.searchCondition[columnKey] = "none";
    this.applyFilter();
  }
  clearColumnES(columnKey: string): void {
    this.searchValue[columnKey] = null;
    this.searchCondition[columnKey] = "none";
    this.applyFilterEs();
  }

  isAdmin() {
    this.admin = this.auth.Admin();
  }

  //Check the state of the order and change it in consideration of the days before the end of the Delivery Time
  checkState() {
    for (let order of this.orders) {
      let currentDate = new Date();
      let orderDate = new Date();
      orderDate = order.attributes.createdAt;

      //Removing time in dates
      orderDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      var diffBetweenDates = Math.abs(orderDate.getTime() - currentDate.getTime());
      var diffInDays = Math.ceil(diffBetweenDates / (1000 * 3600 * 24));

      var deliveryTime = this.stateService.getDeliveryTime(order.attributes.orderProvince);
      if (order.attributes.state == "En Proceso" || order.attributes.state.includes("En Tiempo") || order.attributes.state.includes("En Termino") || order.attributes.state.includes("Atrasado")) {
        if (diffInDays == deliveryTime - 1) {
          this.orderService.updateOrderState(order.id, 'En Termino')
        } else if (diffInDays < deliveryTime) {
          this.orderService.updateOrderState(order.id, 'En Tiempo' + ' ' + (deliveryTime - diffInDays - 1))
        } else if (diffInDays > deliveryTime || diffInDays == deliveryTime) {
          this.orderService.updateOrderState(order.id, 'Atrasado' + ' ' + (diffInDays - deliveryTime + 1))
        }
      }

      //Archivar las órdenes Finalizadas que tienen más de 15 días sin modificar
      var diffModif = Math.abs(order.attributes.updatedAt.getTime() - currentDate.getTime());
      var diffModDays = Math.ceil(diffModif / (1000 * 3600 * 24));
      if (order.attributes.state == "Finalizado" && diffModDays > 15) {
        this.orderService.updateOrderState(order.id, 'Archivado')
      }

    }
  }

  addComplain(order: any, orderId: String) {
    this.router.navigate(['/b']);
    this.router.navigateByUrl('/add-complain', { state: { order: order, orderId: orderId, user: this.user, admin: this.admin, sucursal: this.sucursal } });
  }


  addOrder() {
    this.router.navigate(['/b']);
    if (this.user == 'patugente') {
      this.router.navigateByUrl('/add-order-sucursal')
    } else {
      this.router.navigateByUrl('/list-product', { state: { who: "order" } });
    }

  };

  deleteOrder(order: any) {
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
        console.log(order.id);

        this.orderService.deleteOrder(order.id);
        Swal.fire(
          'Borrado!',
          'La orden ha sido eliminado.',
          'success'
        )
        this.router.navigate(['/b']);
        this.router.navigateByUrl('/list-order');
      }
    })
  }

  editOrder(order: any, orderId: String) {
    console.log(orderId);
    this.router.navigate(['/b']);
    this.router.navigateByUrl('/edit-order', { state: { order: order, orderId: orderId, user: this.user, admin: this.admin, sucursal: this.sucursal } });
  }

}
