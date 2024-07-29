import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  

  constructor(private api: ApiService, private cartService: CartService) {
    //this.checkLoginStatus(); // Initialize login status on service instantiation
  }

  login() {
    this.isLoggedInSubject.next(true); 
    //this.cartService.loadCart(); // Load the cart immediately after login
  }

  logout(): void {
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn():boolean{
    return !!localStorage.getItem('userId');
  }

  
}

