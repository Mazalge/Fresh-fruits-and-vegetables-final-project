import { Component, OnInit, Pipe } from '@angular/core';
import { storageService } from '../../services/storage.service';
import { productService } from '../../services/product.service';
import { storage } from '../../models/storage';
import { product } from '../../models/product';
import { Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { DataService } from '../../services/data.service';
 

@Component({
    selector: 'Storage',
    templateUrl: `./storage.component.html`,
    styleUrls: [`./storage.component.css`]
 
})
export class StorageComponent implements OnInit{
    productTodeleteFromStorage: storage;
    modal:string;
 
    constructor(private storageService: storageService,
        private productService: productService,
        public router: Router,
         private dataService: DataService) { 
            dataService.getAllStorge();
            dataService.getAllProduct();
         }
 
    ngOnInit() {}
 
    addNewPro() {
        this.router.navigate(['/AdminOrders']);
    }
 
    editProduct(storage: storage) {
        debugger
        this.dataService.editProduct = storage;
        this.router.navigate(['/AdminEditProduct']);
    }
 
    saveProductToDelete(storage: storage) {
        this.productTodeleteFromStorage = storage;
    }
 
    deleteFromStorageTable() {
        let index = this.dataService.arStorage.indexOf(this.productTodeleteFromStorage);
        this.dataService.arStorage.splice(index, 1);
        const reqFromStorageTable = this.storageService.Delete(this.productTodeleteFromStorage.Id);
        reqFromStorageTable.subscribe(rsp => {
            if (rsp.status == 200) { console.log("success : " + rsp); }
            else { console.log("server responded error : " + rsp); }
        },(err) => {console.log("error : " + err);});
    }
 
    deleteFromProductTable() {
        let id: number;
        let index = 0;
        debugger
        for (; index < this.dataService.arHomeProducts.length; index++) {
            if ( this.dataService.arHomeProducts[index].ProductName  == this.productTodeleteFromStorage.ProductName) {
                id = this.dataService.arHomeProducts[index].Id;
                break;
            }
        }
        const reqFromProductTable = this.productService.Delete(id);
        reqFromProductTable.subscribe(rsp => {
            if (rsp.status == 200) { console.log("success : " + rsp); }
            else { console.log("server responded error : " + rsp); }
        },(err) => {console.log("error : " + err);});
    }
 
    deliteProduct() {
     this.deleteFromStorageTable();
        this.deleteFromProductTable();
        this.modal = "modal;"
    }
}