import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { UserService } from "./services/user.service";
import { DataService } from './services/data.service';
import { User } from "./models/user";
import { Http } from '@angular/http';
import { Roles } from "./models/role";

@Component({
  selector: 'app-root',
  templateUrl: `./app.component.html`,
  styleUrls: [`./app.component.css`],
})
export class AppComponent implements OnInit{

  userEmail: string;
  arRoles: Roles[] = new Array();
 
  constructor(public auth: AuthService,
    private ngZone: NgZone,
    public userService: UserService,
    public http: Http,
    public DataService: DataService) {
      this.userEmail = localStorage.getItem("email");
      auth.isUserAdmin();
      auth.handleAuthentication();
      DataService.ifUserExists(localStorage.getItem("email"));
      
  }

  ngOnInit() {}

}
