import { Component, OnInit } from '@angular/core';
import { productService } from '../../services/product.service';
import { product } from '../../models/product';
import { Router } from "@angular/router";
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'home',
  templateUrl: `./home.component.html`,
  styleUrls: [`./home.component.css`],
  providers: [productService]
})
export class HomeComponent implements OnInit {

  constructor(public DataService: DataService,
    private service: productService,
    private router: Router,
    public auth: AuthService) {
    auth.handleAuthentication();
    auth.isAuthenticated();
  }
  ngOnInit() {
    this.DataService.getAllProduct();
  }

  CheckMyShoppingBag(addProduct: product): boolean {
    let bool: boolean = false;
    for (let index = 0; index < this.DataService.arProducts.length; index++) {
      if (this.DataService.arProducts[index].ProductName == addProduct.ProductName) {
        bool = true;
      }
    }
    return bool;
  }

  AddToCart(addProduct: product) {
    addProduct.Amount++;
    let exsist: boolean = this.CheckMyShoppingBag(addProduct);
    if (!exsist) {
      this.DataService.arProducts.push(addProduct);
      this.DataService.totalPrice += addProduct.CustomerPrice;
      this.DataService.totalAmount++;
    } else {
      let index = this.DataService.arProducts.indexOf(addProduct);
      this.DataService.arProducts[index].Amount = addProduct.Amount;
      this.DataService.totalPrice += addProduct.CustomerPrice;
      this.DataService.totalAmount++;
    }
  }

  DownloadFromShoppingCart(addProduct: product) {
    if (addProduct.Amount > 0) {
      if (this.DataService.totalPrice != 0) {
        let index = this.DataService.arProducts.indexOf(addProduct);
        addProduct.Amount--;
        if (addProduct.Amount == 0) {
          this.DataService.arProducts.splice(index, 1);
          this.DataService.totalPrice -= addProduct.CustomerPrice;
          this.DataService.totalAmount--;
        }
        else {
          this.DataService.arProducts[index].Amount = addProduct.Amount;
          this.DataService.totalPrice -= addProduct.CustomerPrice;
          this.DataService.totalAmount--;
        }
      }
    }
  }


}