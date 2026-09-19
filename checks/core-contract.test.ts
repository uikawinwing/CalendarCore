import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CalendarRegistry,
  type CalendarModuleAdapter,
} from '../src/index';

interface FestivalInput {
  id: string;
  name: string;
  month: number;
  day: number;
}

interface ClassInput {
  id: string;
  course: string;
  weekday: number;
  hour: number;
  minute: number;
}

interface AppointmentInput {
  id: string;
  title: string;
  year: number;
  month: number;
  day: number;
}

interface ElliaTicketInput {
  ticketId: string;
  label: string;
  validOn: {
    year: number;
    month: number;
    day: number;
  };
}

const festivalAdapter: CalendarModuleAdapter<FestivalInput> = {
  moduleId: 'festival',
  normalize(input) {
    return {
      id: input.id,
      moduleId: this.moduleId,
      kind: 'festival',
      title: input.name,
      start: {
        date: { year: 1, month: input.month, day: input.day },
      },
      allDay: true,
      recurrence: { frequency: 'yearly' },
      payload: { source: 'fixture' },
    };
  },
};

const classAdapter: CalendarModuleAdapter<ClassInput> = {
  moduleId: 'class',
  normalize(input) {
    return {
      id: input.id,
      moduleId: this.moduleId,
      kind: 'class-session',
      title: input.course,
      start: {
        date: { year: 1, month: 1, day: input.weekday },
        time: { hour: input.hour, minute: input.minute },
      },
      recurrence: { frequency: 'weekly' },
      payload: { weekday: input.weekday },
    };
  },
};

const appointmentAdapter: CalendarModuleAdapter<AppointmentInput> = {
  moduleId: 'appointment',
  normalize(input) {
    return {
      id: input.id,
      moduleId: this.moduleId,
      kind: 'appointment',
      title: input.title,
      start: {
        date: { year: input.year, month: input.month, day: input.day },
      },
      allDay: true,
    };
  },
};

const elliaTicketAdapter: CalendarModuleAdapter<ElliaTicketInput> = {
  moduleId: 'ellia-ticket',
  normalize(input) {
    return {
      id: input.ticketId,
      moduleId: this.moduleId,
      kind: 'ticket',
      title: input.label,
      start: { date: input.validOn },
      allDay: true,
      payload: {
        ticketId: input.ticketId,
        renderer: 'ellia-ticket',
      },
    };
  },
};

test('four unrelated modules normalize through one core contract', () => {
  const registry = new CalendarRegistry();
  registry.register(festivalAdapter);
  registry.register(classAdapter);
  registry.register(appointmentAdapter);
  registry.register(elliaTicketAdapter);

  const normalized = [
    ...registry.normalize('festival', {
      id: 'festival-stars',
      name: '观星祭',
      month: 8,
      day: 12,
    }),
    ...registry.normalize('class', {
      id: 'class-alchemy',
      course: '炼金术',
      weekday: 2,
      hour: 9,
      minute: 30,
    }),
    ...registry.normalize('appointment', {
      id: 'appointment-rooftop',
      title: '屋顶见面',
      year: 1024,
      month: 8,
      day: 14,
    }),
    ...registry.normalize('ellia-ticket', {
      ticketId: 'ticket-001',
      label: 'Ellia 纪念票根',
      validOn: { year: 1024, month: 8, day: 15 },
    }),
  ];

  assert.equal(normalized.length, 4);
  assert.deepEqual(
    normalized.map(event => event.moduleId),
    ['festival', 'class', 'appointment', 'ellia-ticket'],
  );
  assert.equal(normalized[0]?.recurrence?.frequency, 'yearly');
  assert.equal(normalized[1]?.recurrence?.frequency, 'weekly');
  assert.equal(normalized[3]?.payload?.renderer, 'ellia-ticket');
});

test('core rejects duplicate module registration', () => {
  const registry = new CalendarRegistry();
  registry.register(festivalAdapter);

  assert.throws(
    () => registry.register(festivalAdapter),
    /already registered/,
  );
});

test('adapter cannot emit an event owned by another module', () => {
  const registry = new CalendarRegistry();

  registry.register({
    moduleId: 'bad-module',
    normalize() {
      return {
        id: 'bad',
        moduleId: 'somebody-else',
        kind: 'bad',
        title: 'Bad event',
        start: { date: { year: 1, month: 1, day: 1 } },
      };
    },
  });

  assert.throws(
    () => registry.normalize('bad-module', {}),
    /returned event for module/,
  );
});
