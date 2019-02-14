import { Component } from '@angular/core';
import { Month } from './month.enum';
import { CalendarDay } from './calendar-day';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  Month = Month;
  days: CalendarDay[] = [
    {
      day: 1,
      color: '#66ff99',
      range: true
    },
    {
      day: 2,
      color: '#66ff99',
      range: true
    },
    {
      day: 3,
      color: '#66ff99',
      range: true
    },
    {
      day: 4,
      color: '#66ff99'
    },
  ];
}
