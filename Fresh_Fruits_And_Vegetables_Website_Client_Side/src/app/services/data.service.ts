import { Injectable, Output, Inject } from '@angular/core';
import { orderService } from '../services/order.Service';
import { storageService } from '../services/storage.service';
import { productService } from '../services/product.service';
import { UserService } from '../services/user.service';
import { User } from "../models/user";
import { Order } from '../models/order';
import { product } from '../models/product';
import { storage } from '../models/storage';

@Injectable()
export class DataService {
    arProducts: product[]; arStorage: storage[];
    public arUsers: User[] = new Array();
    public totalAmount: number = 0;
    public Amount: number = 0;
    public totalPrice: number = 0;
    public editProduct: storage;
    public arHomeProducts: product[];
    public arMyProducs: product[] = new Array();
    public OrderList: boolean = true;
    public DetailsForm: boolean = false;
    public FinishOrder: boolean = false;
    public isUserExists: boolean = false;
    public disabledNavbar: boolean = false;
    public UserConnected: any;
    public authEmail: string;

    // arOrdersMadeToday: Order[] = new Array();
    arOrders: Order[] = new Array();
    arOrdersNumber: number[] = new Array();


    constructor(private Userservice: UserService,
        public productService: productService,
        private storageService: storageService,
        private orderService: orderService, ) {
        this.arProducts = [];
    }

    getAllUsers() {
        const req = this.Userservice.Get();
        req.subscribe(rsp => {
            this.arUsers = rsp.json();
            console.log(this.arUsers);
        }
            ,
            (err) => {
                console.log("error : " + err);
            }
        );

    }

    getAllOrders() {
        const req = this.orderService.Get();
        req.subscribe(rsp => {
            if (rsp.status == 200) {
                this.arOrders = rsp.json();
            }
            else { console.log("server responded error : " + rsp); }
        }
            ,
            (err) => {
                console.log("error : " + err);
            }
        );
    }

    getAllProduct() {
        const req = this.productService.Get();
        req.subscribe(rsp => {
            if (rsp.status == 200) {
                this.arHomeProducts = rsp.json();
                let index = 0;
                for (; index < this.arHomeProducts.length; index++) {
                    let pro: product;
                    pro = new product();
                    pro.Id = this.arHomeProducts[index].Id;
                    pro.ProductName = this.arHomeProducts[index].ProductName;
                    pro.CustomerPrice = this.arHomeProducts[index].CustomerPrice;
                    pro.ImgPath = this.arHomeProducts[index].ImgPath;
                    pro.Amount = 0;
                    this.arMyProducs.push(pro);
                }
            }
            else { console.log("server responded error : " + rsp); }
        }
            ,
            (err) => {
                console.log("error : " + err);
            }
        );
    }

    getAllStorge() {
        const req = this.storageService.Get();
        req.subscribe(rsp => {
            this.arStorage = rsp.json();
        },
            (err) => {
                console.log("error : " + err);
            });
    }

    CheckIfOrderNumberExists(orderNumber: number): boolean {
        this.getAllOrders();
        let exists: boolean = false;
        let index = 0;
        for (; index < this.arOrders.length; index++) {
            this.arOrdersNumber.push(this.arOrders[index].OrderNumber);
        }
        let i = 0;
        for (; i < this.arOrdersNumber.length; i++) {
            if (this.arOrdersNumber[i] == orderNumber) {
                exists = true;
                break;
            }
        }
        return exists;
    }

    ResetShoppingCart() {
        this.totalAmount = 0;
        this.totalPrice = 0;
        this.Amount = 0;
        this.arProducts = [];
        let index = 0;
        for (; index < this.arMyProducs.length; index++) {
            this.arMyProducs[index].Amount = 0;
        }
    }

    DeletProduct(dProduct: product) {
        let index = this.arProducts.indexOf(dProduct);
        this.arProducts.splice(index, 1);
        let lessPrice: number = dProduct.CustomerPrice * dProduct.Amount;
        this.totalPrice -= lessPrice;
        this.totalAmount -= dProduct.Amount;
        dProduct.Amount = 0;
    }

    ifUserExists(checkEmail: string) {
        setTimeout(() => {
            const req = this.Userservice.Get();
            req.subscribe(rsp => {
                this.arUsers = rsp.json();
                let index = 0;
                for (; index < this.arUsers.length; index++) {
                    if (this.arUsers[index].Email == checkEmail) {
                        this.isUserExists = true;
                        if (this.isUserExists) {
                            let userr: User;
                            userr = new User();
                            userr.FirstName = this.arUsers[index].FirstName;
                            userr.LastName = this.arUsers[index].LastName;
                            userr.Email = this.arUsers[index].Email;
                            userr.City = this.arUsers[index].City;
                            userr.Adress = this.arUsers[index].Adress;
                            userr.Business = this.arUsers[index].Business;
                            userr.Phone = this.arUsers[index].Phone;
                            userr.Registration = this.arUsers[index].Registration;
                            this.UserConnected = userr;
                            this.isUserExists = true;
                            break;
                        }
                    }
                }
            }
                ,
                (err) => {
                    console.log("error : " + err);
                }
            );
        }, 1000);
        console.log(this.UserConnected);
    }

    updetStorge() {
        this.getAllStorge();
        setTimeout(() => {
            let indexProduct = 0;
            let indexStorage = 0;
            for (; indexStorage < this.arStorage.length; indexStorage++) {
                for (; indexProduct < this.arProducts.length; indexProduct++) {
                    if (this.arStorage[indexStorage].ProductName == this.arProducts[indexProduct].ProductName) {
                        let newAmount: number = this.arStorage[indexStorage].Amount - this.arProducts[indexProduct].Amount;
                        let storageEdit: storage;
                        storageEdit = new storage();
                        storageEdit.Id = this.arStorage[indexStorage].Id;
                        storageEdit.ProductName = this.arStorage[indexStorage].ProductName;
                        storageEdit.Amount = newAmount;
                        const req = this.storageService.Edit(this.arStorage[indexStorage].Id, storageEdit);
                        req.subscribe(rsp => {
                            console.log("success : " + rsp);
                        }, (err) => { console.log("error : " + err); });
                    }
                }
                indexProduct = 0;
            }

        }, 1000);
    }

    // showOrdersMadeToday() {
    //     this.getAllOrders();
    //     this.arOrdersMadeToday = [];
    //     let Today = new Date().toISOString().slice(0, 10);
    //     let index = 0;
    //     for (; index < this.arOrders.length; index++) {
    //         if (this.arOrders[index].OrderDate == Today) {
    //             this.arOrdersMadeToday.push(this.arOrders[index]);
    //         }
    //     }
    // }

    getUserConnected(email){
        setTimeout(() => {
            const req = this.Userservice.Get();
            req.subscribe(rsp => {
                this.arUsers = rsp.json();
                let index = 0;
                for (; index < this.arUsers.length; index++) {
                    if (this.arUsers[index].Email == email) {
                        this.UserConnected = this.arUsers[index];
                    }
                }
            }
                ,
                (err) => {
                    console.log("error : " + err);
                }
            );
        }, 1000);
    }
}