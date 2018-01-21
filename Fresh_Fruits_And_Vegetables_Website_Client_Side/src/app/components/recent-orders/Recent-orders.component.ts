import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { orderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { DataService } from '../../services/data.service';

@Component({
    selector: 'Recent-orders',
    templateUrl: `./Recent-orders.component.html`,
    styleUrls: [`./Recent-orders.component.css`],
    providers: [orderService]
})
export class RecentOrdersComponent implements OnInit{

    arMyOrders: Order[] = new Array();

    constructor(private orderService: orderService,
        public DataService: DataService) {
        DataService.getAllOrders();
    }

    ngOnInit() {
        let index = 0;
        for (; index < this.DataService.arOrders.length; index++) {
            if (this.DataService.arOrders[index].Email == this.DataService.authEmail) {
                let myOrder: Order;
                myOrder = new Order();
                myOrder = this.DataService.arOrders[index];
                this.arMyOrders.push(myOrder);
            }
        }
    }
}