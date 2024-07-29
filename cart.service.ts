

// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { ApiService } from './api.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class CartService {

//   public cartItemList: any[] = [];
//   public productList = new BehaviorSubject<any[]>([]);
//   private orders: any[] = [];

//   private productsSubject = new BehaviorSubject<any[]>([]);
//   products$: Observable<any[]> = this.productsSubject.asObservable();
//   public total: number = 0;
//   public grandTotal: number = 0;
//   public discountPrice: number = 0;
//   public products: any[] = [];
//   private quantitiesSource = new BehaviorSubject<any[]>([]);
//   currentQuantities = this.quantitiesSource.asObservable();

//   private deliveryDates: { [productId: string]: Date } = {};

//   private cartItems: any[] = [];
//   private cartItemCountSubject = new BehaviorSubject<number>(0);
//   cartItemCount$ = this.cartItemCountSubject.asObservable();

//   constructor(private api: ApiService) { 
//     this.initializeCart(); // Initialize cart on service instantiation
//   }

//   addToCart(item: any): void {
//     this.cartItems.push(item);
//     this.cartItemCountSubject.next(this.cartItems.length);

//     this.api.PostCartPage(item).subscribe(res => {
//       console.log('Item added to cart:', res);
//     });
//   }

//   private initializeCart(): void {
//     if (typeof window !== 'undefined') { // Check if running in a browser environment
//       const userId = localStorage.getItem('userId');
//       if (userId) {
//         this.api.getCartPage(userId).subscribe((cartItems: any) => {
//           this.cartItems = cartItems;
//           this.cartItemCountSubject.next(this.cartItems.length);
//         }, error => {
//           console.error('Error fetching cart items', error);
//         });
//       }
//     } else {
//       console.warn('localStorage is not available.');
//     }
//   }

//   getCartDetails(userId: any): Observable<any> {
//     return this.api.getCartPage(userId);
//   }

//   setProducts(products: any[]) {
//     this.productsSubject.next(products);
//   }

//   updateQuantities(quantities: any[]) {
//     this.quantitiesSource.next(quantities);
//   }

//   getTotalPrice(products: any[]) {
//     this.total = products.reduce((acc, item) => acc + (item.price * item.quantity), 0);
//     return this.total;
//   }

//   getGrandTotal(products: any[]): number {
//     this.grandTotal = products.reduce((acc, item) => acc + (item.discPrice * item.quantity), 0);
//     return this.grandTotal;
//   }

//   getDiscountPrice(products: any[]) {
//     this.discountPrice = products.reduce((acc, item) => acc + (item.discPrice * item.quantity * 0.1), 0);
//     return this.discountPrice;
//   }

//   getDeliveryDate(productId: string): Date {
//     if (!this.deliveryDates[productId]) {
//       this.deliveryDates[productId] = this.generateRandomDeliveryDate();
//     }
//     return this.deliveryDates[productId];
//   }

//   private generateRandomDeliveryDate(): Date {
//     const today = new Date();
//     const deliveryDate = new Date(today);
//     const randomDays = Math.floor(Math.random() * 7) + 1; // Random delivery date within 1 to 7 days
//     deliveryDate.setDate(today.getDate() + randomDays);
//     return deliveryDate;
//   }

//   saveOrder(address: any, paymentOption: string) {
//     const orderedProducts = this.cartItemList.map(item => ({
//       productId: item.productId,
//       title: item.title,
//       price: item.price,
//       imageName: item.imageName,
//       quantity: item.quantity
//     }));
//     this.orders.push({ address, paymentOption, orderedProducts });
//   }

//   getOrders(): any[] {
//     return this.orders;
//   }

//   getOrderedProducts(): any[] {
//     return this.cartItemList;
//   }

//   removeFromCart(cartId: any): void {
//     // Remove item from cartItems array and update cart item count
//     this.cartItems = this.cartItems.filter(item => item.cartId !== cartId);
//     this.cartItemCountSubject.next(this.cartItems.length);
//   }
// }


