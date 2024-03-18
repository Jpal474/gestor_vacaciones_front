import { Component, HostListener, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  vacaciones = false;
ngOnInit(): void {
  this.generarAlerta();
  
}

  generarAlerta(){
    const fecha = moment(new Date()).format('YYYY-MM-DD').split('-')
    const dia = parseInt(fecha[2]);
    const mes = fecha[1];
    if(mes== '12' && (dia>= 10 && dia<=31))
    this.vacaciones = true
  }
}
