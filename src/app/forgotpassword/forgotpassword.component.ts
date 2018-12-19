import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

  public emailId : string;

  constructor(public route : ActivatedRoute, public userService: UserService, public router : Router, public http : HttpClient, public toastr : ToastrService) {
       console.log('forgot password work')
   }

  ngOnInit() {
  }

  changePassword() {
    let userData = {
      emailId: this.emailId,
    }

    

    this.userService.sendEmailForPasswordChange(userData).subscribe(

      data => {
        let error = data.error;
        let message = data.message;
        if(error){
          this.toastr.error(message, 'Fail!!');
          
        }else{
          this.toastr.success("Check your email id.", 'Success!');
        
          //let token = message;
          setTimeout(()=>{
            this.router.navigate(['/changepassword']);
          },1000);
        }
      },
      error => {
          this.toastr.error(error.message, 'Oops!');
      }
    );

    return userData;
  
  }

}
