import { Component, OnInit } from '@angular/core';
import { AddressService } from '../services/address.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';
import { Address } from '../models/models';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [FormsModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent implements OnInit {
  // showForm: boolean = false;
  // isLoading: boolean = true;

  // constructor(private addressService: AddressService,
  //   private api: ApiService) { }

  // ngOnInit(): void {
  //   this.getAddress(this.userId);
  // }
  // toggleForm() {
  //   this.showForm = !this.showForm;
  // }


  // userId: number = Number(localStorage.getItem('userId'));

  // onSubmit(form: NgForm) {

  //   if (form.valid) {

  //     this.api.postAddress(this.userId, form.value).subscribe(

  //       response => {
  //         this.address.push(form.value);
  //         console.log(response);
  //         form.resetForm();
  //         this.showForm = false;
  //       },
  //       error => {
  //         alert('Check the details');
  //       }
  //     );
  //   }
  // }

  // onEditSubmit(form: NgForm, addressId: number, details: any) {
  //   console.log('addressId', addressId);
  //   if (!this.userId || !addressId) {
  //     console.error('UserId or addressId is missing');
  //     return;
  //   }

  //   this.api.updateAddress(addressId, form.value).subscribe(response => {
  //     console.log('Address updated:', response);
  //     details.editing = false;

  //   },
  //     (error) => {
  //       console.error('Error updating address:', error);
  //     });
  // }

  // removeAddress(addressId: number) {
  //   this.api.deleteAddress(addressId).subscribe(res => {
  //     console.log('Address deleted');
  //     this.address = this.address.filter((address: any) => address.addressId !== addressId);
  //   })
  // }
  // handleWarningAlert(addressId: any) {

  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'You will not be able to recover this address!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'No',
  //     imageWidth: 10,
  //     imageHeight: 20
  //   }).then((result) => {

  //     if (result.isConfirmed) {

  //       this.removeAddress(addressId);
  //       this.address = this.address.filter((address: any) => address.addressId !== addressId);

  //     } else if (result.isDismissed) {

  //       console.log('Clicked No, File is safe!');

  //     }
  //   })

  // }


  // address: Address[] = [];

  // getAddress(userId: number) {
  //   this.addressService.getAddresses(userId).subscribe(res => {
  //     this.address = res;
      
  //   })
  // }

  // editAddress(details: any) {
  //   details.editing = true;
  // }

  // cancelEdit(details: any) {
  //   details.editing = false;
  // }


  showForm: boolean = false;
  isLoading: boolean = true;
  address: Address[] = [];

  constructor(private addressService: AddressService, private api: ApiService) {}

  ngOnInit(): void {
    this.getAddress(this.userId);
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  userId: number = Number(localStorage.getItem('userId'));

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      this.api.postAddress(this.userId, form.value).subscribe(
        response => {
          this.address.push(form.value);
          console.log(response);
          form.resetForm();
          this.showForm = false;
          this.isLoading = false;
        },
        error => {
          alert('Check the details');
          this.isLoading = false;
        }
      );
    }
  }

  onEditSubmit(form: NgForm, addressId: number, details: any) {
    if (!this.userId || !addressId) {
      console.error('UserId or addressId is missing');
      return;
    }

    this.isLoading = true;
    this.api.updateAddress(addressId, form.value).subscribe(
      response => {
        console.log('Address updated:', response);
        details.editing = false;
        this.isLoading = false;
      },
      error => {
        console.error('Error updating address:', error);
        this.isLoading = false;
      }
    );
  }

  removeAddress(addressId: number) {
    this.isLoading = true;
    this.api.deleteAddress(addressId).subscribe(
      res => {
        console.log('Address deleted');
        this.address = this.address.filter(address => address.addressId !== addressId);
        this.isLoading = false;
      },
      error => {
        console.error('Error deleting address:', error);
        this.isLoading = false;
      }
    );
  }

  handleWarningAlert(addressId: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this address!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.removeAddress(addressId);
      } else if (result.isDismissed) {
        console.log('Clicked No, File is safe!');
      }
    });
  }

  getAddress(userId: number) {
    this.isLoading = true;
    this.addressService.getAddresses(userId).subscribe(
      res => {
        this.address = res;
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching addresses:', error);
        this.isLoading = false;
      }
    );
  }

  editAddress(details: any) {
    details.editing = true;
  }

  cancelEdit(details: any) {
    details.editing = false;
  }

}
