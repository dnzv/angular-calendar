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
import { CalendarInput } from '../calendar-input';

interface CalendarDay {
  value?: number;
  week?: number;
  month?: number;
  selected?: boolean;
  disabled?: boolean;
  weekend?: boolean;
  before?: boolean;
  after?: boolean;
  middle?: boolean;
  range?: boolean;
  color?: string;
}

type Week = CalendarDay[];

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnChanges {

  private static selectionColor = '#b3ecff';

  start: CalendarDay;
  end: CalendarDay;
  first: CalendarDay;
  second: CalendarDay;

  @Input() month;
  @Input() year;
  @Input() days: CalendarInput[];
  @Input() hide = false;

  calendarStartDate: Date;
  calendarEndDate: Date;

  monthName = 'January';
  weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  weeks: Week[] = [];

  static setRange(week: Week, index: number, start: CalendarDay, end: CalendarDay, color: string = CalendarComponent.selectionColor) {
    const day = week[index];
    day.selected = true;
    day.color = color;
    if (index - 1 >= 0 && week[index - 1].selected) {
      day.before = true;
      week[index - 1].after = true;
    }
    if (day.value !== start.value && day.value !== end.value) {
      day.middle = true;
    }
  }

  constructor() {
  }

  ngOnInit() {
    this.initCalendar();
  }

  ngOnChanges() {
    this.initCalendar();
  }

  initCalendar() {
    const monthStart = new Date(this.year, this.month, 1);
    const monthEnd = endOfMonth(monthStart);
    const diff = differenceInCalendarISOWeeks(monthEnd, monthStart);
    this.calendarStartDate = startOfISOWeek(monthStart);
    this.calendarEndDate = diff === 5 ? endOfISOWeek(monthEnd) :
      endOfISOWeek(addDays(endOfISOWeek(monthEnd), 1));

    this.monthName = format(monthStart, 'MMMM', { locale: nl });
    this.monthName = this.monthName.charAt(0).toUpperCase() + this.monthName.slice(1);

    this.renderCalender();
  }

  renderCalender() {
    this.weeks = this.initWeeks();
    this.setInputDays();
  }

  initWeeks(start: Date = this.calendarStartDate, end: Date = this.calendarEndDate): Week[] {
    const weeks = [];
    let currentDate = new Date(start);
    while (!isAfter(currentDate, end)) {
      const week: Week = [];
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
      weeks.push(week);
    }
    return weeks;
  }

  setInputDays() {
    (this.days || []).forEach(d => {
      const start = this.findDay(d.start.getDate(), d.start.getMonth());
      const end = this.findDay(d.end.getDate(), d.end.getMonth());
      if (start && end) {
        this.handleSelect(start, end, d.color);
      }
    });
  }

  onSelect(day: CalendarDay) {
    this.renderCalender();
    if (this.first) {
      this.start = this.first.value <= day.value ? this.first : day;
      this.end = this.first.value > day.value ? this.first : day;
      this.handleSelect(this.start, this.end);
      this.first = null;
      this.second = null;
    } else {
      this.start = null;
      this.end = null;
      this.first = day;
    }
  }

  onHover(day: CalendarDay) {
    if (this.first && (this.second || {}).value !== day.value) {
      this.second = day;
      this.renderCalender();
      this.handleSelect(this.first, this.second);
    }
  }

  handleSelect(first: CalendarDay, second: CalendarDay, color: string = CalendarComponent.selectionColor) {
    if (first.value === second.value) {
      const day = this.findDay(first.value, first.month);
      day.selected = true;
      day.color = color;
      return;
    }

    const firstIndex = this.findIndex(first);
    const secondIndex = this.findIndex(second);

    const startIndex = Math.min(firstIndex, secondIndex);
    const endIndex = Math.max(firstIndex, secondIndex);

    const weekLen = 7;
    for (let i = Math.floor(startIndex / weekLen); i <= Math.floor(endIndex / weekLen); i++) {
      for (let j = 0; j < weekLen; j++) {
        const week = this.weeks[i];
        const flatIndex = i * weekLen + j;
        if (flatIndex >= startIndex && flatIndex <= endIndex) {
          CalendarComponent.setRange(week, j, first, second, color);
        }
      }
    }
  }

  findIndex(day: CalendarDay): number {
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

  findDay(day: number, month: number): CalendarDay {
    const merged = this.mergeWeeks();
    return merged.find(d => d.value === day && d.month === month);
  }

  mergeWeeks(): CalendarDay[] {
    return [].concat.apply([], this.weeks);
  }

  isCurrentMonth(day: CalendarDay): boolean {
    return day.month === this.month;
  }
}
