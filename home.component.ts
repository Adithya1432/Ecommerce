import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { ProductNamesService } from '../services/product-names.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit
 {

  // constructor(private api:ApiService,
  //             private pdtName:ProductNamesService
  // ){}

  

  // ngOnInit(): void {
  //   this.getCategories();
  //   this.categorie.forEach(category => this.loadProducts(category));
  // }

  // isLoading: boolean = true;
  // categories:any[]=[];
  // categorie: string[] = ['Mobiles', 'Laptops', 'Clothings', 'Cubes', 'Televisions']; 
  // categoryProducts: { [key: string]: { products: any[], discountPrices: number[] } } = {};

  // getCategories(){
  //   this.api.getAllCategories().subscribe((data:any)=>{
  //     this.categories = data;
  //     console.log(this.categories);
  //   })
  // }

  
  // products:any;
  // discountPrice:any;


  // loadProducts(categoryName: string) {
  //   this.api.getProductsByCategory(categoryName).subscribe((data: any) => {
  //     const limitedProducts = data.slice(0, 5);
  //     const discountPrices = this.pdtName.calculateDiscountedPrice(limitedProducts);

  //     this.categoryProducts[categoryName] = {
  //       products: limitedProducts,
  //       discountPrices: discountPrices
  //     };

  //     console.log('home', this.categoryProducts[categoryName]);
  //     console.log('discount', this.categoryProducts[categoryName].discountPrices);
  //   });
  // }
  
  constructor(
    private api: ApiService,
    private pdtName: ProductNamesService,
    private authService: AuthService
  ) {}

  isLoading: boolean = true;
  categories: any[] = [];
  categorie: string[] = ['Mobiles', 'Laptops', 'Clothings', 'Cubes', 'Televisions'];
  categoryProducts: { [key: string]: { products: any[], discountPrices: number[] } } = {};
  loadedCategories: number = 0;

  ngOnInit(): void {
    this.getCategories();
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoading = true;
      this.loadedCategories = 0;
      this.categoryProducts = {};
      if (isLoggedIn) {
        this.loadAllProductsForUser();
      } else {
        this.loadAllDefaultProducts();
      }
    });
  }

  getCategories() {
    this.api.getAllCategories().subscribe((data: any) => {
      this.categories = data;
      console.log(this.categories);
    });
  }

  loadAllDefaultProducts() {
    this.categorie.forEach(category => this.loadProducts(category));
  }

  loadAllProductsForUser() {
    // Example: Load different products for logged-in users.
    // Replace with actual logic to get user-specific products
    this.categorie.forEach(category => this.loadProductsForUser(category));
  }

  loadProducts(categoryName: string) {
    this.api.getProductsByCategory(categoryName).subscribe((data: any) => {
      const limitedProducts = data.slice(0, 5);
      const discountPrices = this.pdtName.calculateDiscountedPrice(limitedProducts);

      this.categoryProducts[categoryName] = {
        products: limitedProducts,
        discountPrices: discountPrices
      };

      this.loadedCategories++;
      if (this.loadedCategories === this.categorie.length) {
        this.isLoading = false;
      }

      console.log('home', this.categoryProducts[categoryName]);
      console.log('discount', this.categoryProducts[categoryName].discountPrices);
    });
  }

  loadProductsForUser(categoryName: string) {
    // Example: Add logic to get user-specific products
    // This might be different from `loadProducts` based on user-specific requirements
    this.api.getProductsByCategory(categoryName).subscribe((data: any) => {
      const limitedProducts = data.slice(0, 5); // Customize based on user-specific logic
      const discountPrices = this.pdtName.calculateDiscountedPrice(limitedProducts);

      this.categoryProducts[categoryName] = {
        products: limitedProducts,
        discountPrices: discountPrices
      };

      this.loadedCategories++;
      if (this.loadedCategories === this.categorie.length) {
        this.isLoading = false;
      }

      console.log('home (user)', this.categoryProducts[categoryName]);
      console.log('discount (user)', this.categoryProducts[categoryName].discountPrices);
    });
  }
}