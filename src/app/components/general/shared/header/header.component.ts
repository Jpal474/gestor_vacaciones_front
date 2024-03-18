import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  toInfo(){
    document.getElementById("info")?.scrollIntoView({behavior:"smooth"})
  }
  toTrabajo(){
    document.getElementById("trabajo")?.scrollIntoView({behavior:"smooth"})
  }
}
