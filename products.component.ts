import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductNamesService } from '../services/product-names.service';
import { Observable, combineLatest, map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
selector: 'app-products',
standalone: true,
imports: [CommonModule, RouterLink],
templateUrl: './products.component.html',
styleUrl: './products.component.css'
})
export class ProductsComponent {
// products: any[]=[];
// categoryName: any;
// searchKey: string='';




// constructor(private api:ApiService, private route:ActivatedRoute, private pdtName:ProductNamesService, private router:Router) {}
// pdtName$ = this.pdtName.prodNames;

// ngOnInit(): void {
//   this.pdtName.selectedCategoryAction$.subscribe(category => {
//     this.selectedCategoryName = category;
//     this.getMethod();
//   });
//   this.api.search.subscribe((val:any)=>{
//     this.searchKey = val;
//     this.filterProducts();
//   })


// }
// discountedPrices$: Observable<number[]> | undefined;

// selectedCategoryName = '';
// items$ = this.api.getAllProducts();

// filteredPosts$: any;
// public getMethod(){
 
//    this.filteredPosts$ = combineLatest([this.items$, this.pdtName.selectedCategoryAction$]).
//                   pipe(
//                     map(([posts, selectedCategoryName])=>{
//                       if (!selectedCategoryName || selectedCategoryName === "All-Products") {
//                         return posts; 
//                     } else {
//                         return posts.filter((post: any) => post.categoryName === selectedCategoryName);
//                     }
//                     })
//                   );
//                   this.discountedPrices$ = this.pdtName.calculateDiscountedPrice(this.filteredPosts$);
                 
  
// }


// filterProducts() {
//   this.filteredPosts$ = this.filteredPosts$.pipe(
//       map((products: any) => {
//           const searchKey = this.searchKey.trim().toLowerCase();
//           return products.filter((product: any) => {
//               return product.title.trim().toLowerCase().indexOf(searchKey) !== -1; // Check if the product title contains the search key
//           });
//       })
//   );
// }


// selCatName:any;

// onCategoryChange(event:Event){
//   this.selCatName = (event.target as HTMLElement).textContent;
//   this.router.navigate(['/products', this.selCatName]);
//   this.pdtName.selectedCategorySubject.next(this.selCatName);
  
// }

category: any;
  products: any[] = [];
discountPrice:any;
  constructor(private route: ActivatedRoute, private api: ApiService, private pdtName:ProductNamesService) { }

  ngOnInit(): void {
    this.category = this.route.snapshot.paramMap.get('category');
    this.loadProducts();
  }

  loadProducts() {
    this.api.getProductsByCategory(this.category).subscribe(
      (data: any) => {
        this.products = data;
        console.log('produ', this.products);
        this.discountPrice = this.pdtName.calculateDiscountedPrice(this.products);
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }
}