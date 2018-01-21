import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from './../../services/auth/auth.service';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Component({
  selector: 'profile',
  templateUrl: `./profile.component.html`,
  styleUrls: [`./profile.component.css`],
  providers: [UserService, AuthService]
})

export class ProfileComponent implements OnInit {
  constructor(private service: UserService,
    public auth: AuthService, public authHttp: AuthHttp) {
  }

  profile: any;
  API_URL: string = 'http://http://localhost:63409/api';
  message: string;
  text: string = "Hello Guest";

  ngOnInit() {
    this.auth.getProfile((err, profile) => {
      this.profile = profile;
    });
  }

  public securedPing(): void {
    this.message = '';
    this.authHttp.get(`${this.API_URL}/private`)
      .map(res => res.json())
      .subscribe(
      data => this.message = data.message,
      error => this.message = error
      );
    console.log(this.message);
  }
}