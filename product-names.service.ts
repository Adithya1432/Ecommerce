import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductNamesService {

  public selectedCategorySubject = new BehaviorSubject<string>('');
  selectedCategoryAction$ = this.selectedCategorySubject.asObservable();
  constructor() { }
  
  setSelectedCategory(category: string) {
    this.selectedCategorySubject.next(category);
  }
  
  // discountPrice :number = 0;
  //  prices:number[] =[];
  //  discount:any;
  //  orgPrice:number[] = [];
   
  calculateDiscountedPrice(products: any[]): number[] {
    return products.map(product => {
      if (!product || !product.price) {
        console.error('Invalid input: Product or price is null or undefined');
        return 0;
      }
      const discount = product.price * 0.1; // Assuming 10% discount
      return Math.floor(product.price - discount);
    });
  }
}

