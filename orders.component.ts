// import { Component } from '@angular/core';
// import { CartService } from '../services/cart.service';
// import { CommonModule } from '@angular/common';
// import { ApiService } from '../services/api.service';

// @Component({
//   selector: 'app-orders',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './orders.component.html',
//   styleUrl: './orders.component.css'
// })
// export class OrdersComponent {
//   orders: any[] = [];

//   constructor(private cartService: CartService, private api:ApiService) { }

//   ngOnInit() {
//     this.getOrders();
//   }

//   userId = localStorage.getItem('userId');
//   getOrders(){
//     this.api.getOrders(this.userId).subscribe((res:any)=>{
//       this.orders = res;
//       console.log(this.orders);
//   })
//   }

//   getRandomDeliveryDate(): string {
//     const daysToAdd = Math.floor(Math.random() * 10) + 1;
//     const currentDate = new Date();
//     currentDate.setDate(currentDate.getDate() + daysToAdd);
//     return currentDate.toISOString().split('T')[0];
//   }
// }



import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { catchError, of, tap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  orders: any[] = [];
  isLoading: boolean = true; // Add this line

  constructor(private cartService: CartService, private api: ApiService) { }

  ngOnInit() {
    this.getOrders();
  }

  userId = localStorage.getItem('userId');

  getOrders() {
    this.isLoading = true; // Set loading to true before fetching data
    this.api.getOrders(this.userId).pipe(
      tap((res: any) => {
        this.orders = res;
        console.log(this.orders);
        this.isLoading = false; // Set loading to false when data is fetched
      }),
      catchError(error => {
        console.error('Error fetching orders', error);
        this.isLoading = false; // Set loading to false on error
        return of([]);
      })
    ).subscribe();
  }

  getRandomDeliveryDate(): string {
    const daysToAdd = Math.floor(Math.random() * 10) + 1;
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    return currentDate.toISOString().split('T')[0];
  }
}
