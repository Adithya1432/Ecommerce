import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private api: ApiService, 
              private router: Router, 
              private navbar: NavbarComponent, 
              private authService: AuthService,
              private cartService:CartService) { }


  // onSubmit(loginForm: NgForm) {
  //   if (loginForm.valid) {
  //     console.log(loginForm.value);
  //     const email = loginForm.value.email;
  //     const password = loginForm.value.password;
  //     this.api.loginDetails(email, password).subscribe((response) => {

  //       if (response) {
  //         localStorage.setItem('userEmail', email);
  //         alert('Login Successfull');
  //         this.navigateToStoredUrl();
  //       }
  //       else {
  //         alert('Check Your Credentials');
  //       }

  //     },
  //       error => {
  //         console.error('Login failed:', error);
  //       }
  //     );
  //   }
  // }

  onSubmit(loginForm: NgForm) {
    if (loginForm.valid) {
      this.api.postLoginDetails(loginForm.value).subscribe((response:any) => {

        if (response) {
          //alert('Login Successfull');
          localStorage.setItem('userId', response.userId);
          this.navigateToStoredUrl();
          this.cartService.loadCart();

        }
        else {
          alert('Check Your Credentials');
        }

      },
        error => {
          console.error('Login failed:', error);
        }
      );
    }
  }

  navigateToStoredUrl(): void {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      const lastVisitedUrl = localStorage.getItem('lastVisitedUrl');

      if (lastVisitedUrl) {
        this.router.navigateByUrl(lastVisitedUrl);
        return;
      }
    }
    this.router.navigate(['/home']);
  }



  login() {
    this.authService.login();
  }
}