import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
// import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AgmCoreModule } from '@agm/core';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-Not-Found/page-Not-Found.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { StorageComponent } from './components/storage/storage.component';
import { buyingComponent } from './components/buying-customer/buying.component';
import { RecentOrdersComponent } from './components/recent-orders/recent-orders.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeAdminComponent } from './components/homeAdmin/home-admin.component';
import { ContinueRegistrationComponent } from "./components/ContinueRegistration/continue-registration.component";
import { GoogleChartComponent } from "./components/homeAdmin/google-chart.component";
import { AdminOrdersComponent } from "./components/adminOrders/admin-orders.component";
import { AdminEditProductComponent } from "./components/adminEditProduct/admin-edit-product.component";

import { AuthService } from './services/auth/auth.service';
import { DataService } from './services/data.service';
import { UserService } from "./services/user.service";
import { storageService } from "./services/storage.service";
import { productService } from "./services/product.service";
import { orderService } from "./services/order.Service";

import { AuthGuard } from "./services/auth/auth-guard.service";
import { ScopeGuard } from "./services/auth/scope-guard.service";




export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenGetter: (() => localStorage.getItem('access_token')),
    globalHeaders: [{ 'Content-Type': 'application/json' }],
  }), http, options);
}

export const appRoutes: Routes = [
  { path: 'About', component: AboutComponent },
  { path: 'Home', component: HomeComponent },
  { path: 'HomeAdmin', component: HomeAdminComponent, canActivate: [ScopeGuard], data: { expectedScopes: localStorage.getItem("email") } },
  { path: 'Contact', component: ContactComponent },
  { path: 'Storage', component: StorageComponent, canActivate: [ScopeGuard], data: { expectedScopes: localStorage.getItem("email") } },
  { path: 'AdminOrders', component: AdminOrdersComponent, canActivate: [ScopeGuard], data: { expectedScopes: localStorage.getItem("email") } },
  { path: 'AdminEditProduct', component: AdminEditProductComponent, canActivate: [ScopeGuard], data: { expectedScopes: localStorage.getItem("email") } },
  { path: 'buying', component: buyingComponent, canActivate: [AuthGuard] },
  { path: 'RecentOrders', component: RecentOrdersComponent, canActivate: [AuthGuard] },
  { path: 'ContinueRegistration', component: ContinueRegistrationComponent, canActivate: [AuthGuard] },
  { path: '***', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyA4-VNt9ZAnHLOu3VO94Rdyc-JCyiWXUf4",
      libraries: ["places"]
    }),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
  ],
  declarations: [
    AppComponent,
    AboutComponent,
    AdminOrdersComponent,
    buyingComponent,
    HomeComponent,
    HomeAdminComponent,
    PageNotFoundComponent,
    ContactComponent,
    RecentOrdersComponent,
    StorageComponent,
    ProfileComponent,
    AdminEditProductComponent,
    ContinueRegistrationComponent,
    GoogleChartComponent
  ],
  providers: [
    AuthService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    UserService,
    DataService,
    AuthGuard,
    ScopeGuard,
    productService,
    storageService,
    orderService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
