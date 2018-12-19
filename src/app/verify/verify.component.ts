import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  
  public hash : string;
  public success : number;
  public failure : number;

  constructor(public route : ActivatedRoute, public userService: UserService, public router : Router, public toastr : ToastrService) { 
    
  }

  ngOnInit() {
    this.hash = this.route.snapshot.paramMap.get('verifyToken');
  
    if(!this.hash){
     
    }
  }

  verify() {

    this.userService.verify(this.hash).subscribe(
      Response =>{
        if (Response.status === 200) {
          this.success=1;
        }
        else{
          this.failure=1;
        }
        },
      error => {
        this.toastr.error(error.message, 'oops!')
      }
    );
  }

}
