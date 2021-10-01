import { ClientService } from './../../../core/services/client.service';
import { AuthServices } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { User } from './../../../core/models/user';
import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Client } from 'src/app/core/models/client';

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
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.scss']
})
export class ListClientComponent implements OnInit {

  client: Client = new Client();
  clients: Array<any> = [];
  loading: boolean;
  dataSource: any;

  userauth: string;
  admin: boolean;

  public displayedColumns = ['clientId', 'name', 'email', 'phoneNumber', 'accions'];

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



  constructor(
    public clientService: ClientService,
    public router: Router,
    public auth: AuthServices
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.userauth = this.auth.logedUser.userName;
    this.getClients();
    this.admin = this.auth.Admin();
  }

  getClients() {
    this.clients = [];
    this.clientService.getClients().then(res => {
      res.forEach((element: any) => {
        this.clients.push(element);
      });
      this.dataSource = new MatTableDataSource<User>(this.clients);

      this.dataSource.paginator = this.paginator;

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

      this.loading = false;
    })
  }

  clearColumn(columnKey: string): void {
    this.searchValue[columnKey] = null;
    this.searchCondition[columnKey] = "none";
    this.applyFilter();
  }

  clearColumnDate(): void {
    this.filterForm = new FormGroup({
      fromDate: new FormControl(),
      toDate: new FormControl(),
    });
    this.applyFilter();
  }

  applyFilter() {
    let searchFilter: any = {
      values: this.searchValue,
      conditions: this.searchCondition,
      methods: this._filterMethods,
    };

    this.dataSource.filter = searchFilter;
  }

  newClient(){
    this.clientService.selectedClient = new Client();
    this.router.navigate(['/add-client']);
  }

  editClient(client: any) {
    this.clientService.selectedClient = client;
    this.router.navigate(['/add-client']);
  }

  deleteClient(client: any) {
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
        this.clientService.deleteClient(client.id).then(res => {
          this.getClients();
        });
        Swal.fire(
          'Borrado!',
          'El Cliente ha sido eliminado.',
          'success'
        )
      }
    })
  }

}
