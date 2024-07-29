import { Component, OnInit } from '@angular/core';
import { AddressService } from '../services/address.service';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Address, orderItem } from '../models/models';
import { Observable, Subscription, of, catchError, forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-address-selection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './address-selection.component.html',
  styleUrls: ['./address-selection.component.css']
})
export class AddressSelectionComponent implements OnInit {
  addresses: Address[] = [];
  selectedAddress: Address | null = null;
  showAddressSelection: boolean = true;
  showOrderSummary: boolean = true;
  showPaymentOption: boolean = true;
  selectedPaymentOption: string | null = null;
  userId: number = Number(localStorage.getItem('userId'));
  grandTotal: number = 0;
  discountPrice: number = 0;
  total: number = 0;
  public products: any[] = [];
  productsLength: number = 0;

  constructor(
    private cartService: CartService,
    private addressService: AddressService,
    private router: Router,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.selectAddress();
    this.getPriceDetails();
    this.getCartDetails();
  }

  getCartDetails() {
    this.cartService.getCartDetails(this.userId).subscribe((res: any) => {
      this.products = res.map((product: any) => {
        product.deliveryDate = this.cartService.getDeliveryDate(product.productId);
        return product;
      });
      this.productsLength = this.products.length;
      this.applyDiscount();
    });
  }

  applyDiscount() {
    this.products = this.products.map(item => ({
      ...item, discPrice: item.price * 0.9
    }));
  }

  getTotalPrice(): number {
    return this.cartService.total;
  }

  getGrandTotal(): number {
    return this.cartService.grandTotal;
  }

  getDiscountPrice(): number {
    return this.cartService.discountPrice;
  }

  getPriceDetails() {
    this.total = this.getTotalPrice();
    this.grandTotal = this.getGrandTotal();
    this.discountPrice = this.getDiscountPrice();
  }

  selectAddress() {
    this.addressService.getAddresses(this.userId).subscribe(
      res => {
        this.addresses = res;
      },
      error => {
        console.error('Error fetching addresses', error);
      }
    );
  }

  showOrderSummaryView(address: Address) {
    this.selectedAddress = address;
    this.showAddressSelection = false;
    this.showOrderSummary = true;
  }

  showPaymentOptions() {
    this.showOrderSummary = false;
    this.showPaymentOption = true;
  }

  placeOrder(userId: any) {
    if (this.selectedAddress && this.selectedPaymentOption) {
      this.cartService.saveOrder(this.selectedAddress, this.selectedPaymentOption);
      this.postOrder(userId);
    } else {
      alert('Please select an address and payment option.');
    }
  }

  postOrder(userId: any) {
    const orderItems: orderItem[] = this.products.map((product) => {
      const localDeliveryDate = new Date(product.deliveryDate);
      localDeliveryDate.setMinutes(localDeliveryDate.getMinutes() - localDeliveryDate.getTimezoneOffset());

      return {
        Quantity: product.quantity,
        DeliveryDate: localDeliveryDate.toISOString().split('T')[0],
        TotalAmount: Math.round(this.grandTotal),
        PaymentOptions: this.selectedPaymentOption,
        AddressId: this.selectedAddress?.addressId,
        ProductId: product.productId,
        UserId: userId,
      };
    });

    let postOrderSuccess = true;

    const postOrderRequests = orderItems.map((orderItem) => 
      this.api.postOrders(orderItem).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error posting order:', error);
          alert('An error occurred while placing the order. Please try again.');
          postOrderSuccess = false;
          return of(null);
        })
      )
    );

    forkJoin(postOrderRequests).subscribe((results) => {
      if (postOrderSuccess) {
        this.api.clearCart(userId).subscribe(
          (res) => {
            console.log('Cart items deleted');
            this.router.navigate(['/order-confirmation']);
          },
          (error: HttpErrorResponse) => {
            console.error('Error clearing cart:', error);
            alert('An error occurred while clearing the cart. Please try again.');
          }
        );
      }
    });
  }

  addressChange() {
    this.showAddressSelection = true;
    this.showOrderSummary = true;
    this.showPaymentOption = false;
  }

  isSelected(address: Address): boolean {
    return this.selectedAddress === address;
  }
}