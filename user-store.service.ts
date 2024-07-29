
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  private fullName$ = new BehaviorSubject<string>("");
  private email$ = new BehaviorSubject<string>("");

  constructor() { }

  public getEmailFromStore(){
    return this.email$.asObservable();
  }
  public setEmailForStore(email:string){
    this.email$.next(email);
  }

  public getFullNameFromStore(){
    return this.fullName$.asObservable();
  }
  public getFullNameForStore(fullName:string){
    this.fullName$.next(fullName);
  }
}