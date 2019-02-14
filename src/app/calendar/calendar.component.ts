import { Component, OnInit } from '@angular/core';

interface CalendarDay {
  value?: number;
  selected?: boolean;
  disabled?: boolean;
  weekend?: boolean;
  before?: boolean;
  after?: boolean;
  middle?: boolean;
  range?: boolean;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  start: CalendarDay;
  end: CalendarDay;
  first: CalendarDay;
  second: CalendarDay;
  selected: CalendarDay[] = [];

  month = 'January';
  weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  weeks: Array<Array<CalendarDay>> = [
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
      { value: 7 },
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
      { value: 19, weekend: true },
      { value: 20, weekend: true },
    ],
    [
      { value: 21 },
      { value: 22 },
      { value: 23 },
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
  ];

  constructor() {
  }

  ngOnInit() {
  }

  onSelect(day: CalendarDay) {
    if (this.first) {
      this.start = this.first.value <= day.value ? this.first : day;
      this.end = this.first.value > day.value ? this.first : day;
      this.foo(this.start, this.end);
      this.first = null;
      this.second = null;
    } else {
      this.resetSelected();
      this.start = null;
      this.end = null;
      this.first = day;
    }
  }

  onHover(day: CalendarDay) {
    if (this.first) {
      this.second = day;
      this.foo(this.first, this.second);
    }
  }

  foo(first: CalendarDay, second: CalendarDay) {
    const firstIndex = this.findIndex(first);
    const secondIndex = this.findIndex(second);

    const startIndex = Math.min(firstIndex, secondIndex);
    const endIndex = Math.max(firstIndex, secondIndex);

    this.resetSelected();

    if (first.value === second.value) {
      first.selected = true;
      this.selected.push(first);
      return;
    }

    first.range = true;
    second.range = true;

    const weekLen = 7;
    for (let i = Math.floor(startIndex / weekLen); i <= Math.floor(endIndex / weekLen); i++) {

      for (let j = 0; j < weekLen; j++) {
        const flatIndex = i * weekLen + j;
        if (flatIndex >= startIndex && flatIndex <= endIndex) {
          const day = this.weeks[i][j];
          this.selected.push(day);
          day.selected = true;
          if (j - 1 >= 0 && this.weeks[i][j - 1].selected) {
            day.before = true;
            this.weeks[i][j - 1].after = true;
          }
          if (day.value !== first.value && day.value !== second.value) {
            day.middle = true;
          }
        }
      }
    }
  }

  resetSelected() {
    this.selected.forEach(day => {
      day.selected = false;
      day.before = false;
      day.middle = false;
      day.after = false;
      day.range = false;
    });
    this.selected = [];
  }

  findIndex(day: CalendarDay): number {
    if (!day) {
      return -1;
    }
    const merged = [].concat.apply([], this.weeks);
    for (let i = 0; i < merged.length; i++) {
      if (!merged[i].disabled && merged[i].value === day.value) {
        return i;
      }
    }
    return -1;
  }

  isCurrentMonth(day: CalendarDay): boolean {
    return day.value && !day.disabled;
  }
}
