import { RequestOptions, Headers, Http } from '@angular/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { storageService } from '../../services/storage.service';
import { storage } from '../../models/storage';
import { productService } from '../../services/product.service';
import { product } from '../../models/Product';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import { DataService } from "../../services/data.service";

@Component({
    selector: 'admin-orders-for-storage',
    templateUrl: `./admin-orders.component.html`,
    styleUrls: [`./admin-orders.component.css`]

})
export class AdminOrdersComponent implements OnInit {
    newProName: string;
    marketPrice: number;
    customerPrice: number;
    newProAmount: number;
    category: string;
    File: any;
    file: File;
    formData: FormData = new FormData();
    options: any;
    apiUrl: string;
    serverMessage: string;
    @ViewChild('myInput')
    myInputVariable: any;
    productExsist: string;
    fileNameExsist: string;
    editGeneralError: string;
    proNameError: string;
    marketPriceError: string;
    customerPriceError: string;
    categoryError: string;
    fileError: string;
    AmountError: string;
    totalBuying: number;
    showDetails = false;
    storage = new storage();
    product = new product();

    constructor(private storageService: storageService,
        private productService: productService,
        public http: Http, private router: Router,
        public DataService: DataService) {
        DataService.getAllProduct();
        DataService.getAllStorge();
    }

    ngOnInit() { }

    changeFile(event: any) {
        let fileList: FileList = event.target.files;

        if (fileList.length > 0) {
            this.file = fileList[0];
            this.formData.append('uploadFile', this.file, this.file.name);
            let headers = new Headers();
            this.options = new RequestOptions({ headers: headers });

            this.apiUrl = "http://localhost:55619/api/UploadFile/";
        }
    }

    saveFile() {
        this.http.post(this.apiUrl, this.formData, this.options)
            .map(res => res.json())
            .catch(error => Observable.throw(error))
            .subscribe(
            data => console.log('success'),
            error => console.log(error)
            )
    }

    sendToStorageTable() {
        this.storage.ProductName = this.newProName;
        this.storage.Amount = this.newProAmount;
        const req = this.storageService.create(this.storage);
        req.subscribe(rsp => {
            if (rsp.status == 201) {
                console.log("success : " + rsp);
            }
            else {
                console.log("server responded error : " + rsp);
            }
        },
            (err) => {
                console.log("error : " + err);
            });
    }

    isFormValid(): boolean {
        let isValid: boolean;
        if (this.newProName == null || this.marketPrice <= 0 || this.marketPrice == null || this.customerPrice <= 0
            || this.customerPrice == null || this.category == null || this.file == null
            || this.newProAmount <= 0 || this.newProAmount == null) {
            if (this.newProName == null) {
                this.proNameError = "Product name required";
            }
            if (this.marketPrice <= 0 || this.marketPrice == null) {
                this.marketPriceError = "Market price is required";
            }
            if (this.customerPrice <= 0 || this.customerPrice == null) {
                this.customerPriceError = "Customer price is required";
            }
            if (this.category == null) {
                this.categoryError = "Category is required";
            }
            if (this.file == null) {
                this.fileError = "File is required";
            }
            if (this.newProAmount <= 0 || this.newProAmount == null) {
                this.AmountError = "Amount is required";
            }
            if (this.marketPrice >= this.customerPrice) {
                this.editGeneralError = "Market price must be smaller than customer price";
            }
            isValid = false;
        }
        else { isValid = true; }
        if (this.marketPrice >= this.customerPrice) {
            this.editGeneralError = "Market price must be smaller than customer price";
            isValid = false;
        }
        return isValid;
    }

    isProductExsist(product: product): boolean {
        let isExsist: boolean;
        let index = 0;
        for (; index < this.DataService.arProducts.length; index++) {
            if (this.DataService.arProducts[index].ProductName == product.ProductName || this.DataService.arProducts[index].ImgPath == product.ImgPath) {
                if (this.DataService.arProducts[index].ProductName == product.ProductName) {
                    this.productExsist = "This product exist in the database";
                }
                if (this.DataService.arProducts[index].ImgPath == product.ImgPath) {
                    this.fileNameExsist = "This file name exist in the database, please change it";
                }
                isExsist = true;
                break;
            }
            isExsist = false;
        }
        return isExsist;
    }

    resetErrorMesseges() {
        this.proNameError = "";
        this.marketPriceError = "";
        this.customerPriceError = "";
        this.categoryError = "";
        this.fileError = "";
        this.AmountError = "";
        this.editGeneralError = "";
        this.serverMessage = "";
        this.productExsist = "";
        this.fileNameExsist = "";
    }

    // saveValuesInObj(product: product) {
    //     product.ProductName = this.newProName;
    //     product.MarketPrice = this.marketPrice;
    //     product.CustomerPrice = this.customerPrice;
    //     product.Category = this.category;
    //     product.ImgPath = "../assets/" + this.file.name;
    //     return product;
    // }

    CreateProduct(form: NgForm) {
        this.resetErrorMesseges();
        if (this.isFormValid()) {
            this.product.ProductName = this.newProName;
            this.product.MarketPrice = this.marketPrice;
            this.product.CustomerPrice = this.customerPrice;
            this.product.Category = this.category;
            this.product.ImgPath ="../assets/" + this.file.name;
            if (!this.isProductExsist(this.product)) {
                const req = this.productService.create(this.product);
                req.subscribe(rsp => {
                    if (rsp.status == 201) {
                        this.serverMessage = "Product added successfuly";
                        this.showDetails = true;
                        this.totalBuying = this.product.MarketPrice * this.newProAmount;
                        this.sendToStorageTable();
                        
                        form.resetForm();
                        this.myInputVariable.nativeElement.value = "";
                        console.log("success : " + rsp);
                    }
                    else {
                        console.log("server responded error : " + rsp);
                        this.serverMessage = "Something went wrong. Please try again";
                    }
                }, (err) => { console.log("error : " + err); });
            }
        }
    }

    backToStorage() {
        this.saveFile();
        this.router.navigate(['/Storage']);
    }
}