import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  public cartItemList: any[] = [];
  public productList = new BehaviorSubject<any[]>([]);
  private orders: any[] = [];

  private productsSubject = new BehaviorSubject<any[]>([]);
  products$: Observable<any[]> = this.productsSubject.asObservable();
  public total: number = 0;
  public grandTotal: number = 0;
  public discountPrice: number = 0;
  public products: any[] = [];
  private quantitiesSource = new BehaviorSubject<any[]>([]);
  currentQuantities = this.quantitiesSource.asObservable();

  private deliveryDates: { [productId: string]: Date } = {};

  private cartItems: any[] = [];
  private cartItemCountSubject = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCountSubject.asObservable();

  constructor(private api: ApiService) { 
    this.loadCart(); 
  }

  loadCart(): void {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.api.getCartPage(userId).subscribe((cartItems: any) => {
          this.cartItems = cartItems;
          this.cartItemCountSubject.next(this.cartItems.length);
        }, error => {
          console.error('Error fetching cart items', error);
        });
      }
    } else {
      console.warn('localStorage is not available');
    }
  }

  addToCart(item: any): void {
    const existingItemIndex = this.cartItems.findIndex(cartItem => cartItem.productId === item.productId);

    if (existingItemIndex > -1) {
      // Update quantity if item already exists
      this.cartItems[existingItemIndex].quantity += item.quantity;
      this.api.updateCartItemQuantity(this.cartItems[existingItemIndex].cartId, this.cartItems[existingItemIndex].quantity)
        .subscribe(
          () => this.cartItemCountSubject.next(this.cartItems.length),
          error => console.error('Error updating cart item quantity', error)
        );
    } else {
      // Add new item to cart
      this.cartItems.push(item);
      this.api.PostCartPage(item)
        .subscribe(
          () => this.cartItemCountSubject.next(this.cartItems.length),
          error => console.error('Error adding item to cart', error)
        );
    }
  }

  removeFromCart(productId: any): void {
    this.cartItems = this.cartItems.filter(item => item.productId !== productId);
    this.cartItemCountSubject.next(this.cartItems.length);
    this.api.deleteCartItem(productId).subscribe(
      () => {},
      error => console.error('Error removing item from cart', error)
    );
  }

  getCartItems(): any[] {
    return this.cartItems;
  }

  getCartDetails(userId: any): Observable<any> {
    return this.api.getCartPage(userId);
  }

  setProducts(products: any[]) {
    this.productsSubject.next(products);
  }

  updateQuantities(quantities: any[]) {
    this.quantitiesSource.next(quantities);
  }

  getTotalPrice(products: any[]) {
    this.total = products.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    return this.total;
  }

  getGrandTotal(products: any[]): number {
    this.grandTotal = products.reduce((acc, item) => acc + (item.discPrice * item.quantity), 0);
    return this.grandTotal;
  }

  getDiscountPrice(products: any[]) {
    this.discountPrice = products.reduce((acc, item) => acc + (item.discPrice * item.quantity * 0.1), 0);
    return this.discountPrice;
  }

  getDeliveryDate(productId: string): Date {
    if (!this.deliveryDates[productId]) {
      this.deliveryDates[productId] = this.generateRandomDeliveryDate();
    }
    return this.deliveryDates[productId];
  }

  private generateRandomDeliveryDate(): Date {
    const today = new Date();
    const deliveryDate = new Date(today);
    const randomDays = Math.floor(Math.random() * 7) + 1; // Random delivery date within 1 to 7 days
    deliveryDate.setDate(today.getDate() + randomDays);
    return deliveryDate;
  }

  saveOrder(address: any, paymentOption: string) {
    const orderedProducts = this.cartItemList.map(item => ({
      productId: item.productId,
      title: item.title,
      price: item.price,
      imageName: item.imageName,
      quantity: item.quantity
    }));
    this.orders.push({ address, paymentOption, orderedProducts });
  }

  getOrders(): any[] {
    return this.orders;
  }

  getOrderedProducts(): any[] {
    return this.cartItemList;
  }

  
}
