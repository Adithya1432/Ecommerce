import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ProductsComponent } from './products/products.component';
import { DetailsComponent } from './details/details.component';
import { AddressComponent } from './address/address.component';
import { AddressSelectionComponent } from './address-selection/address-selection.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { authGuard } from './services/auth.guard';
import { OrdersComponent } from './orders/orders.component';
import { CartComponent } from './cart/cart.component';
import { ChartsComponent } from './charts/charts.component';
import { NotfoundComponent } from './notfound/notfound.component';

export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'SignUp', component:SignupComponent},
    {path:'login', component:LoginComponent},
    {path:'home', component:HomeComponent},
    {
        path: 'profile', component: ProfileComponent, children: [
            { path: 'addresses', component: AddressComponent },
        ]
    },
    { path: 'profile/orders', component: OrdersComponent },
    // { path: 'profile', component: ProfileComponent },
    {path:'products/:category', component:ProductsComponent},
    {path:'categories/:catName', component:DetailsComponent},
    // {path:'profile/addresses', component:AddressComponent},
    {path:'address-selection', component:AddressSelectionComponent},
    {path:'order-confirmation', component:OrderConfirmationComponent},
    // {path:'profile/orders', component:OrdersComponent},
    // {path:'orders', component:OrdersComponent, canActivate:[authGuard]},
    {path:'cart', component:CartComponent},
    {path:':prodTitle', component:DetailsComponent},
    {path:'charts', component:ChartsComponent},
    {path:'', component:NotfoundComponent}
];