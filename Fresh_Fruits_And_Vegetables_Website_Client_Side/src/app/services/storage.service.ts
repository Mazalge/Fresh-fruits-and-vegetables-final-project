import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Inject } from '@angular/core';
import { storage } from '../models/storage';


export class storageService {
    private url: string;
    Get() {
        return this.http.get(this.url);
    }

    create(body: any) {
        return this.http.post(this.url, body)
    }

    Delete(id: number) {
        return this.http.delete(this.url + id);
    }

    Edit(id: number, body: any) {
        return this.http.put(this.url + id, body);
    }

    constructor( @Inject(Http) private http: Http) {
        this.url = "http://localhost:55619/api/storage/";
    }
}