import { Component } from '@angular/core';
import { Month } from './month.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  Month = Month;
}
