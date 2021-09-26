import { UserService } from 'src/app/core/services/user.service';
import { AuthServices } from 'src/app/core/services/auth.service';
import { Component, OnInit, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {


  img: String;

  // Example: store the user's info here (Cloud Firestore: collection is 'users', docId is the user's email, lower case)

  constructor(
    private router: Router,
    public auth: AuthServices,
    @Inject(DOCUMENT) public document: Document) {
  }

  ngOnInit(): void {
    if (this.auth.logedUser.logo['_url']) {
      this.img = this.auth.logedUser.logo['_url'];
    }


  }


  logout(): void {
    //this.afAuth.signOut();
  }
  openSettings() {
    this.router.navigateByUrl('/edit-profile');
  }

}
