import { RequestOptions } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { storageService } from '../../services/storage.service';
import { productService } from '../../services/product.service';
import { DataService } from '../../services/data.service';

import { storage } from '../../models/storage';
import { product } from '../../models/Product';
import { purchases } from '../../models/purchases';
import { Router } from '@angular/router';



@Component({
    selector: 'AdminEditProduct',
    templateUrl: `./admin-edit-product.component.html`,
    styleUrls: [`./admin-edit-product.component.css`]

})
export class AdminEditProductComponent implements OnInit {
    product = new product();
    storage = new storage();
    amountInput: number;
    fielsAreEmpty: string;
    productExsist: string;
    productFromStorageToEdit: storage;
    productToEdit: product;
    editPro = new purchases();
    edit: string;
    create: string;
    totalPrice: number;
    showDetails = false;
    showForm = true;
    editGeneralError: string;
    addAmountError: string;
    proNameError: string;
    customerPriceError: string;
    marketPriceError: string;
    successMessage: string;

    constructor(private storageService: storageService,
        private productService: productService,
        public DataService: DataService,
        private router: Router) {
        DataService.getAllProduct();
        DataService.getAllStorge();
        this.productFromStorageToEdit = this.DataService.editProduct;
    }

    ngOnInit() {
        let index = 0;
        for (; index < this.DataService.arHomeProducts.length; index++) {
            if (this.DataService.editProduct.ProductName == this.DataService.arHomeProducts[index].ProductName) {
                this.productToEdit = this.DataService.arHomeProducts[index];
                break;
            }
        }
        this.amountInput = 0;
    }

    AddAmount() {
        this.amountInput++;
    }

    subAmount() {
        if (this.amountInput > 0) {
            this.amountInput--;
        }
    }

    formValidationIsOk() {
        let isValid: boolean;
        if (this.productFromStorageToEdit.ProductName == null || this.productToEdit.MarketPrice <= 0 ||
            this.productToEdit.MarketPrice == null || this.productToEdit.CustomerPrice <= 0
            || this.productToEdit.CustomerPrice == null) {
            if (this.productFromStorageToEdit.ProductName == null) {
                this.proNameError = "Product name required";
            }
            if (this.productToEdit.MarketPrice <= 0 || this.productToEdit.MarketPrice == null) {
                this.marketPriceError = "Market price is required";
            }
            if (this.productToEdit.CustomerPrice <= 0 || this.productToEdit.CustomerPrice == null) {

                this.customerPriceError = "Customer price is required";
            }
            if (this.productToEdit.MarketPrice >= this.productToEdit.CustomerPrice) {
                this.editGeneralError = "Market price must be smaller than customer price";
            }
            isValid = false;
        }
        else { isValid = true; }
        if (this.productToEdit.MarketPrice >= this.productToEdit.CustomerPrice) {
            this.editGeneralError = "Market price must be smaller than customer price";
            isValid = false;
        }
        return isValid;
    }

    sendProductToStorageTable() {
        let storagee: storage;
        storagee = new storage();
        storagee.Id = this.productFromStorageToEdit.Id;
        storagee.ProductName = this.productFromStorageToEdit.ProductName;
        storagee.Amount = this.amountInput + this.productFromStorageToEdit.Amount;
        this.totalPrice = this.amountInput * this.productToEdit.MarketPrice;
        const req = this.storageService.Edit(this.productFromStorageToEdit.Id, storagee);
        req.subscribe(rsp => {
            if (rsp.status == 204) {
                this.successMessage = "Great! The quantity has been added to your repository";
                this.showDetails = true;
                this.showForm = false;
                console.log("success : " + rsp);
            } else {
                this.editGeneralError = "Something went wrong, please try again";
                console.log("server responded error : " + rsp);
            }
        }, (err) => { console.log("error : " + err); });
    }

    sendProductToProductTable() {
        const req = this.productService.Edit(this.productToEdit.Id, this.productToEdit);
        req.subscribe(rsp => {
            if (rsp.status == 204) {
                this.successMessage = "Great! The quantity has been added to your repository";
                console.log("success : " + rsp);
            }
            else {
                this.editGeneralError = "Something went wrong, please try again";
                console.log("server responded error : " + rsp);
            }
        }, (err) => { console.log("error : " + err); });
    }

    editProduct() {
        this.addAmountError = "";
        this.proNameError = "";
        this.customerPriceError = "";
        this.marketPriceError = "";
        this.successMessage = "";
        this.editGeneralError = "";
        if (this.formValidationIsOk()) {
            if (this.amountInput != 0) {
                this.sendProductToStorageTable();
                this.sendProductToProductTable();
            }
            else { this.addAmountError = "Add amount"; }
        }
    }

    backToStorage() {
        this.router.navigate(['/Storage']);
    }
}