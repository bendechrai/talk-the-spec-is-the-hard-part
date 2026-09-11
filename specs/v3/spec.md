Build me a conference scheduler. Talks have a title, a speaker, and a length. There are rooms and time slots. Organisers should be able to schedule talks into slots and see the schedule.

## Constraints

- A speaker cannot be scheduled in two places at the same time.
- A talk can only go into a slot that is at least as long as the talk.
- Slots exist only inside the conference day, between the day's start and end times.
- Each room holds at most one talk per slot, and each talk is scheduled at most once.
- Some slots are breaks (lunch). Nothing can be scheduled into a break.
- A room has a capacity and a talk has an expected audience. A talk cannot go into a room smaller than its expected audience.
- Talks belong to a track. Two talks in the same track should not run in the same slot.

## Done when

Each criterion below is a test. Write the test first, then make it pass.

- Scheduling talk t1 into Main Hall at d1-1000, then scheduling t2 (same speaker) into Room B at d1-1000, is rejected with an error that names both talks. Neither the second placement nor any partial change is persisted. (integration: API + database)
- Scheduling a 60-minute talk into a 45-minute slot is rejected with an error stating the talk length and the slot length. (unit: scheduling rules)
- Scheduling any talk into the Lunch slot is rejected. (unit)
- Scheduling a talk with expected audience 250 into Room C (capacity 40) is rejected with an error naming the room and both numbers. (unit)
- Scheduling a second Data-track talk into a slot that already has a Data-track talk in another room is rejected. (unit)
- Scheduling the same talk into a second slot is rejected; the first placement is unchanged. (integration)
- Unscheduling a talk removes it from the schedule and frees the slot; scheduling it again afterwards succeeds. (integration)
- The schedule page lists every slot for each day in time order, with the room and the talk title and speaker names in each cell, and breaks shown as breaks. Unscheduled talks appear in a separate list. (component render test with seeded data)
- A rejected scheduling attempt shows the error message on the schedule page without a full reload, and the schedule shown afterwards matches the database. (integration: route + render)
