Build me a conference scheduler. Talks have a title, one or more speakers, and a length. There are rooms and time slots. Organisers should be able to schedule talks into slots and see the schedule.

## Data

- A talk has exactly one track, exactly one length in minutes, at least one speaker, and an expected audience. All required.
- A slot has a day, a start time, an end time, and a kind: session or break. Start and end are on the same day. A slot's length is end minus start.
- A room has a name and a capacity. Capacity is required.
- A placement is one talk in one room in one slot. It is the only way a talk appears on the schedule. Every placement is unique by (room, slot) and unique by talk.

## Constraints

- Two slots conflict when they are on the same day and their times overlap, not only when they are identical. All of the constraints below apply to conflicting slots, not just the same slot.
- A speaker cannot be placed in two conflicting slots. For a talk with several speakers, this applies to each of them.
- A talk can only go into a slot whose length is greater than or equal to the talk's length.
- Slots are created only inside the conference day, between the day's start and end times. Creating a slot outside them is rejected.
- Each room holds at most one talk per slot, and each talk is placed at most once.
- Nothing can be placed into a break slot.
- A talk cannot go into a room whose capacity is less than the talk's expected audience.
- Two talks in the same track cannot be placed in conflicting slots.
- Changing a talk's length, speakers, track or audience, or a room's capacity, is rejected if it would make an existing placement violate any rule above. The error names the placement.
- Deleting a room or a slot that has placements is rejected until those placements are removed.

## Done when

Each criterion below is a test. Write the test first, then make it pass. A test that would still pass if the feature were deleted is not a test: every test asserts the behaviour, not that a page rendered.

- Placing t1 (Ben Dechrai) in Main Hall at d1-1000, then t2 (Ben Dechrai) in Room B at d1-1000, is rejected with an error naming both talks and the speaker. Neither the second placement nor any partial change is persisted. (integration: API + database)
- The same test with the second placement in a slot that overlaps d1-1000 but is not identical to it (create such a slot in the test). (integration)
- Placing t4 (Priya and Marcus, 60 minutes) at d1-1500 in Main Hall, then t3 (Priya) at d1-1500 in Room B, is rejected naming Priya. (integration)
- Placing a 60-minute talk into a 45-minute slot is rejected with an error stating both lengths. Placing a 45-minute talk into a 45-minute slot succeeds. (unit)
- Placing any talk into the Lunch slot is rejected. (unit)
- Placing t1 (expected audience 250) into Room C (capacity 40) is rejected naming the room, 250 and 40. Placing it into Main Hall (300) succeeds. (unit)
- Placing t3 (Data) at d1-1400 in Room B when t10 (Data) is already at d1-1400 in Room C is rejected naming the track. (unit)
- Placing t1 into a second slot is rejected; the first placement is unchanged. (integration)
- Creating a slot from 16:30 to 17:30 on a day that ends at 17:00 is rejected. (unit)
- Reducing Main Hall's capacity to 200 while t1 (audience 250) is placed there is rejected naming the placement. (integration)
- Deleting Room B while it has a placement is rejected; after removing the placement, deleting succeeds. (integration)
- Unplacing a talk removes it from the schedule; placing it again afterwards succeeds. (integration)
- The schedule page lists every slot for each day in time order, one column per room, with the talk title and all speaker names in each cell, breaks shown spanning all rooms, and unplaced talks in a separate list. (component render test with seeded data, asserting on the specific talks in specific cells)
- A rejected placement shows the error text on the schedule page without a full reload, and the schedule shown afterwards matches the database exactly. (integration: route + render)
- Every rule under "Constraints" is enforced in one place that both the API and the UI call. A test proves the UI cannot bypass it by posting directly to the API. (integration)
