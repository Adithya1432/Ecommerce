import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Address } from '../models/models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
  export class AddressService {
    constructor(private api:ApiService) {}
    private addresses: Address[] = [];
  
    getAddresses(userId:number){
      return this.api.getAddress(userId);
    }
  
}



