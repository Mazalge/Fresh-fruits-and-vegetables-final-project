import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { productService } from '../../services/product.service';
import { product } from '../../models/Product';
import { Order } from '../../models/order';
import { orderService } from '../../services/order.Service';
import { DataService } from '../../services/data.service';
import { Http } from '@angular/http';
import { AuthService } from '../../services/auth/auth.service';

//hagit45@gmail.com : ori7878@gmail.com

@Component({
  selector: 'buying',
  templateUrl: `./buying.component.html`,
  styleUrls: [`./buying.component.css`]
})
export class buyingComponent implements OnInit {
  index: number;
  arOrders: Order[];
  SitePoliciesCalled: boolean = false;
  errorDate: string;
  errorTime: string;
  errorShoppingCart: string;
  errorSitePoliciesCalled: string;
  orderNumber: number;
  orderSum: number;
  date: string;
  city: string;
  phone: string;
  time: string;
  business: string;
  address: string;
  email: string;
  emailMessage: string;
  theUserIsAuthenticated: boolean;
  deliveryMessage: string;
  name: string;
  errorUserNotConected: string;

  constructor(public DataService: DataService,
    private productService: productService,
    private orderService: orderService,
    private router: Router,
    public auth: AuthService,
    private route: ActivatedRoute,
    private http: Http,
    private service: orderService,
  ) {
    this.theUserIsAuthenticated = auth.isAuthenticated();
    auth.isUserAdmin();
  }

  ngOnInit() {
    this.DataService.getUserConnected(localStorage.getItem("email"));
  }


  SitePoliciesFunction() {
    this.SitePoliciesCalled = true;
  }

  OrderListFunction() {
    window.alert(localStorage.getItem("email"));
    this.errorUserNotConected = "";
    if (this.auth.isAuthenticated()) {
      if (this.DataService.arProducts.length != 0) {
        if (this.SitePoliciesCalled) {
          this.DataService.OrderList = false;
          this.DataService.DetailsForm = true;
        }
        else {
          this.errorSitePoliciesCalled = "To continue you must read our website policies";
        }
      }
      else {
        this.errorShoppingCart = "The shopping basket must contain at least one product";
      }
    }
    else {
      this.errorUserNotConected = "To continue shopping you must login / register";
    }
  }

  closeShoppingCart() {
    this.errorShoppingCart = "";
    this.errorTime = "";
    this.errorDate = "";
    // this.DataService.OrderList = true;
    // this.DataService.DetailsForm = false;
    // this.DataService.FinishOrder = false;
    this.SitePoliciesCalled = false;
  }

  CheckDate() {
    let now = new Date().toISOString().slice(0, 10);
    let nowDate = new Date().toISOString();
    console.log("nowDate", nowDate);
    console.log("date", this.date);
    console.log("now", now);
    if ((this.date < now) || (this.date == null)) {
      return false;
    }
    else {
      return true;
    }
  }

  CheckTime() {
    let latestTime = "17:00";
    let earlyTime = "08:00";

    if ((this.time < earlyTime) || (this.time > latestTime) || (this.time == null)) {
      return false;
    }
    else {
      return true;
    }
  }

  DetailsFormFunction() {
    window.alert(this.DataService.UserConnected);
    this.errorDate = "";
    this.errorTime = "";
    if ((this.CheckTime()) || (this.CheckDate())) {
      if (this.CheckTime()) {
        if (this.CheckDate()) {
          let orderDetails: Order;
          orderDetails = new Order();
          orderDetails.Email = this.DataService.UserConnected.Email;
          orderDetails.OrderNumber = this.randomOfOrderNumber();
          orderDetails.OrderSum = this.DataService.totalPrice
          orderDetails.OrderDate = new Date().toISOString().slice(0, 10);
          orderDetails.DeliveryDate = this.date;
          orderDetails.DeliveryCity = this.DataService.UserConnected.City;
          orderDetails.Phone = this.DataService.UserConnected.Phone;
          orderDetails.DeliveryTime = this.time;
          orderDetails.DeliveryAddress = this.address;
          orderDetails.Business = this.DataService.UserConnected.Business;
          this.doOrder(orderDetails);
          this.sendMessageToDeliveryPerson();
          this.DataService.DetailsForm = false;
          this.DataService.FinishOrder = true;
        }
        else {
          this.errorDate = "Date must be in the future";
        }
      }
      else {
        this.errorTime = "Time must be between 08:00 - 17:00";
      }
    }
    else {
      this.errorDate = "Date must be in the future";
      this.errorTime = "Time must be between 08:00 - 17:00";
    }
  }

  sendMessageToDeliveryPerson() {
    const body = {
      Body:
        "Customer Email:    " + this.DataService.UserConnected.Email
        + "    Customer Name :   " + this.DataService.UserConnected.FirstName
        + "    Message :   " + this.deliveryMessage,
      To: "mazalg603@gmail.com",
      From: this.DataService.UserConnected.Email,
      EmailCust: this.DataService.UserConnected.Email,
      Name: this.name
    };
    const req = this.http.post("http://localhost:55619/api/ContactEmail", body)
    req.subscribe(rsp => {
      if (rsp.status == 200) {
        console.log("success : " + rsp);
      }
    },
      (err) => {
        console.log("error : " + err);
        window.alert("the mail have not been sent! please try again");
      }
    );
  }

  FinishOrderFunction() {
    this.DataService.ResetShoppingCart();
    this.closeShoppingCart();
    this.SitePoliciesCalled = false;
    this.router.navigate(['/RecentOrders']);
  }

  randomOfOrderNumber() {
    let exists;
    do {
      this.orderNumber = Math.floor(Math.random() * 1000000000) + 1;
      exists = this.DataService.CheckIfOrderNumberExists(this.orderNumber);
    }
    while (exists);

    return this.orderNumber;
  }

  doOrder(orderDetails: Order) {
    console.log(orderDetails);
    const req1 = this.orderService.create(orderDetails);
    req1.subscribe(rsp => {
      if (rsp.status == 201) {
        console.log("success : " + rsp);
        console.log("the order finish success!");
        this.DataService.updetStorge();
      }
      else { console.log("server responded error : " + rsp); }
    },
      (err) => {
        console.log("error : " + err);
      });
  }
}