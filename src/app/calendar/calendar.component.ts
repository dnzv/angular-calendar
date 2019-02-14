import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  addDays,
  differenceInCalendarISOWeeks,
  endOfISOWeek,
  endOfMonth,
  format,
  isAfter,
  isWeekend,
  startOfISOWeek
} from 'date-fns';
import nl from 'date-fns/locale/nl';
import { CalendarDay } from '../calendar-day';

interface Day {
  value?: number;
  month?: number;
  selected?: boolean;
  disabled?: boolean;
  weekend?: boolean;
  before?: boolean;
  after?: boolean;
  middle?: boolean;
  range?: boolean;
  customColor?: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnChanges {

  start: Day;
  end: Day;
  first: Day;
  second: Day;
  selected: Day[] = [];

  @Input() month;
  @Input() year;
  @Input() days: CalendarDay[];

  startDate: Date;
  endDate: Date;

  monthName = 'January';
  weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  weeks: Day[][] = [];

  constructor() {
  }

  ngOnInit() {
    this.setWeeks();
  }

  ngOnChanges() {
    this.setWeeks();
  }

  setWeeks() {
    const monthStart = new Date(this.year, this.month, 1);
    const monthEnd = endOfMonth(monthStart);
    const diff = differenceInCalendarISOWeeks(monthEnd, monthStart);
    this.startDate = startOfISOWeek(monthStart);
    this.endDate = diff === 5 ? endOfISOWeek(monthEnd) :
      endOfISOWeek(addDays(endOfISOWeek(monthEnd), 1));

    this.monthName = format(monthStart, 'MMMM', { locale: nl });
    this.monthName = this.monthName.charAt(0).toUpperCase() + this.monthName.slice(1);

    this.weeks = [];
    let currentDate = new Date(this.startDate);
    while (!isAfter(currentDate, this.endDate)) {
      const week: Day[] = [];
      for (let i = 0; i < 7; i++) {
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        week.push({
          value: currentDay,
          month: currentMonth,
          disabled: currentMonth !== this.month,
          weekend: currentMonth === this.month && isWeekend(currentDate)
        });
        currentDate = addDays(currentDate, 1);
      }
      this.weeks.push(week);
    }

    (this.days || []).forEach(d => {
      const foundDay = this.find(d.day, this.month);
      if (foundDay) {
        foundDay.selected = true;
        foundDay.customColor = d.color;
      }
    });
  }

  onSelect(day: Day) {
    if (this.first) {
      this.start = this.first.value <= day.value ? this.first : day;
      this.end = this.first.value > day.value ? this.first : day;
      this.handleSelect(this.start, this.end);
      this.first = null;
      this.second = null;
    } else {
      this.resetSelected();
      this.start = null;
      this.end = null;
      this.first = day;
    }
  }

  onHover(day: Day) {
    if (this.first) {
      this.second = day;
      this.handleSelect(this.first, this.second);
    }
  }

  handleSelect(first: Day, second: Day) {
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
      day.customColor = null;
    });
    this.selected = [];
  }

  findIndex(day: Day): number {
    if (!day) {
      return -1;
    }
    const merged = this.mergeWeeks();
    for (let i = 0; i < merged.length; i++) {
      if (!merged[i].disabled && merged[i].value === day.value) {
        return i;
      }
    }
    return -1;
  }

  find(day: number, month: number): Day {
    const merged = this.mergeWeeks();
    return merged.find(d => d.value === day && d.month === month);
  }

  mergeWeeks(): Day[] {
    return [].concat.apply([], this.weeks);
  }

  isCurrentMonth(day: Day): boolean {
    return day.value && !day.disabled;
  }
}
