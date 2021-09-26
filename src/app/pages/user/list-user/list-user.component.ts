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
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  user: User = new User();
  users: Array<any> = [];
  loading: boolean;
  dataSource: any;

  userauth: string;
  admin: boolean;

  public displayedColumns = ['objectId', 'date', 'userName', 'emailId', 'phoneNumber', 'userRole', 'accions'];

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
    public userService: UserService,
    public router: Router,
    public auth: AuthServices
  ) { }

  async ngOnInit() {
    this.loading = true;
    this.userauth = this.auth.logedUser.userName;
    this.loading = true;
    this.getUsers();
    this.isAdmin();
  }

  getUsers() {
    this.users = [];
    this.userService.getUsers().then(res => {
      res.forEach((element: any) => {
        this.users.push(element);
      });
      console.log('orders!!!!!')
      console.log(this.users);
      console.log('RESSSS!!!')
      console.log(res)
      this.dataSource = new MatTableDataSource<User>(this.users);


      this.dataSource.paginator = this.paginator;
      // this.dataSource.sortingDataAccessor = (item: any, property: any) => {
      //   switch (property) {
      //     case 'date': return item.attributes.createdAt;
      //     case 'id': return item.attributes.orderId;
      //     default: return item[property];
      //   }
      // }
      // this.sort.sort(({ id: 'date', start: 'desc' }) as MatSortable);
      // this.dataSource.sort = this.sort;
      // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
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

      //////PONER FILTROS LUEGO DE EDITAR UN USUARIO
      // if (this.orderService.edit) {
      //   this.searchValue = this.orderService.values;
      //   this.searchCondition = this.orderService.conditions;
      //   this._filterMethods = this.orderService.methods;
      //   this.orderService.edit = false;
      //   this.applyFilter();
      // }else{
      //   this.orderService.conditions = null;
      // }

    })
  }

  editUser(user: any, userId: String) {
    this.userService.selectedUser = user;
    console.log(user)
    this.router.navigate(['/add-user']);
  }

  deleteUser(user: any) {
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
        this.userService.deleteUser(user.id).then(res => {
          this.getUsers();
        });
        Swal.fire(
          'Borrado!',
          'El usuario ha sido eliminado.',
          'success'
        )
      }
    })
  }


  isAdmin() {
    this.admin = this.auth.Admin();
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

    //////PONER FILTROS LUEGO DE EDITAR UN USUARIO
    // this.orderService.values = this.searchValue;
    // this.orderService.conditions = this.searchCondition;
    // this.orderService.methods = this._filterMethods;

    this.dataSource.filter = searchFilter;
  }

  NewUser(){
    this.userService.selectedUser = new User();
    this.router.navigate(['/add-user']);
  }



}


