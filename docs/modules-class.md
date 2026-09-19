# Class module

The Class module represents scheduled class sessions, not an entire course-management system.

Runtime path:

calendar.modules.class

Fields:

- id
- title
- start / optional end
- optional allDay
- optional recurrence
- optional courseId
- optional instructor
- optional location
- optional notes
- optional tags/metadata

## Term boundaries

CalendarCore recurrence now supports an optional inclusive until date.

Example:

frequency: weekly
until: 2026-09-22

The occurrence whose start date equals until is included; later occurrences are not generated.

This is a generic recurrence feature and is also available to Event and Appointment.

## Course data

Syllabus, textbooks, credits, grades, attendance records, and other course-domain data are not moved into the calendar event contract. They can be attached later through a dedicated module or module-specific payload/API.
