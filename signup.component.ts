import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  data:any;
 
  constructor(private api: ApiService, private router:Router){}
 
  onSubmit(form: NgForm) {
    if (form.valid) {
      this.api.postUserDetails(form.value).subscribe(
        response => {
          console.log('Signup successful:', response);
          alert('Signup Successuful');
          this.router.navigate(['/login']);
        },
        error => {
          alert('Check the details');
        }
      );
    }
  }
 
 passwordsMatching:boolean=false;
 isConfirmPasswordDirty:boolean=false;
  
 checkPasswords(pw:string, cpw:string){
  this.isConfirmPasswordDirty=true;
  if(pw==cpw){
    this.passwordsMatching=true;
  }
  else{
    this.passwordsMatching=false;
  }
 }
}