import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  month = 'January';

  weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  weeks = [
    [
      { disabled: true, value: 31 },
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5, weekend: true },
      { value: 6, weekend: true },
    ],
    [
      { value: 7, selected: true },
      { value: 8 },
      { value: 9 },
      { value: 10 },
      { value: 11 },
      { value: 12, weekend: true },
      { value: 13, weekend: true },
    ],
    [
      { value: 14 },
      { value: 15 },
      { value: 16 },
      { value: 17 },
      { value: 18 },
      { value: 19, weekend: true, selected: true, after: true },
      { value: 20, weekend: true, middle: true, before: true },
    ],
    [
      { value: 21, middle: true, after: true },
      { value: 22, middle: true, before: true, after: true },
      { value: 23, selected: true, before: true },
      { value: 24 },
      { value: 25 },
      { value: 26, weekend: true },
      { value: 27, weekend: true },
    ],
    [
      { value: 28 },
      { value: 29 },
      { value: 30 },
      { value: 31 },
      { disabled: true, value: 1 },
      { disabled: true, value: 2 },
      { disabled: true, value: 3 },
    ],
    [
      { disabled: true, value: 4 },
      { disabled: true, value: 5 },
      { disabled: true, value: 6 },
      { disabled: true, value: 7 },
      { disabled: true, value: 8 },
      { disabled: true, value: 9 },
      { disabled: true, value: 10 },
    ],
  ]

}
