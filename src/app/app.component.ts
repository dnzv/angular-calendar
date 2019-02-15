import { Component } from '@angular/core';
import { Month } from './month.enum';
import { CalendarInput } from './calendar-input';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  Month = Month;
  days: CalendarInput[] = [
    {
      start: new Date(2019, 0, 1),
      end: new Date(2019, 0, 3),
      color: '#66ff99'
    },
    {
      start: new Date(2019, 0, 4),
      end: new Date(2019, 0, 4),
      color: '#ffa366'
    },
  ];
}
