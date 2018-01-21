import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { storageService } from '../../services/storage.service';
import { storage } from '../../models/storage';
import { GoogleChartComponent } from "./google-chart.component";
import { Order } from '../../models/order';
import { DataService } from "../../services/data.service";
import { forEach } from '@angular/router/src/utils/collection';

@Component({
    selector: 'home-admin',
    templateUrl: `./home-admin.component.html`,
    styleUrls: [`./home-admin.component.css`]

})
export class HomeAdminComponent implements OnInit{
    arStorage: storage[];
    arProductThatAboutToRunOut: storage[] = new Array();
    arProductThatRunOut: storage[] = new Array();
    zero: string;
    public pie_ChartData;
    public pie_ChartOptions;

    constructor(private storageService: storageService,
        public DataService: DataService) {
        // DataService.showOrdersMadeToday();
        DataService.getAllUsers();
    }

    ngOnInit() {

        const req = this.storageService.Get();
        req.subscribe(rsp => {
            if (rsp.status == 200) {
                this.arStorage = rsp.json();
                let index1 = 0
                for (; index1 < this.arStorage.length; index1++) {
                    if (this.arStorage[index1].Amount <= 30 && this.arStorage[index1].Amount > 0) {
                        let storagee: storage;
                        storagee = new storage();
                        storagee.Id = this.arStorage[index1].Id;
                        storagee.ProductName = this.arStorage[index1].ProductName;
                        storagee.Amount = this.arStorage[index1].Amount;
                        this.arProductThatAboutToRunOut.push(storagee);
                    }
                    if (this.arStorage[index1].Amount == 0) {
                        let storagee: storage;
                        storagee = new storage();
                        storagee.Id = this.arStorage[index1].Id;
                        storagee.ProductName = this.arStorage[index1].ProductName;
                        storagee.Amount = this.arStorage[index1].Amount;
                        this.arProductThatRunOut.push(storagee);
                    }
                    else {
                        this.zero = "0 products";
                    }
                }
                this.showBalance();
            }
            else { console.log("server responded error : " + rsp); }
        }
            ,
            (err) => {
                console.log("error : " + err);
            }
        );

        
    }

    showBalance() {
        let validProducts = this.arStorage.length - this.arProductThatRunOut.length - this.arProductThatAboutToRunOut.length;
        this.pie_ChartData = [
            ['Task', 'Hours per Day'],
            ['Products that are normal', validProducts],
            ['Out of stock', this.arProductThatRunOut.length],
            ['Products that are about to run out', this.arProductThatAboutToRunOut.length]
        ];


        this.pie_ChartOptions = {
            title: 'Site activity',
            width: 750,
            height: 500,
            is3D: true,
            backgroundColor: 'none',
            textStyle: {
                fontSize: 15,
                fontName: 'Comic Sans MS, Comic Sans, cursive',
                color: 'white'
            },
            titleTextStyle: {
                fontSize: 27,
                fontName: 'Comic Sans MS, Comic Sans, cursive',
                color: 'white',
            },
            legend: {
                position: 'bottom',
                maxLines: 2,
                textStyle: {
                    fontSize: 15,
                    fontName: 'Comic Sans MS, Comic Sans, cursive',
                    color: 'white'
                }
            }

        };
    }



}
