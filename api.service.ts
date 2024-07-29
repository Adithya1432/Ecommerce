import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';
import { Address } from '../models/models';
 
@Injectable({
  providedIn: 'root'
})
export class ApiService {
 
   //searching the products
   public search = new BehaviorSubject<string>("");
 
 
   constructor(private http:HttpClient) {}
   private baseUrl = 'https://localhost:7116/api/Shopping/';
 
   getAllCategories(): Observable<any[]>{
     return this.http.get<any[]>(this.baseUrl);
   }
 
   getProductsByCategory(categoryName:string){
    //https://localhost:7116/api/Shopping/categoryName?categoryName=Mobiles
    return this.http.get(`${this.baseUrl}categoryName?categoryName=${categoryName}`);
   }
 
   public getProductDetails(prodTitle:string){
     return this.http.get(this.baseUrl + prodTitle );
   }
 
 
   public postUserDetails(data:any){
     return this.http.post(this.baseUrl + 'SignUp', data);
   }
   
   public loginDetails(email:string, password:string):Observable<boolean>{
    return this.http.get<boolean>(`${this.baseUrl}Login?email=${email}&password=${password}`);
   }
 
   public postLoginDetails(usrObj:any){
    return this.http.post(`${this.baseUrl}authenticate`, usrObj);
   }
   
 
   public getUserDetails(email:string){
    return this.http.get(`${this.baseUrl}details?email=${email}`);
   }

   PostCartPage(cartItem:any){
    return this.http.post(`${this.baseUrl}CartPage`, cartItem);
   }
   

 
    getCartPage(userId:any){
      return this.http.get(`${this.baseUrl}GetCartDetails?userId=${userId}`);
    }

    updateCartItemQuantity(cartId: any, updatedQuantity: any): Observable<any> {
      const url = `${this.baseUrl}Cart/${cartId}`;
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const body = JSON.stringify({ quantity: updatedQuantity });
  
      return this.http.patch(url, body, { headers });
    }
    
    deleteCartItem(cartId:any){
      return this.http.delete(`${this.baseUrl}CartId?cartId=${cartId}`);

    }

    clearCart(userId:any){
      return this.http.delete(`${this.baseUrl}ClearCart/${userId}`);

    }
 
   getAddress(userId:any){
   return this.http.get(`${this.baseUrl}Address/${userId}`).pipe(
    map(response=>response as Address[])
   )
   }
 
   postAddress(userId:number, data:any){
    const dataWithUserId = {...data, userId};
    return this.http.post(`${this.baseUrl}Users/${userId}/Address`, dataWithUserId);
   }

   updateAddress(addressId: any, updatedAddress:any) {
    return this.http.patch(`${this.baseUrl}Addresses/${addressId}`, updatedAddress);
  }
  
 
   deleteAddress(addressId:number){
    return this.http.delete(`${this.baseUrl}addressId?addressId=${addressId}`);
   }
 

   postOrders(orders:any){
    return this.http.post(`${this.baseUrl}Orders`, orders);
   }

   getOrders(userId:any){
    return this.http.get(`${this.baseUrl}GetOrderDetails?userId=${userId}`);

   }
   
   storeToken(tokenValue:string){
    localStorage.setItem('token', tokenValue);
   }
 
   storeRefreshToken(tokenValue:string){
      localStorage.setItem('refreshToken', tokenValue);
   }
 
   getRefreshToken():string | null{
    return localStorage.getItem('refreshToken');
   }
  setToken(token:any){
   return localStorage.setItem('token', token);
  }
  getToken():string | null{
   return localStorage.getItem('token');
  }
 


  

 
}

