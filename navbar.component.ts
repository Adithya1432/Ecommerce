import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  public searchTerm:string='';
  public isLoggedIn: boolean = false;
  cartItemCount: number = 0;
  isCartPage: boolean = false;
  
  constructor(private api:ApiService, private authService:AuthService, private router:Router, private cartService: CartService){}
      ngOnInit() {
        this.authService.isLoggedIn$.subscribe(isLoggedIn => {
          this.isLoggedIn = isLoggedIn;
          if (isLoggedIn) {
            this.cartService.loadCart(); // Ensure cart is loaded after login
            this.cartService.cartItemCount$.subscribe(count => {
              this.cartItemCount = count;
            });
          } else {
            this.cartItemCount = 0;
          }
        });
        
          this.router.events.pipe(
            filter((event): event is NavigationEnd => event instanceof NavigationEnd)
          ).subscribe((event: NavigationEnd) => {
            this.isCartPage = event.urlAfterRedirects.includes('/cart');
          });
        }
  

  search(event:any){
      this.searchTerm = (event.target as HTMLInputElement).value;
      this.api.search.next(this.searchTerm);
  }


  // loginUser() {
  //     this.isLoggedIn = true;
  //   }

  // logout() {
  //   localStorage.setItem('lastVisitedUrl', this.router.url);
  //     this.isLoggedIn = false;
  //   }
  
  // logout(): void {
  //   const userEmail = localStorage.getItem('userEmail');
  //   if (userEmail) {
  //     localStorage.setItem(lastVisitedUrl_${userEmail}, this.router.url);
  //   }
  //   this.router.navigate(['/login']);
  // }


  logout(): void {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        localStorage.setItem('lastVisitedUrl', this.router.url);
    }
    localStorage.removeItem('userId');
    
    this.authService.logout();

    this.router.navigate(['/login']);
}   

}
