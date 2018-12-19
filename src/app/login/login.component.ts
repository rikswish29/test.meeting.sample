import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {UserService} from '../user.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public emailId : string;
  public password : string;
  public checkError : boolean;

  constructor(private route:ActivatedRoute, private router: Router, public http : HttpClient, private toastr : ToastrService, public userService : UserService, public cookie : CookieService) {
    console.log('login component works');
  }

  ngOnInit() {
  }

  loginUser(){
    let data = `${this.emailId}  ${this.password}`
    

    let userData = {
      emailId : this.emailId,
      password : this.password
    }
    

    this.userService.login(userData).subscribe(
      data => {
        let error = data.error;
        let message = data.message;
        let authToken = data.data.authToken;
        if(error){
          this.toastr.error(message, 'Fail');
          
          this.checkError = true;
          setTimeout (( ) => {
            this.checkError = false;
          }, 2000);
        } else{
          if(data.status === 200) {
            this.cookie.set( 'authToken', authToken );
            this.userService.setUserInfoInLocalStorage(data.data.userDetails);
            this.toastr.success(message, 'Success');
            if(data.data.userDetails.admin === 'admin'){
              setTimeout(() => {
                this.router.navigate(['/alluser']);
              },2000);
            }else{
              setTimeout (() => {
                this.router.navigate(['/usercalendar'],{queryParams: {'adminId' : "", 'userId':data.data.userDetails.userId}});
              },2000);
            }
          }
        }
      },
      error => {
        this.checkError = true;
        setTimeout( () => {
           this.checkError = false;
        },2000);
      }
    );

    return userData;
  }

  signUp (){
    setTimeout (() => {
      this.router.navigate(['/signup']);
    },1000);
  }

  forgotPassword(){
    setTimeout (() => {
      this.router.navigate(['/forgotpassword']);
    },1000);
  }
}
