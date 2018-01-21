import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from "../../services/user.service";
import { User } from "../../models/user";
import { DataService } from '../../services/data.service';

@Component({
    selector: 'continue-registration',
    templateUrl: `./continue-registration.component.html`,
    styleUrls: [`./continue-registration.component.css`],
})
export class ContinueRegistrationComponent implements OnInit {

    profile: any;
    user: User;
    firstName: string;
    lastName: string;
    city: string;
    adress: string;
    business: string;
    email: string;
    phoneNum: string;

    constructor(
        private router: Router,
        public auth: AuthService,
        public userService: UserService,
        public DataService: DataService) {
        auth.handleAuthentication();
        auth.isAuthenticated();
        DataService.getAllUsers();
    }

    ngOnInit() {
        setTimeout(() => {
            if (this.auth.isRole) {
                console.log("Admin")
               // window.alert("Admin");
                this.router.navigate(['/HomeAdmin']);
            }
            else if (this.DataService.isUserExists) {
                console.log("User Exists")
               // window.alert("User Exists");
                this.router.navigate(['/Home']);
            } else {
               // window.alert("User not Exists");
                console.log("User not Exists");
                this.DataService.disabledNavbar = true;
            }
        }, 2000);
    }

    reload() {
        window.location.reload();
    }

    getProfileOnLogin() {
        if (this.auth.userProfile) {
            this.profile = this.auth.userProfile;
            console.log(this.profile);
        } else {
            this.auth.getProfile((err, profile) => {
                this.profile = profile;
            });
        }
    }

    CreateUser() {
        let user: User;
        user = new User();
        user.FirstName = this.firstName;
        user.LastName = this.lastName;
        user.City = this.city;
        user.Adress = this.adress;
        user.Business = this.business;
        user.Email = this.email;
        user.Phone = "0" + this.phoneNum;
        user.Registration = new Date().toISOString().slice(0, 10);
        this.DataService.UserConnected = user;
        console.log(user);
        const req = this.userService.create(user);
        req.subscribe(rsp => {
            if (rsp.status == 201) {
                console.log("success : " + rsp);
                this.router.navigate(['/Home']);
            }
            else {
                console.log("server responded error : " + rsp);
            }
        },
            (err) => {
                console.log("error : " + err);
            });
    }


}