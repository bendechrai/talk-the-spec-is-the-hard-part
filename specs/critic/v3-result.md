Findings, most severe first. Each is tagged with the category it falls under.

**1. [Edge case] Edits after placement are unaddressed.** Every constraint ("A talk can only go into a slot that is at least as long as the talk," "A talk cannot go into a room smaller than its expected audience") is phrased as a gate at scheduling time. Nothing says what happens if a talk's length is edited upward after it's placed in a now-too-short slot, or a room's capacity is edited downward below an already-scheduled talk's audience. An agent could build one-time validation with no re-validation on edit, silently leaving invalid schedules in place.

**2. [Edge case] Deletes with dependents are entirely unaddressed.** Nothing in the Constraints or Done-when sections says what happens when a room, slot, track, or talk is deleted while it has an active scheduling. Cascade delete, orphaned reference, and delete-blocked are all consistent with the spec as written.

**3. [Ambiguous criterion] "Two talks in the same track should not run in the same slot."** This is the only constraint phrased as "should not" rather than "cannot" / "can only go into," yet the Done-when list says the case "is rejected" like a hard constraint. One reading: this is a hard rejection identical in strength to the others. Other reading: it's advisory (a warning an organiser can override), and the Done-when bullet is only describing the default/unconfirmed path. These produce different UIs (blocking error vs. dismissible warning).

**4. [Edge case] Overlapping-but-not-identical slots are never tested or specified.** The speaker, room, and track rules all hinge on "the same slot," and every Done-when test uses literally the same slot id (`d1-1000`) for both talks. Nothing says what happens if Room A has a slot 10:00-10:45 and Room B has a slot 10:30-11:15 — a speaker or track could be double-booked across overlapping but distinct slot records with no rule catching it.

**5. [Fact] "A speaker cannot be scheduled in two places at the same time"** presumes every talk maps to exactly one speaker, matching "Talks have a title, a speaker" (singular). For this to hold, the domain must never have co-presented talks or panels — a routine feature of real conference programs the spec doesn't mention either way.

**6. [Vacuous test] "The schedule page lists every slot for each day in time order, with the room and the talk title and speaker names in each cell, and breaks shown as breaks."** is verified only by "a component render test with seeded data." That description is satisfied by an assertion that the component renders without throwing, with no requirement to actually check ordering, per-cell content, or that a break cell is visually/structurally distinct from a talk cell.

**7. [Vacuous test] "A rejected scheduling attempt shows the error message on the schedule page without a full reload"** gives no mechanism for asserting "without a full reload." A test could pass by mocking a rejected API call and checking any string renders, without verifying the message names the actual conflicting talks/rooms, or that the check for "no reload" means anything more than "the test harness didn't navigate."

**8. [Ambiguous criterion] "A talk can only go into a slot that is at least as long as the talk"** doesn't say whether a talk shorter than its slot occupies the whole slot (so the room-slot is fully consumed per "each room holds at most one talk per slot") or only part of it (leaving the remainder bookable). Two engineers could build slot-level scheduling or duration-within-slot scheduling from this sentence.

**9. [Edge case] Boundary values are stated but never exercised.** "At least as long" implies talk length == slot length passes, and "smaller than" implies audience == capacity passes, but no Done-when test checks either equality case, so an off-by-one (`>` vs `>=`) in either check would ship undetected.

**10. [Fact] "Talks belong to a track"** (singular) assumes every talk has exactly one track. The spec never addresses track-less talks (e.g., a keynote) or what the track-clash rule does when a talk's track is absent/null.

**11. [Ambiguous criterion] "Some slots are breaks (lunch). Nothing can be scheduled into a break."** doesn't say whether a break is per-room or a single venue-wide entry that blocks all rooms simultaneously. This changes the entire slot/room data model.

**12. [Edge case] Multi-speaker talks** (panels) are not addressed anywhere, despite being common at real conferences. If it ever comes up, none of the speaker-conflict language ("A speaker cannot be scheduled...") covers more than one speaker per talk.

**13. [Reasonable-but-wrong agent behavior] CRUD for rooms, slots, tracks, speakers, and days is never specified** — only "scheduling talks into slots" is. An agent would reasonably invent arbitrary seeding/admin mechanisms for these entities, which the author may consider out of scope or expect to be built a specific way.

**14. [Reasonable-but-wrong agent behavior] An agent could enforce every constraint only inside the scheduling API/service**, treating them as request-time gates rather than data invariants, while letting seed/fixture data (used for the render test) violate them freely — nothing in the spec requires constraints to hold at the storage layer.

**15. [Vacuous test] "the schedule shown afterwards matches the database"** has no independent oracle specified. A test could compare rendered UI state to the same in-memory object used to produce it, rather than an independent read, and still satisfy the sentence literally.

**16. [Edge case] Re-scheduling a talk into the slot it already occupies (no-op)** is not covered — "Scheduling the same talk into a second slot is rejected" only describes a *different* slot.

**17. [Fact] "Slots exist only inside the conference day, between the day's start and end times"** assumes one contiguous window per day. If the actual conference has a split schedule (e.g., morning session, gap, evening reception), boundary-based validity checking would misclassify the gap.

**18. [Ambiguous criterion] "Each room holds at most one talk per slot"** doesn't define whether "slot" means identity (same slot record) or a time-range equality/overlap check — relevant to how conflicts are detected when rooms don't share identical slot boundaries.

**19. [Reasonable-but-wrong agent behavior] "shows the error message on the schedule page"** could reasonably be built as a generic global toast unconnected to the specific cell/drop target the organiser interacted with, rather than an inline message at the attempted placement.

**20. [Edge case] Concurrent conflicting requests are not addressed.** "Neither the second placement nor any partial change is persisted" is tested only as a sequential single-actor scenario; two organisers submitting conflicting placements at the same time is untouched.
