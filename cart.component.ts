


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  // public products: any[] = [];
  // public total: number = 0;
  // public grandTotal: number = 0;
  // public discountPrice: number = 0;
  // public quantityForms: FormGroup[] = [];
  // private userId = localStorage.getItem('userId');

  // constructor(
  //   private api: ApiService, 
  //   private fb: FormBuilder, 
  //   private cartService: CartService
  // ) { }

  // ngOnInit(): void {
  //   this.getCartDetails();
  // }

  // getCartDetails() {
  //   this.cartService.getCartDetails(this.userId).subscribe((res: any) => {
  //     this.products = res;
  //     this.applyDiscount();
  //     this.initQuantityForms();
  //     this.getPriceDetails();
  //     this.products.forEach(product => {
  //       product.deliveryDate = this.cartService.getDeliveryDate(product.productId);
  //     });
  //     this.cartService.updateQuantities(this.products);
  //   });
  // }

  // initQuantityForms() {
  //   this.quantityForms = this.products.map(product =>
  //     this.fb.group({
  //       quantity: [product.quantity, Validators.required]
  //     })
  //   );
  // }

  // updateQuantity(cartId: any, event: Event, index: number) {
  //   const target = event.target as HTMLSelectElement;
  //   const value = target.value;
  //   if (value) {
  //     const quantity = parseInt(value, 10);
  //     this.products[index].quantity = quantity;
  //     this.quantityForms[index].patchValue({ quantity: quantity });

  //     this.api.updateCartItemQuantity(cartId, value).subscribe(
  //       res => {
  //         this.getPriceDetails();
  //         this.cartService.updateQuantities(this.products);
  //       },
  //       error => {
  //         console.error('Error updating quantity', error);
  //       }
  //     );
  //   }
  // }

  // applyDiscount() {
  //   this.products = this.products.map(item => ({
  //     ...item, discPrice: item.price * 0.9
  //   }));
  // }

  // getTotalPrice(): number {
  //   return this.cartService.getTotalPrice(this.products);
  // }

  // getGrandTotal(): number {
  //   return this.cartService.getGrandTotal(this.products);
  // }

  // getDiscountPrice(): number {
  //   return this.cartService.getDiscountPrice(this.products);
  // }

  // getPriceDetails() {
  //   this.total = this.getTotalPrice();
  //   this.grandTotal = this.getGrandTotal();
  //   this.discountPrice = this.getDiscountPrice();
  // }

  // removeItem(cartId: any) {
  //   this.api.deleteCartItem(cartId).subscribe(res => {
  //     this.products = this.products.filter(prod => prod.cartId !== cartId);
  //     this.initQuantityForms();
  //     this.getPriceDetails();
  //     this.cartService.removeFromCart(cartId);  // Update the cartService
  //   });
  // }

  public products: any[] = [];
  public total: number = 0;
  public grandTotal: number = 0;
  public discountPrice: number = 0;
  public quantityForms: FormGroup[] = [];
  public isLoading: boolean = true;  // Add isLoading state
  private userId = localStorage.getItem('userId');

  constructor(
    private api: ApiService, 
    private fb: FormBuilder, 
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.getCartDetails();
  }

  getCartDetails() {
    this.isLoading = true;  // Set loading to true when API call starts
    this.cartService.getCartDetails(this.userId).subscribe((res: any) => {
      this.products = res;
      this.applyDiscount();
      this.initQuantityForms();
      this.getPriceDetails();
      this.products.forEach(product => {
        product.deliveryDate = this.cartService.getDeliveryDate(product.productId);
      });
      this.cartService.updateQuantities(this.products);
      this.isLoading = false;  // Set loading to false when API call completes
    }, error => {
      console.error('Error fetching cart details', error);
      this.isLoading = false;  // Set loading to false on error
    });
  }

  initQuantityForms() {
    this.quantityForms = this.products.map(product =>
      this.fb.group({
        quantity: [product.quantity, Validators.required]
      })
    );
  }

  updateQuantity(cartId: any, event: Event, index: number) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    if (value) {
      const quantity = parseInt(value, 10);
      this.products[index].quantity = quantity;
      this.quantityForms[index].patchValue({ quantity: quantity });

      this.api.updateCartItemQuantity(cartId, value).subscribe(
        res => {
          this.getPriceDetails();
          this.cartService.updateQuantities(this.products);
        },
        error => {
          console.error('Error updating quantity', error);
        }
      );
    }
  }

  applyDiscount() {
    this.products = this.products.map(item => ({
      ...item, discPrice: item.price * 0.9
    }));
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice(this.products);
  }

  getGrandTotal(): number {
    return this.cartService.getGrandTotal(this.products);
  }

  getDiscountPrice(): number {
    return this.cartService.getDiscountPrice(this.products);
  }

  getPriceDetails() {
    this.total = this.getTotalPrice();
    this.grandTotal = this.getGrandTotal();
    this.discountPrice = this.getDiscountPrice();
  }

  removeItem(cartId: any) {
    this.isLoading = true;  // Set loading to true when API call starts
    this.api.deleteCartItem(cartId).subscribe(res => {
      this.products = this.products.filter(prod => prod.cartId !== cartId);
      this.initQuantityForms();
      this.getPriceDetails();
      this.cartService.removeFromCart(cartId);  // Update the cartService
      this.isLoading = false;  // Set loading to false when API call completes
    }, error => {
      console.error('Error removing item', error);
      this.isLoading = false;  // Set loading to false on error
    });
  }
}
