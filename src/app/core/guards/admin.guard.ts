import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServices } from './../services/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(public authService: AuthServices, private route: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      this.authService.checkToken();
      if(this.authService.check){
        if(this.authService.logedUser.userRole == "Administrador"){
          return true;
        }else{
          this.route.navigate(['/']);
          return false;
        }
      }else{
        this.route.navigate(['/']);
        return false;
      }
  }

}
