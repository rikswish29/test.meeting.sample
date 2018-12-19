import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
  
  public emailId : string;
  public password : string;
  public changePasswordToken : string;
  

  constructor(public route : ActivatedRoute, public userService: UserService, public router : Router, public toastr : ToastrService) {
    console.log('changepassword is work')
     }

  ngOnInit() {
    this.changePasswordToken = this.route.snapshot.paramMap.get('changePasswordToken');
    
    if(!this.changePasswordToken){
      this.toastr.error("Change Password Token Missing", 'TOKEN MISSING');
    }
}
changePassword() {
  let userData = {
  emailId: this.emailId,
  password: this.password,
  authToken : this.changePasswordToken
}



this.userService.changePassword(userData).subscribe(

  data => {
    let error = data.error;
    let message = data.message;
    if(error){
      this.toastr.error(message, 'Fail!!');
      
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
);

return userData;
}
}

