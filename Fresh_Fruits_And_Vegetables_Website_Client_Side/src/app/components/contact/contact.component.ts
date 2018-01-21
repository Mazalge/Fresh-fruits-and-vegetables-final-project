import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { } from 'googlemaps';
import { Http } from '@angular/http';
import { Inject } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
// import { AgmCoreModule } from '@agm/core';

@Component({
    selector: 'Contact',
    templateUrl: './contact.component.html',
    styleUrls: [`./contact.component.css`],
})

export class ContactComponent implements OnInit {

    constructor( @Inject(Http) private http: Http) { }

    message: string;
    name: string;
    email: any;
    phoneNum: string;
    subject: string = "subject";
    to = "freshfruits8989@gmail.com";


    clickHandlerGet() {
        const body = {
            Body:
            "Customer Email:    " + this.email
            + "    Customer Name :   " + this.name
            + "    Customer Phone Number :   " + this.phoneNum
            + "    Message :   " + this.message,
            To: this.to,
            Subject: this.subject,
            From: this.email,
            EmailCust: this.email,
            Name: this.name
        };
        const req = this.http.post("http://localhost:55619/api/ContactEmail", body)
        req.subscribe(rsp => {
            if (rsp.status == 200) {
                console.log("success : " + rsp);
                window.location.reload();
            }
        },
            (err) => {
                console.log("error : " + err);
                window.alert("the mail have not been sent! please try again");
            }
        );
    }

    ngOnInit() {}

}