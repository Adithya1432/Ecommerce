import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CartService } from '../services/cart.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ProductNamesService } from '../services/product-names.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, MatProgressSpinnerModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  // isDisabled: boolean = true;
  // title: string = '';
  // product: any;

  // constructor(
  //   private api: ApiService,
  //   private cartService: CartService,
  //   private route: ActivatedRoute,
  //   private router: Router,
  //   private pdtName:ProductNamesService,
  //   private snackBar: MatSnackBar,
  // ) {}

  // ngOnInit(): void { 
  //   this.route.params.pipe(
  //     tap(params => {
  //       const idParam = this.route.snapshot.params['prodTitle'];
  //       if (idParam !== undefined) {
  //         this.title = idParam;
  //         this.getProdDetails(); 
  //       } else {
  //         console.log('title undefined');
  //       }
  //     })
  //   ).subscribe();
  // }

  // discountPrice :any;
  // prices:number[] =[];  
  // discount:any;
  // orgPrice:number=0;

  // public getProdDetails(): void {
  //   this.api.getProductDetails(this.title).pipe(
  //     tap(data => {
  //       this.product = data;
  //       this.calculateDiscountedPrice();
  //     }),
      
  //     catchError(error => {
  //       console.error('Error apiing product details', error);
  //       return of(null);
  //     })
  //   ).subscribe();
  // }


  // private calculateDiscountedPrice(): void {
  //   if (this.product && this.product.price) {
  //     this.discountPrice = this.pdtName.calculateDiscountedPrice([this.product])[0]; // Assuming calculateDiscountedPrice returns an array with one element
  //   }
  // }
  
  // changeCartText(): void {
  //   this.isDisabled = !this.isDisabled;
  //   if (this.isDisabled) {
  //     this.router.navigate(['/cart']);
  //   }
  // }
  


  // handleButtonClick(productId:any): void {
  //   this.addToCart(productId);
  //   this.showNotification();
  // }

  // userId = Number(localStorage.getItem('userId'));

  // addToCart(productId: any): void {
  //   const existingItem = this.cartService.getCartItems().find(item => item.productId === productId);
    
  //   if (existingItem) {
  //     // Increase the quantity if item is already in the cart
  //     this.cartService.addToCart({ 
  //       productId, 
  //       quantity: 1, // Always add 1 more
  //       userId: this.userId
  //     });
  //   } else {
  //     // Add new item
  //     this.cartService.addToCart({
  //       productId,
  //       quantity: 1,
  //       userId: this.userId
  //     });
  //   }
  // }

  // showNotification(): void {
  //   this.snackBar.open('Item added to cart', 'Open', {
  //     duration: 3000,
  //     horizontalPosition: 'end',
  //     verticalPosition: 'top'
  //   });
  // }

  isDisabled: boolean = true;
  title: string = '';
  product: any;
  isLoading: boolean = true; // Add this line

  constructor(
    private api: ApiService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private pdtName: ProductNamesService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void { 
    this.route.params.pipe(
      tap(params => {
        const idParam = this.route.snapshot.params['prodTitle'];
        if (idParam !== undefined) {
          this.title = idParam;
          this.getProdDetails(); 
        } else {
          console.log('title undefined');
        }
      })
    ).subscribe();
  }

  discountPrice: any;
  prices: number[] = [];  
  discount: any;
  orgPrice: number = 0;

  public getProdDetails(): void {
    this.isLoading = true; // Set loading to true
    this.api.getProductDetails(this.title).pipe(
      tap(data => {
        this.product = data;
        this.calculateDiscountedPrice();
        this.isLoading = false; // Set loading to false when data is fetched
      }),
      catchError(error => {
        console.error('Error fetching product details', error);
        this.isLoading = false; // Set loading to false on error
        return of(null);
      })
    ).subscribe();
  }

  private calculateDiscountedPrice(): void {
    if (this.product && this.product.price) {
      this.discountPrice = this.pdtName.calculateDiscountedPrice([this.product])[0];
    }
  }
  
  changeCartText(): void {
    this.isDisabled = !this.isDisabled;
    if (this.isDisabled) {
      this.router.navigate(['/cart']);
    }
  }
  
  handleButtonClick(productId: any): void {
    this.addToCart(productId);
    this.showNotification();
  }

  userId = Number(localStorage.getItem('userId'));

  addToCart(productId: any): void {
    const existingItem = this.cartService.getCartItems().find(item => item.productId === productId);
    
    if (existingItem) {
      this.cartService.addToCart({ 
        productId, 
        quantity: 1,
        userId: this.userId
      });
    } else {
      this.cartService.addToCart({
        productId,
        quantity: 1,
        userId: this.userId
      });
    }
  }

  showNotification(): void {
    this.snackBar.open('Item added to cart', 'Open', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

}