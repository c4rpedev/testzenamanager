import { RoleService } from './../../../core/services/role.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-role',
  templateUrl: './list-role.component.html',
  styleUrls: ['./list-role.component.scss']
})
export class ListRoleComponent implements OnInit {
  roles: Array<any>;
  loading: boolean;

  constructor(public service: RoleService) { }

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles() {
    this.loading = true;
    this.service.getRoles().then(res => {
      this.roles = res;
      this.loading = false;
    })
  }

  deleteRole(role: any) {
    this.service.delete(role.id).then(res=>{
      this.getRoles();
    })
  }

}
