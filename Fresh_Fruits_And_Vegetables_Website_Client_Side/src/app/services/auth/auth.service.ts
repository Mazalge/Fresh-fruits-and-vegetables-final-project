import { Injectable } from '@angular/core';
import { AUTH_CONFIG } from './auth0-variables';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import 'rxjs/add/operator/filter';
import { DataService } from '../../services/data.service';
import { Roles } from "../../models/role";
import { Http } from '@angular/http';

@Injectable()
export class AuthService {

    isRole: boolean = false;
    userProfile: any;
    profile: any;
    url = "http://localhost:55619/api/role/";
    email: string;
    requestedScopes: string = 'openid profile email';

    auth0 = new auth0.WebAuth({
        clientID: AUTH_CONFIG.clientID,
        domain: AUTH_CONFIG.domain,
        responseType: 'token id_token',
        audience: 'https://finalp.auth0.com/userinfo',
        redirectUri: 'http://localhost:4200/Home',
        scope: this.requestedScopes
    });

    constructor(public router: Router,
         public DataService: DataService,
        public http: Http) {
    }

    public login(): void {
        this.auth0.authorize();
    }

    public handleAuthentication(): void {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
                this.router.navigate(['/ContinueRegistration']);
            } else if (err) {
                this.router.navigate(['/Home']);
                console.log(err);
            }
        });
    }

    private setSession(authResult): void {
        // Set the time that the access token will expire at
        const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);

        this.getProfile((err, profile) => {
            this.profile = profile;
            let role: Roles;
            role = new Roles();
            role.Email = this.profile.email;
            role.IsAdmin = false;
            this.sendToRoleDb(this.url, role);
        });
    }

    public logout(): void {
        // Remove tokens and expiry time from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('email')
        // Go back to the home route
        this.router.navigate(['/Home']);
    }

    public isAuthenticated(): boolean {
        // Check whether the current time is past the
        // access token's expiry time
        const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }

    public getProfile(cb): void {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token must exist to fetch profile');
        }
        const self = this;
        this.email = self.email;
        this.auth0.client.userInfo(accessToken, (err, profile) => {
            if (profile) {
                self.userProfile = profile;
                localStorage.setItem("email", self.userProfile.email);
                this.DataService.authEmail=self.userProfile.email;
            }
            cb(err, profile);
        });
    }

    public isUserAdmin() {
        let email = this.email;
        setTimeout(() => {
            const req = this.http.get("http://localhost:55619/api/role?email=" + localStorage.getItem("email"));
            req.subscribe(rsp => {
                console.log("success : " + rsp);
                this.isRole = rsp.json();
            },
                (err) => {
                    console.log("error : " + err);

                });
        }, 1000);
    }

    public sendToRoleDb(url: string, role: Roles) {
        const req = this.http.post(url, role);
        req.subscribe(rsp => {
            if (rsp.status == 201) {
                console.log("success : " + rsp);}
            else {console.log("server responded error : " + rsp);
            }},(err) => {console.log("error : " + err);});
    }
}