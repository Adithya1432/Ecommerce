import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserStoreService } from '../services/user-store.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent{
  firstName: string = '';
  lastName: string = '';

  isLoggedIn: boolean = false;
  userEmail: string | null = null;

  constructor(private api: ApiService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (!this.isLoggedIn) {
        this.clearUserData();
      } else {
        this.apiUserDetails();
      }
    });
  }


  apiUserDetails(): void {
    this.userEmail = localStorage.getItem('userEmail');

    if (this.isLoggedIn && this.userEmail) {
      this.api.getUserDetails(this.userEmail).subscribe(
        (user: any) => {
          this.firstName = user.firstName;
          this.lastName = user.lastName;
        },
        (error) => {
          console.error('Error apiing user data:', error);
        }
      );
    }
  }

  clearUserData(): void {
    this.firstName = '';
    this.lastName = '';
    this.userEmail = null;
  }


}