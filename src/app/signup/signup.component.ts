import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public firstName : string;
  public lastName : string;
  public emailId : string;
 
  public countryCode : string;
  public phoneNumber : number;
  public username : string;
  public password : string;
  public admin : string;
  public countryData;

  constructor(public route:ActivatedRoute, public toastr: ToastrService ,public router: Router, public userService : UserService, public http : HttpClient) { }

  ngOnInit() {
    this.http.get('https://restcountries.eu/rest/v2/all').subscribe(data => {
   
      this.countryData = data;
    });
  }

  public singleCountryData;

  createUser(){
    let data = `${this.firstName} ${this.lastName} ${this.admin} ${this.emailId} ${this.countryCode} ${this.phoneNumber} ${this.password}`
    
    

    let userData = {
      firstName :  this.firstName,
      lastName : this.lastName,
      emailId: this.emailId,
      admin : this.admin,
      phoneNumber: this.phoneNumber,
      countryCode : this.countryCode,
      password: this.password    
    }

    

    this.userService.createUser(userData).subscribe(
      data => {
        let error = data.error;
        let message = data.message;
        if(error){
          this.toastr.error(message, 'Fail');
          
        }else{
          this.toastr.success(message, 'Success!');
          
          setTimeout(()=>{
            this.router.navigate(['/login']);
          },1000);
        }
      },
      error => {
        this.toastr.error(error.message, 'Oops!');
     }
    )
    return userData;
  }

  checkValue(event: any){
    this.admin = event;
  }

}
