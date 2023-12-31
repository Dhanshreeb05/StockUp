import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../shared/services/utility.service';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-newletter',
  templateUrl: './newletter.component.html',
  styleUrl: './newletter.component.scss'
})
export class NewletterComponent  implements OnInit{
  constructor(private _utility:UtilityService,private _http:HttpClient) {}
  description :string = '';
  newstitle :string = '';
  newsurl:string = '';
  ngOnInit(): void {
    this.getNews();
    this.getNewsLetter();
  }
  getNewsLetter(): void { 
    let data = {
      p_user_id: JSON.parse(localStorage.getItem('userInfo') || '{}').user_id,
    };
    this._utility.getNewsletters(data).subscribe((res) => {
      if (res.status) {
      
        let result = res.result[0];
        this.description = result[0].news_description;
        this.newstitle = result[0].title;
        this.newsurl = result[0].news_url;

      } else {
        alert('Error in getting newsletter');
      }
    });
  }
  getNews():void{
    let data = {
      p_user_id: JSON.parse(localStorage.getItem('userInfo') || '{}').user_id,
    };
    this._utility.getNews(data).subscribe((res)=>{
      console.log(res)
    });
  }

}
