export class TokenApiModel{
    accessToken!:string;
    refreshToken!:string;
}

export interface CartItem{
    quantity:number;
    userId:number;
    productId:number;
}

export interface Address{

    addressId:number;
    name:string;
    mobileNumber:number;
    pincode:number;
    locality:string;
    totalAddress:string;
    city:string;
    state:string;
    landmark:string;
    altMobileNumber:number;
    addressType:string;
    editing: boolean;
}

export interface getCartItem{
    cartId:number;
    title:string;
    price:number;
    imageName:any;
    quantity:number;
    discPrice:number;
}

export interface orderItem{
    //orderId:number;
    Quantity:number;
    DeliveryDate:any;
    TotalAmount:any;
    PaymentOptions:any;
    AddressId:any;
    ProductId:number;
    UserId:number;
}