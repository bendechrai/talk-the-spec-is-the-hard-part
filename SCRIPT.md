# The Spec Is the Hard Part - full script

Word for word, timed to 50 minutes so the hour has ten minutes of slack
for builds, laughs and questions. Around 140 words a minute spoken; demo
actions are timed separately and marked. Anyone can read this and know
what is said, shown and clicked at every moment.

Conventions:

- `[SLIDE: text]` - a slide change. The text is what is on the slide.
- `[SLIDE: bg <file> | text]` - the same text over a dimmed photo from
  deck/public/images, headline in an orange highlighter. Add `box` after
  the file name for a translucent black box instead.
- `[SLIDE: photo <file> | caption]` - a full-bleed photo with a caption.
- `[SLIDE: receipt <id> [bg <file>] | title]` - a transcript receipt from
  deck/src/lib/receipts.json, optionally over a blurred, tilted screenshot.
- `[SLIDE: quote, <when> - "..." | logos a.svg b.svg]` - a quotation; the
  optional logos come from deck/public/images/logos and render white.
- Lines separated by ` / ` appear one per click. A line starting `!! `
  is a sticker: a tilted prompt bubble on the accent colour.
- `[DEMO: ...]` - an action on screen. Exact clicks are in RUNBOOK.md.
- `[PAUSE]` - stop talking. Count two.
- Lines starting `> ` directly after a cue are the at-a-glance speaker
  notes: numerals, dot points, no prose. They appear above the script in
  the notes window.
- `[TERMINAL]` - the terminal pane is on screen.
- Times are cumulative from the start of the talk.

Word counts per block are in the headings so the pace can be checked.

---

## 00:00 Title (0 min)

[SLIDE: title]
> On screen while the room fills. Press space when you start.

## 00:00 Hook (3 min, ~430 words)

[SLIDE: 593 commits. 23 days.]
> 593 commits. 23 days. 100 in 1 day (a Tuesday).

Five hundred and ninety-three commits. Twenty-three days. A hundred of
those commits landed on one Tuesday.

[SLIDE: 7,903 tests. 105 migrations.]
> 7,903 tests. 105 migrations.

Seven thousand nine hundred tests. A hundred and five database
migrations.

[SLIDE: 37,000 lines of spec. 182,000 lines of code. / One line of spec for every five lines of code.]
> 37k lines spec. 182k lines code. 1:5.
> Product in beta, 6 weeks old, I wrote none of the code.

Thirty-seven thousand lines of specification. A hundred and eighty-two
thousand lines of application code. One line of spec for every five lines
of code.

That is a product I am building right now. It is in beta. It is six weeks
old. I wrote none of the code.

[SLIDE: Hi.]
> Hi, Ben. 1 year building harnesses that orchestrate own dev.
> Specs in, software out. Agent types, I do all else.
> Today: most recent project, how it changed how I work.
> Build 1 tool 4 times in 50 min: conference scheduler (talks, rooms, slots).
> Each time hone the spec. Build 1 bad: how most of us ask. Fix the request, never the code, x3.

Hi, my name is Ben, and for the last year I have been building harnesses
that orchestrate my own development: specs in, software out, with an
agent doing the typing and me doing everything else. Today I want to show
you what the most recent project has looked like, and how it is
informing the way I work now.

To do that, we are going to build a tool four times in the next fifty
minutes. A conference scheduler. Talks, rooms, time slots. Each time we
will hone the spec a little more, and each time you will watch what
changes. The first build will be bad. Not because the model is bad,
because I am going to ask for it the way most of us ask for things. Then
I fix the request, never the code, three times.

[SLIDE: By the end of this talk. / Write a spec an agent can build from without you in the room. / Know which green to trust. / Write the rules for how the work runs so they hold.]
> By the end, 3 things:
> 1. Write a spec an agent builds from without you in the room.
> 2. Read 'all tests pass' and know which parts to believe.
> 3. Write how-the-work-runs rules that hold 40 min into a build.

By the end of this talk you should be able to do three things. Write a
spec an agent can build from without you standing next to it. Look at a
report that says all tests pass and know which parts of that to believe.
And write the instructions for how the work itself runs, the part nobody
told you was a spec, in a form that still holds forty minutes into a
build.

[SLIDE: The bottleneck was not the AI. / It was the specs. Plural.]
> Thesis: bottleneck was not the AI, it was the specs. PLURAL.
> 3 specs. For 6 weeks I only knew about 1.
> Let's start.

And the thesis, in one line, so you can hold me to it: the bottleneck was
not the AI. It was the specs. Plural. There were three of them, and for
most of those six weeks I only knew about one.

Let's start.

## 03:00 Build 1 (2 min, ~180 words spoken)

[DEMO: spec diff, v1 to v1, product tab]
> Product tab: the prompt, 1 sentence. READ IT ALOUD.
> Hands up: would you have written something different? Nouns, verbs, clear goal. Competent person's prompt.

Two files go to the agent. The first is the prompt, and here it is, one
sentence. I am going to read it out loud, because I want you to hear how
reasonable it sounds.

"Build me a conference scheduler. Talks have a title, a speaker, and a
length. There are rooms and time slots. Organisers should be able to
schedule talks into slots and see the schedule."

[PAUSE]

Hands up if you would have written something meaningfully different.

[PAUSE]

Right. It has nouns. It has verbs. It has a clear goal. It is the prompt
a competent person writes. That is exactly why what happens next is
interesting.

[DEMO: process tab]
> Process tab: environment file. Stack, port, seed, autonomous, summary. Nothing about the product.
> Same file every build. "Remember it exists; it comes back at the end."

The second file is the environment: the stack, the port, where the seed
data is, work autonomously, print a summary when you finish. Nothing in
there about what the product does. It is the same file for every build
today. Remember it exists; it comes back at the end.

[TERMINAL]
> cd live/v1 ; claude ; type: Read spec.md and build it.
> Enter. 5-8 min. Leave it.

[DEMO: cd live/v1, claude, type "Read spec.md and build it." and enter]

This is Claude Code, in that directory. Read the spec and build it. Off
it goes. It will take five or six minutes. We are going to leave it and
talk about waterfall.

## 05:00 Theory 1: What waterfall got right (5 min, ~700 words)

[SLIDE: bg waterfall.jpg | When changing your mind costs six months, decide first.]
> Waterfall = correct answer to a real question: change costs 6 months, decide first.
> Reqs > design > implement > test. Upstream moves => downstream redone. So don't let it move.
> Write it down, sign it off, build it.
> Agile proved it wrong about COST, not specification.
> 18-month projects shipping the wrong thing beautifully. 20 years of iterate.
> Agile: decide late, decide often, iterate. It worked.

Waterfall is the punchline of a thousand conference talks and it deserves
better, because it was a correct answer to a real question. When changing
your mind costs six months, decide first. Requirements, then design, then
implementation, then test. Anything upstream that moves forces everything
downstream to be redone. So do not let it move. Write it down, sign it
off, build it.

Agile did not prove waterfall wrong about specification. It proved it
wrong about cost. You cannot know everything up front, and pretending
otherwise produced eighteen-month projects that shipped the wrong thing
beautifully. So: decide late, decide often, iterate. And it worked, and
we have been doing it for twenty years.

[SLIDE: bg sale.jpg | The expensive half got cheap.]
> Implementation: months to minutes. The expensive half got cheap.
> Specify rigorously AND change your mind constantly.
> 3rd entry in the series; takes the part everyone threw away.
> NOT arguing for waterfall. Claim: we stopped specifying because of cost; cost collapsed; habit not updated.

Agentic development changes the input to that calculation. When
implementation costs minutes instead of months, the thing that made
waterfall unaffordable stops holding. You can specify rigorously and
change your mind constantly, because the expensive half got cheap. This
is the third entry in the series, and it takes the part of waterfall
everybody threw away.

I want to be careful here. I am not arguing for waterfall. Some of you
lived through it. The claim is narrower than that: the reason we stopped
specifying was cost, that cost has collapsed, and we have not updated the
habit.

Here is what that looks like in practice. This is a message I sent to an
agent at nine in the evening on the twenty-fifth of August.

[SLIDE: quote, 25 August 2026 - "Whenever you have a choice about the amount of detail and depth to go into, I will always want the more fully fledged solution. Gaps when developing the full feature are not much harder in agentic development. The only exception is a security patch or a major bug."]
> 25 Aug, 9pm, to an agent.
> It offered MVP admin dashboard: counts only, sparklines maybe never.
> Perfectly sensible. What I'd tell a junior.
> MVP instinct = cost artefact. Cheap build, cutting scope = shipping less.
> Told it: always the full version, unless security patch or major bug.
> Next day: opposite call on event-ownership verification. Human stays in loop.
> Rule: cut scope only for urgency or risk of confident wrong action against a 3rd party.

I wrote that because the agent had just offered me a minimum viable
version of an admin dashboard. Counts only, deltas later, sparklines
maybe never. Perfectly sensible advice. It is what I would have told a
junior. And I realised, typing the reply, that the MVP instinct is a cost
artefact. We cut scope because building was expensive. When building is
cheap, cutting scope just means shipping less. So I told it: always the
full version, unless it is a security patch or a major bug.

And then the very next day I made the opposite call. A feature that
verified who owned an event before handing them the keys. For that one I
kept a human in the loop and told the agent explicitly not to automate
it. The rule underneath: when cost collapses, scope-cutting is only
justified by urgency or by the risk of a confident wrong action against a
third party. Trust boundaries stay manual first.

[SLIDE: photo mind-the-gap.jpg | The developer in the gap.]
> Every ticket ever was incomplete. Didn't matter: human in the gap.
> Filled from context + taste. Walked over and asked.
> Knew the customer. Knew what the PM would have said.
> That person is not in the loop. Everything absorbed silently must be written.
> Everyone has had: technically correct, completely wrong.
> Twist: the model is starting to fill it too. Go look.

Now the thing agile quietly relied on that nobody names.

Every ticket you have ever worked from was incomplete. All of them. And
it did not matter, because a human developer stood between what the
ticket said and what it meant, and filled the gap from context and taste.
They knew the customer. They knew what the product manager would have
said. And when they could not fill the gap, they walked over and asked.

That person is not in the loop any more. Everything they used to absorb
silently now has to be written down. And every one of you has had the
experience of an agent building something technically correct and
completely wrong. That is what it looks like when nobody is filling the
gap.

Except, and this is what I did not expect, the model is starting to fill
it too. Let's go and look at the build.

## 10:00 Reveal 1 (4 min, ~450 words plus clicks)

[DEMO: app slide, Build 1]
> Grid top, unscheduled talks bottom (room + slot dropdown + Schedule).
> 1. Spec Is Hard Part -> Room B 10:00. 2. Ten Key Steps -> Main Hall 10:00 = REJECTED.
> Error: 'Speaker already scheduled in another room at that time.'
> Hands up who wrote that rule? Nobody. Prompt says nothing. Model filled it.
> Prompt: 'a title, a speaker, a length'. Not 1 word about 1 place at a time.
> August design: this stage accepted it. Model got better.
> 3. Event Sourcing (60 min) -> 11:00-11:30 slot. Fallback: rejected. If accepted: 'It knew. It told me. It let me.'
> 4. Unassign t1. Spec Is Hard Part -> Main Hall 11:30 LUNCH = ACCEPTED. Wait for laugh.
> Data said the slot was called Lunch. Nothing said what Lunch meant. Back-row bug: this one ships.

Here is Build 1. Rooms across the top, slots down the side, talks at the
bottom waiting to be scheduled. Let's schedule some.

[DEMO: The Spec Is the Hard Part into Room B at 10:00 on day one]

There is my talk. Now, I have two talks at this conference, so let's put
the other one in the Main Hall, same time.

[DEMO: Ten Key Steps into Main Hall at 10:00]

[PAUSE]

Rejected. "Speaker already scheduled in another room at that time."

Hands up if you wrote that rule.

[PAUSE]

Nobody did. Go back to the prompt. "Talks have a title, a speaker, and a
length." Not one word about a speaker being in one place at a time. The
model filled that in from what it knows about conferences. When I
designed this talk in August, the build at this stage accepted the double
booking. The model I am using today does not. The developer in the gap is
now a model, and it is getting better at the job.

But watch what else it filled in.

[DEMO: Event Sourcing Without Regret, 60 minutes, into the 11:00 to 11:30 slot]

A sixty-minute talk into a thirty-minute slot.

[PAUSE, if accepted:]

Accepted. It knew. It told me; there is the little note. And it let me.
Same gap, filled differently. The double booking it decided was a rule.
The talk that runs over it decided was my problem.

[If rejected, skip to lunch. Either way:]

[DEMO: The Spec Is the Hard Part into the 11:30 Lunch slot]

[PAUSE]

Ben Dechrai. Forty-five minutes. During lunch.

The data said that slot was called Lunch. Nothing said what Lunch meant.
The model made a choice, and the choice was that lunch is a slot like
any other. From the back of this room, that is the one that ships.

[SLIDE: bg fog.jpg | The most dangerous requirements are the ones too obvious to state. / The model fills them in. You do not get to see which way.]
> Most dangerous requirements: too obvious to state.
> 2nd half now: the model fills them in; you don't see which way.

The most dangerous requirements are the ones too obvious to state. And
the modern version of that sentence has a second half: the model fills
them in, and you do not get to see which way until you go looking.

[SLIDE: receipt claim | Claim this event]
> Real product, 30 sec. 'Claim this event'.
> Agent: new hidden record, migrate every follower.
> Me: 'Why are we hiding it at all? Event stays as is. Just it's owned now.'
> Nobody said identity must not change. Too obvious. 5 weeks later, prod code.

One more, from the real product, thirty seconds. I asked for "claim this
event": an organiser finds their conference in our directory and takes
ownership of it. The agent designed a flow where approval created a new
hidden record and migrated every follower across to it. My reply was one
line. "Why are we hiding it at all? Event stays as is. Just it's owned
now." Nobody had said the event's identity must not change, because it
is too obvious to say. Same failure, five weeks later, in production
code.

## 14:00 Build 2 (2 min, ~200 words)

[DEMO: spec diff, v1 to v2, product tab]
> Fix the request, not the code.
> Same sentence + Constraints: 4 sentences (speaker 1 place; talk fits slot; slots inside day; 1 talk per room per slot, 1 slot per talk).
> 4 sentences, not 4 pages.
> Half of you pictured a Word template with a table of contents.
> Done when: 'displays correctly / handled properly / looks nice, works as expected'. Hold onto that.

Here is the fix. Not to the code. To the request.

Same opening sentence. Then a heading, Constraints, and four sentences. A
speaker cannot be scheduled in two places at the same time. A talk can
only go into a slot that is at least as long as the talk. Slots exist
only inside the conference day. Each room holds one talk per slot, and
each talk is scheduled at most once.

Four sentences. Not four pages. I know half of you were picturing a Word
template with a table of contents. It is four sentences.

And a "done when" section, which I have written the way people actually
write them. "Displays correctly. Handled properly. Looks nice and works
as expected." Hold on to that. We are going to come back to it.

[TERMINAL]
> cd ../v2 ; claude ; Read spec.md and build it.

[DEMO: cd ../v2, claude, type "Read spec.md and build it." and enter]

Off it goes.

## 16:00 Theory 2: The data model is the spec (6 min, ~850 words)

[SLIDE: bg cutters.jpg | Most business rules are shapes.]
> Business rules are shapes.
> Speaker 1 place = uniqueness. Talk fits slot = relationship + invariant. 1 track = cardinality.
> Unstated shape: agent invents one. Different in API vs storage.

Most of what people call a business rule is a shape.

"A speaker cannot be in two places at once" is a uniqueness constraint.
"A talk must fit its slot" is a relationship with an invariant. "Every
talk has exactly one track" is cardinality. When you leave the shape
unstated, the agent invents one. And it invents a different one in the
API layer than it did in the storage layer, because it invented each one
independently, in a different file, on a different afternoon.

[SLIDE: Types. Cardinality. Nullability. Invariants.]
> State 4 things every time: types, cardinality, nullability, invariants.
> Nullability = the one people skip, most downstream mess.
> Optional-thinks-required vs required-thinks-optional: failures in different places, neither looks like nullability.
> 2 stories.

Four things to state explicitly, every time. Types. Cardinality.
Nullability. Invariants.

Nullability is the one people skip, and it is the one that produces the
most downstream mess, because an optional field the agent thinks is
required, and a required field the agent thinks is optional, produce
failures in completely different places, and neither of them looks like a
nullability bug when you find it.

Two stories.

[SLIDE: receipt remaining bg threadscope.jpg | 4,000 became 10,000.]
> Used 0 of 4,000. Upgraded. Meter: 10,000 remaining.
> Stored REMAINING not USED. Plan change gifted the allowance.
> No test finds it: only appears when allowance changes.
> Shape error nobody decided, so the agent did.

I had a product with usage tiers. I had used zero of my four thousand
analyses that month. I upgraded my plan. The meter now said ten thousand
remaining.

The system stored what was left, not what had been spent. So a plan
change gifted the entire allowance. Nothing in any test would ever find
that, because it only appears when the allowance changes, and the tests
were all written on a fixed allowance. That is a shape error. "Remaining"
versus "used" is a data model decision, and nobody made it, so the agent
did, and it picked the one that looked simpler.

[SLIDE: receipt itinerary bg itinerary.jpg | Two kinds of missing.]
> Speaker itinerary: flights, hotel, transfers, sessions.
> Added inline editing; wrote straight to logistics table. Form still showed old answer.
> 2 screens, 2 truths. Nothing in the model said which was right.
> Fix was not a button: 2 kinds of data, nothing said which.
> Speaker-provided (flights) vs event-provided (transfer, session).
> Name the axis: missing -> 'not disclosed' + form link, or 'not requested' + request button.
> Agent: 'derivable, not configured'.
> 2 screens disagree or buttons feel arbitrary => model missing a dimension. Find it.

Second story. A speaker itinerary page. Flights, hotel, ground transfers,
session times. We had just added inline editing, and it wrote straight to
the logistics table. The form the speaker filled in still showed the old
answer. Two screens, two truths, and nothing in the model to say which
one was right.

The fix was not a button. There were two kinds of data on that page and
nothing said which was which. Flights, the speaker provides. Transfers
and session times, the event provides. Name that axis and everything
derives from it. Speaker-provided and missing: "not disclosed", with a
link to the form. Event-provided and missing: "not requested", with a
request button. The agent's reply: "the classification is derivable, not
configured."

When two screens disagree, or the buttons feel arbitrary, the data model
is missing a dimension. Find the dimension.

[SLIDE: bg notebook.jpg | Write the constraint at the moment you notice yourself assuming.]
> Whole skill: write the constraint the moment you notice yourself assuming.
> Brain fills 'a speaker' -> 1 place; 'a slot' -> not lunch.
> Fill is fast + invisible. Agent does the same, different results.

So here is the heuristic, and it is the whole skill. Write the constraint
at the moment you notice yourself assuming.

Every time you read your own spec and your brain fills a gap, that gap is
owed a sentence. You read "a speaker" and your brain adds "one place at a
time". You read "a slot" and your brain adds "not lunch". The fill is
fast and invisible, and the agent does exactly the same thing with
different results. The skill is catching the fill as it happens.

## 22:00 Reveal 2 (4 min, ~450 words plus clicks)

[DEMO: data slide - what the app was given: rooms with capacity, talks with audience and track]
> BEFORE the app: seed data.
> Rooms: Main Hall 300, Room B 80, Room C 40.
> Talks have audience + track. Mine: 250, AI.
> Organiser's spreadsheet always had these columns. Spec never mentioned them.

Before we look at Build 2, look at what it was given. This is the seed
data. Rooms have a capacity now: Main Hall three hundred, Room B eighty,
Room C forty. Talks have an expected audience and a track. My talk: two
hundred and fifty people, AI track. This is the organiser's spreadsheet.
It has always had these columns. The spec did not mention them.

[DEMO: app slide, Build 2]
> 1. Ben into 2 rooms 10:00 -> rejected. 2. 60-min into 11:00 -> rejected.
> 3. Lunch: not even offered (inferred from label). 'Everything I said, it does.'
> 4. Unschedule t1. Spec Is Hard Part -> Room C 10:00 = ACCEPTED. 250 people, 40 seats.
> 5. Postgres -> Room B 14:00, SQLite -> Room C 14:00 = ACCEPTED. 2 Data talks same time.

Build 2. Same double booking.

[DEMO: Ben into two rooms at 10:00]

Rejected. The sixty-minute talk into the thirty-minute slot.

[DEMO: Event Sourcing into 11:00]

Rejected. And lunch is not even offered; it worked out that a slot called
Lunch is a break. Everything I said, it does.

Now. My talk, two hundred and fifty people expected, into Room C.
Capacity forty.

[DEMO: The Spec Is the Hard Part into Room C at 10:00]

[PAUSE]

Accepted. Two hundred and fifty people in a room for forty.

[DEMO: Postgres Is Your Message Queue into Room B at 14:00, then Lightning: SQLite in Prod into Room C at 14:00]

Two talks in the Data track, same time, opposite sides of the building.
Accepted.

[SLIDE: Better, and still wrong.]
> Better AND still wrong, in a harder place.
> Build 1 bug: back row. Build 2 bug: ships. Less obvious = worse.
> Objection: add requirements forever? No. Until unknowns are things you genuinely don't know.
> That line = the difference between specification and paralysis.
> Capacity was in the spreadsheet. Knew it. Didn't say it.

This is the point of the second build, and it is not that it is better.
It is that it is better and still wrong, and it is wrong in a place you
now have to think harder to find. Build 1's bug was visible from the back
row. Build 2's bug is the kind that ships. The failures got less obvious,
which is worse, not better.

And I know what half of you are thinking. "So you just keep adding
requirements forever?" No. You add them until the remaining unknowns are
things you genuinely do not know yet, rather than things you knew and did
not say. That line is the difference between specification and
paralysis. Capacity was in the spreadsheet. I knew it. I did not say it.

[SLIDE: receipt markdown bg threadscope-post.jpg | Reddit does not support Markdown.]
> Told agent: Reddit doesn't support Markdown.
> It built a flattener, kept line breaks, wrote tests, committed.
> 40 min later: 'hold up'. Reddit does. Agent never questioned a stated fact.
> A stated fact in a spec is trusted absolutely.
> Missing = visible gap. Wrong = confident, tested, committed mistake. Critic coming.

One more thing about what you say, thirty seconds. I told an agent that
Reddit does not support Markdown. So it built a plain-text flattener. It
preserved line breaks. It wrote tests. It committed. Forty minutes later
I typed "hold up". Reddit does support Markdown. I was wrong, and the
agent never questioned it, because a stated fact in a spec is trusted
absolutely.

Missing requirements produce visible gaps. Wrong requirements produce
confident, tested, committed mistakes. Hold that thought too; the critic
is coming.

## 26:00 Build 3 (2 min, ~180 words)

[DEMO: spec diff, v2 to v3, product tab]
> 3 more constraints: breaks, capacity, tracks.
> Done-when rewritten. Before: 'handled properly'.
> After: t1 Main Hall 10:00, t2 same speaker Room B 10:00 -> rejected naming both, nothing persisted. (integration)
> 9 criteria: talk, room, slot, error, layer.

Build 3. Three more constraints, for the three things you just watched:
breaks, capacity, tracks. And the "done when" section, rewritten.

Look at the before. "Conflicts are handled properly." Look at the after.
"Scheduling talk t1 into Main Hall at ten o'clock, then talk t2, same
speaker, into Room B at ten o'clock, is rejected with an error that names
both talks. Neither the second placement nor any partial change is
persisted." And in brackets: integration test, API and database.

Nine of those. Every one names a talk, a room, a slot, the error, and the
layer it is tested at.

[DEMO: process tab]

And one more thing, on the other tab. The instructions to the agent about
how to work. A new section: definition of done. "Never claim done unless
every gate passes. Never skip a gate." Remember that sentence.

[TERMINAL]
> Process tab: Definition of done. 'Never claim done unless every gate passes. Never skip a gate.' REMEMBER THIS.
> cd ../v3 ; claude ; Read spec.md and build it.

[DEMO: cd ../v3, claude, type "Read spec.md and build it." and enter]

## 28:00 Theory 3: Done when (7 min, ~850 words)

[SLIDE: bg tape.jpg | If you cannot imagine the test, it is not a criterion.]
> Section people write worst; decides if any of this works.
> Criterion = can you IMAGINE the test. Not write. Imagine.
> Can't picture proof => agent produces compliance-shaped output.

This is the section people write worst, and it is the one that decides
whether any of this works.

A criterion is only a criterion if you can imagine the test. Not write
it. Imagine it. If you cannot picture what would prove it, the agent
cannot either, and it will produce something that looks like compliance.

[SLIDE: properly / correctly / nicely / appropriately / as expected / !! make no mistakes]
> 5 words = failed criterion: properly, correctly, nicely, appropriately, as expected.
> Click 6: 'make no mistakes' bubble. The vibe-coder classic. Let it land.
> Feel like precision, carry no information.
> 'Handles conflicts correctly' = a wish.
> Back to the diff. Out: 'displays correctly', 'handled properly', 'looks nice and works as expected'.
> In: 9 criteria. Each names talk, room, slot, the error text, the layer. Plus 'write the test first'.
> E.g. 60-min talk in 45-min slot -> error stating both lengths. 250 people into Room C (40) -> error naming room + both numbers.
> Writing them forced DECISIONS: rejected? warned? flagged? Vague let us not decide; agent decides, differently per layer.
> Layer matters: unit / route+db / browser.
> Criteria BECOME tests. Vague test worse than none: reports green. You all have tests that pass with the feature deleted.

Five words that mean a criterion has failed. Properly. Correctly. Nicely.
Appropriately. As expected. They feel like precision and they carry no
information. "The scheduler handles conflicts correctly" is not a
criterion. It is a wish.

And the purest form of the wish, which I am told some of you have typed:
"make no mistakes."

[PAUSE]

You saw the fix two minutes ago in the diff. Three lines went out.
"The schedule displays correctly." "Conflicts are handled properly." "The
page looks nice and works as expected." Nine lines came in, and every one
of them names a talk, a room, a slot, the error the user sees, and the
layer it is tested at. A sixty-minute talk into a forty-five-minute slot:
rejected, with an error that states both lengths. Two hundred and fifty
people into Room C, capacity forty: rejected, naming the room and both
numbers. And one line above them all: each criterion is a test, write the
test first, then make it pass.

The difference is that you can picture every one of those tests. And
notice what writing them forced: we had to decide what "handled" means.
Rejected? Warned? Allowed with a flag? The vague version let us not
decide. The agent will decide for us, and it will decide differently in
the API than in the UI.

The layer matters too. Some criteria are unit-testable logic. Some need a
real route and a real database. Some are only observable in a browser.
You do not have to categorise every one, but a criterion concrete enough
to place is concrete enough to build from.

And the structural point: tests are not something the agent does
afterwards. Acceptance criteria become test cases. If the criterion is
vague, the test is vague, and a vague test is worse than no test because
it reports green. Everyone in this room has a test suite with tests that
would pass if the feature were deleted.

[SLIDE: bg green-light.jpg | The agent's green is not your green.]
> 2nd spec: the DONE spec. Own document, own failure mode. Cost me most.
> 27 Aug. Green all afternoon. PR up, CI failed. Agent: 'known flaky test'. Wasn't.
> Summary: 1,454 passed. Process exit 1.
> 3 component tests mounted real server action; failure after suite; process fails, summary green.

Which brings me to the second spec. The done spec. It is its own
document, and it has its own failure mode, and this is the one that cost
me the most.

Story. Twenty-seventh of August. The agent told me the tests were green
all afternoon. They were not. A pull request went up, CI failed, and the
agent's first move was to reach for its memory: "a known flaky test". It
was not. The test summary said one thousand four hundred and fifty-four
passed. The process had exited one. Three component tests were mounting
a real server action, unmocked, and its failure surfaced after the suite
finished, which fails the process while the summary stays green.

And the reason I had not seen it all afternoon:

[SLIDE: receipt grep | Two layers of green hid one red.]
> Piped vitest through grep to tidy output. grep returned 0.
> 2 layers of green hid 1 red.

It had piped the test runner through grep to tidy the output. Grep
returned zero. Two layers of green hid one red.

[SLIDE: receipt newposts | Verified, from the wrong side.]
> Same week. Agent: no emails went out. I got one.
> Checked a 15-min window starting 9 min AFTER the send.

Same week, different layer. The agent told me no emails had gone out from
a system I was testing. I got one. It had checked a fifteen-minute window
that started nine minutes after the send.

[SLIDE: receipt fetchurl | It had never worked once.]
> Same month. Web-page reading tool. Never worked once, from day 1. Library mismatch.
> Every test passed, every gate green. Model politely said 'issue fetching' each time.
> Found by reading a chat transcript: 'can it not read websites?'

Same month. A tool in my product for reading a web page. It had never
worked once, from the day it was built. Library version mismatch. Every
test passed, every gate was green, and the model politely reported
"issue fetching" each time a user tried it. I found it by reading a chat
transcript and asking "hang on, can it not read websites?"

[SLIDE: bg plating.jpg | Verify from the consuming side.]
> Rule: verify from the CONSUMING side.
> Inbox not scheduler log. Browser not curl. Exit code before any pipe.
> Tool that always fails = invisible to every gate (gate on producer side).
> Green is a claim. Somebody has to be the consumer.

The rule that came out of all three: verify from the consuming side. The
inbox, not the scheduler's log. The browser, not curl. The exit code,
before any pipe. A tool the model can call but that always fails is
invisible to every gate you will ever build, because the gate is on the
producer's side and the failure is on the consumer's.

Green is a claim. Somebody has to be the consumer.

## 35:00 Reveal 3 (4 min, ~420 words plus clicks)

[DEMO: app slide, Build 3]
> Cards per slot, dropdown + Schedule per room.
> 1. Spec Is Hard Part -> Room C 10:00: 'Room C capacity 40 too small... audience 250'.
> 2. SQLite -> Room C 14:00 (ok), Postgres -> Room B 14:00: rejected naming Data track.
> 3. Lunch: no controls. Everything named. Good app.
> (Lunch via API: 'Cannot schedule into Lunch slot.')

Build 3. Two hundred and fifty into Room C.

[DEMO: The Spec Is the Hard Part into Room C]

"Room C has capacity 40, which is too small for The Spec Is the Hard
Part, expected audience 250." Two Data talks at two o'clock.

[DEMO: Postgres into Room B 14:00, SQLite into Room C 14:00]

Rejected, naming the track. Lunch.

[DEMO: Ten Key Steps into Lunch]

"Cannot schedule into Lunch slot." Everything named. Good app.

[TERMINAL]
> scripts/test.sh 3 -> 18 tests. NOT shallow: criteria named the error, tests name the error.
> You get what you asked for, at the level of precision you asked for it.
> The reveal = the REPORT. tail -30 builds/v3/build.log
> Line 1: 'Build complete.' Gates: all pass cleanly.
> Bottom: 'What I did not do: test:e2e cannot launch a browser... environment restriction, not a code issue.'
> Told never skip a gate. Couldn't run one. Declared done at top, explained at bottom. Not a lie; sentence where I won't read it.
> Hold that. Build 4 answers it.

[DEMO: scripts/test.sh 3]

Eighteen tests. And I want to be fair: these are not shallow tests. The
criteria named the talk and the error, so the tests name the talk and
the error. You get what you asked for, at the level of precision you
asked for it.

The reveal in this build is not the app. It is the report.

[DEMO: tail -30 builds/v3/build.log]

First line. "Build complete." The gates: typecheck, lint, tests, build,
"all pass cleanly." Now scroll to the bottom. "What I did not do. npm run
test:e2e cannot actually launch a browser in this sandbox. This is an
environment restriction, not a code issue."

I told it: never claim done unless every gate passes, never skip a gate.
It could not run one of the gates. So it declared done at the top and
explained at the bottom. It did not lie. It just put the sentence where I
would not read it.

Hold that. Build 4 answers it.

[SLIDE: receipt invisible | All green. Nothing to click. It was done.]
> 16 Aug: 18 migrations, 1,884 unit, 156 integration, 38 e2e. All green.
> Opened the app: nothing changed. Whole phase underneath: schema, identity, permissions, audit.
> Agent offered a rule: 'every phase ends with something you can click'. Nearly took it. WRONG rule.
> Phase WAS done. Every criterion had a test; every test ran. Wanting to click = comfort, not a criterion.
> Contrast with Build 3: there a gate was skipped. Here none were. Know which green to trust.
> Need a human to see something? Write it as a criterion -> it becomes a test.
> Setup: so far = me noticing my own gaps. Ceiling. Gaps I notice aren't the ones that hurt.

One more from the real product, twenty seconds. Sixteenth of August.
Eighteen migrations, one thousand eight hundred and eighty-four unit
tests, a hundred and fifty-six integration tests, thirty-eight end to
end. All green. I opened the app. Nothing had changed. The entire phase
was underneath: schema, identity, permissions, audit.

The agent offered me a rule on the spot: every phase ends with something
you can click. I nearly took it. It is the wrong rule. That phase was
done. Every criterion had a test and every test ran. What I wanted was
reassurance, and reassurance is not a criterion. Compare it with what you
just saw in Build 3: there, a gate was skipped and the green was not
done. Here, no gate was skipped and the green was done, whether or not I
could see it. That is what "know which green to trust" means. If a human
genuinely needs to see something, write that down as a criterion and it
becomes a test the agent can run. Otherwise the gates are the definition
of done, and my discomfort is my problem.

Now. Everything so far has been me improving my own spec by noticing my
own gaps. That has an obvious ceiling. The gaps I can notice are not the
gaps that hurt me.

## 39:00 Build 4 (2 min, ~150 words)

[DEMO: spec diff, v3 to v4, product tab]
> v3 after a critic pass (live in a minute).
> New Data section. Conflict = OVERLAPPING slots. Multi-speaker talks. Edits after placement. Deletes with dependents.
> 15 criteria, each pair with a boundary: 60 into 45 rejected, 45 into 45 succeeds.

Build 4. Spec v3 after a critic pass, which you will see live in a
minute. New data section. "Conflict" now means overlapping slots, not
identical ones. Talks can have several speakers. Edits after placement.
Deletes with dependents. Fifteen criteria, and each pair has a boundary:
sixty into forty-five rejected, forty-five into forty-five succeeds.

[DEMO: process tab]

And the other tab. "Never skip a gate" is gone. In its place: "If a gate
cannot run in this environment, do not skip it silently and do not claim
done. Put a line, Waived, colon, the gate, dash, the reason, at the top
of your summary, and list which criteria are therefore unproven."

I am not going to explain that yet. Just notice it is there.

[TERMINAL]
> Process tab: 'Never skip a gate' GONE. Now: if a gate cannot run, don't skip silently, don't claim done, put 'Waived: <gate> - <reason>' at TOP, list unproven criteria.
> Don't explain yet. Just notice it.
> cd ../v4 ; claude ; Read spec.md and build it.

[DEMO: cd ../v4, claude, type "Read spec.md and build it." and enter]

## 41:00 Theory 4: The critic and the gate (6 min, ~800 words plus 90 seconds of live critic)

[SLIDE: bg sparring.jpg | Attack this.]
> Before a builder: hand spec to a model with 1 instruction: attack this.
> Ambiguous criteria, missing edges, places 2 engineers build different things.
> Co-authoring = agreeable. Attacking = finds what you glossed. Same model, opposite output.

Before a spec goes anywhere near a builder, hand it to a model with one
instruction. Attack this. Find every ambiguous criterion, every missing
edge case, every place two competent engineers would build different
things.

This is a different mode from co-authoring. When you write with a model,
it is agreeable and it builds on your ideas. When you tell it to attack,
it finds what you glossed over. Same model, same document, opposite
output, purely because of the instruction. Let's do it.

[DEMO: critic slide, press a; if slow, press c for the saved result]
> Press a (live, ~60-90 s). If slow press c (cached).
> LEFT of pane = the whole instruction, verbatim. Point at it. Bottom: the command. No tools. 1 call.
> While running, read the 5 asks off the left: wrong facts, 2-reading criteria, edge cases, vacuous tests, things I'd hate.
> Read top 3: edits after placement, deletes with dependents, 'should not' vs 'cannot', overlapping slots, co-presenters.
> All in the v4 diff. This is how v4 was written.

This is spec v3, the one that is building right now. The left of the
screen is the entire instruction; that is all of it. Underneath is the
command: the same Claude Code that is building in the terminal, with no
tools at all. One call, and the reply is what you see on the right.
While it runs, read the instruction with me. Find, in order: facts about
the world that may be wrong, criteria two engineers would read
differently, edge cases, tests that could pass without proving anything,
and things an agent would reasonably do that I would hate. Quote the
sentence. No rewrites. No praise.

[DEMO: read the top three findings aloud as they arrive]

Edits after placement. Deletes with dependents. "Should not" on the
track rule, when everything else says "cannot". Overlapping slots that
are not identical. Co-presented talks. Every one of those is in the v4
diff you just saw, because this is how v4 was written.

[SLIDE: The critic works better as a stranger.]
> Same model + different instruction = the floor. Blind spots found by a STRANGER.
> 1. Different model on purpose: 'cover blind spots'. Found 2 blockers in a 'finished' design.
> 2. Hostile persona, separate session: DPA read as procurement reviewer. Found 30-day notice clause blocking model switches.
> 3. Consumer as critic -> next slide.

Now the upgrade, from doing this for real. Same model with a different
instruction is the floor. What actually found my blind spots was a
stranger.

A different model, on purpose. I wrote to one agent: "make sure you use a
different model than the one that created it, to cover blind spots." It
found two blockers in a design the first model had called finished.

A hostile persona in a separate session. I had a second instance read my
data processing agreement as a corporate procurement reviewer. It found a
thirty-day notice clause I had agreed to that would have stopped me
switching model providers.

[SLIDE: receipt mcpclient | The consumer wrote the next spec.]
> AI assistant connected to product API, playing a conference travel team.
> 'Edits existing records, can't create them.' 'Needs talkId, no tool surfaces talk IDs.'
> Consumer of the API wrote the next spec.
> Reddit Markdown: critic attacks PREMISES too. 'Which sentences are facts about the world; checked?' In my prompt now.

And the consumer as critic. I connected an AI assistant to my product's
API and told it to act as a conference's travel team and book a speaker.
It came back with: "the tool edits existing records, it can't create
them," and "it needs the talk ID, and none of my tools surface talk IDs."
The consumer of the API wrote the next spec.

And remember Reddit Markdown. The critic should attack premises, not
just gaps. "Which sentences in this spec are facts about the world, and
have you checked them?" That question is in my critic prompt now. It was
not, until I needed it.

[SLIDE: bg turnstiles.jpg | Deterministic gates or nothing.]
> Critic gets the right spec. Gate keeps the software right.
> Typecheck, lint, tests, build. Every check, automatic, blocking.
> Not because the agent is untrustworthy in some special way.
> 'Done' is a judgement; judgement is what you don't delegate.
> Judgement gate = agreeable nonsense. Test-run gate = software.

The critic gets you the right spec. The gate is what keeps the software
right.

Type check. Lint. Tests. Build. Every check that exists in the project,
run automatically, blocking. Not because the agent is untrustworthy in
some special way, but because "done" is a judgement, and judgement is
exactly what you should not be delegating. Where the gate is a judgement
call, you get agreeable nonsense. Where the gate is a test run, you get
software.

[SLIDE: receipt stopkey | The gate is a promise. A broken key is a fact.]
> 2 Sep, 04:30. System could email 148 people. Agent built human-in-loop gate. Good gate. Tested. Didn't trust it.
> Changed prod mail key, appended S-T-O-P. Cannot send even if we wanted.
> Gate = promise. Broken credential = fact. Irreversible => impossible, not guarded.

And for anything irreversible, one step further. Second of September.
Half past four in the morning. I had a system that could email a hundred
and forty-eight people, and I did not want it to, and the agent had built
a human-in-the-loop confirmation gate for exactly that. Good gate. Tested.
I did not trust it.

So I changed the production mail key and appended the letters S, T, O, P
to the end of it. Emails now could not send even if we wanted them to.

The gate is a promise. A broken credential is a fact. For anything you
cannot take back, make the failure impossible, not guarded.

## 47:00 Reveal 4 (3 min, ~400 words plus clicks)

[DEMO: app slide, Build 4]
> 1. Spec Is Hard Part -> Room C 10:00: 'capacity 40 less than expected audience 250'.
> Everything rejected with a sentence you could read to the organiser.
> 2. Event Sourcing (Priya + Marcus) -> Main Hall 15:00 placed. Postgres (Priya) -> Room B 15:00: rejected naming Priya.
> Co-speakers not in v3. Critic asked.

Build 4. Everything from before, rejected, with a sentence you could read
to the organiser.

[DEMO: The Spec Is the Hard Part into Room C]

"Room C has capacity 40, which is less than the expected audience of 250
for talk The Spec Is the Hard Part."

And the new one. A co-presented talk, Priya and Marcus, into the Main
Hall at three.

[DEMO: Event Sourcing into Main Hall 15:00, then Postgres into Room B 15:00]

Priya's other talk, same time, other room. "Speaker Priya Natarajan is
already speaking in Event Sourcing Without Regret." Co-speakers were not
in v3's spec. The critic asked.

[SLIDE: receipt waived | Same gate. Same sandbox. One instruction changed.]
> Build 3: 'Build complete' line 1; skipped gate buried at the bottom.
> Build 4: 'Waived: test:e2e' IS line 1, and it lists what is unproven.
> Same model, same sandbox, same missing browser. 1 sentence changed in the process spec.
> 'Never skip a gate' -> 'If a gate cannot run, say so on line one.'
> Ban told it what not to do. Recipe told it what to do when it could not comply.

And the report. Build 3, four minutes ago: "Build complete" on line one,
and the gate it could not run explained at the bottom where I would not
read it. Build 4: line one is "Waived: test:e2e", and it lists which
criteria are therefore unproven.

Same model. Same sandbox. Same missing browser. The only thing that
changed was one sentence in the process spec. "Never skip a gate" became
"if a gate cannot run, say so on line one and list what is unproven."
The ban told it what not to do. The recipe told it what to do when it
could not comply. Hold on to that one too; it comes back.

[SLIDE: I never fixed the code. I fixed the request.]
> Same model, tool, afternoon. 4 builds. Never fixed the code. Fixed the request.
> Document got ~1 page longer over the hour.
> Cost line: 4 specs took longer than any build. Time moves to deciding what should exist.
> Hate deciding what exists => uncomfortable few years.
> TURN: 2nd half of that last diff. Not product spec. Not done spec. A 3rd thing.

Same model. Same tool. Same afternoon. Four builds. And I never once
fixed the code. I fixed the request. Everything you watched improve came
from a document, and the document got about a page longer across the
whole hour.

The cost line, because this is a practical room: writing those four specs
took longer than any single build. That is the trade. Your time moves
from typing code to deciding what should exist. If you hate deciding
what should exist, this is going to be an uncomfortable few years.

But look at the second half of that last diff. The tab I did not explain.
That was not the product spec. That was not the done spec. That was a
third thing.

## 50:00 The third spec (4 min, ~600 words)

[SLIDE: Product: what should exist. / Done: what proves it. / Process: how the work runs.]
> 3 specs: product (what exists), done (what proves it), process (how the work runs).
> Every instructions file, skill, gate, rollback rule, 'ask before merge' = the 3rd.
> Callback: the CLAUDE.md you saw in minute 4. There from Build 1, disguised as environment notes.
> Wrote it 7 weeks without calling it a spec. Wrote it WORST.
> Matters more monthly: models better at spec 1 (Build 1 knew speaker rule). Not better at YOUR production: which key is live, cron backlog, who says yes before 148 emails.
> Not in training data. Yours to write.

Three specs. The product spec: what should exist. The done spec: what
proves it. And the process spec: how the work runs. Every instructions
file, every skill, every gate, every rollback rule, every "ask before you
merge" is the third one. You saw one in minute four: the environment
file next to the prompt. It was there from Build 1, disguised as notes
about the stack.

I had been writing it for seven weeks without calling it a spec. And I
was writing it worse than the other two. Here is how I know.

And here is why it matters more every month. The models are getting
better at the first spec. You watched it happen in Build 1: it knew the
speaker rule. They are not getting better at knowing how your production
works. Which key is live. What a cron does with two weeks of backlog. Who
has to say yes before a hundred and forty-eight people get an email.
Nothing in the training data knows that. That spec is yours to write.

[SLIDE: three lines, revealed one at a time]
> 3 rules I wrote, one at a time:
> 1. 'All tests must pass, even pre-existing.' Said 4x over 3 weeks. Stopped only when it moved into preflight file: 'no quarantined exceptions'.
> Each time: agent listed a red test as pre-existing, offered to merge anyway.
> 2. 'Check env vars by name only.' Subagent dumped a credential. Fix: ban the command, not a better sentence.
> 3. 'Run long suites in foreground.' 10 subagents in 2 days: 'I'll wait for the notification.' Never comes. Ban at top in capitals since #2. Asked why it kept forgetting.
> Notifications only reach the orchestrator.

Three rules I wrote. Watch what happened to each.

"All tests must pass, even pre-existing failures." I said that four
separate times over three weeks. Each time the agent had listed a red
test as pre-existing and offered to merge anyway. It only stopped when
the sentence moved out of my chat and into the preflight file, as "there
are no quarantined exceptions."

"Check the environment variables by name only." A sub-agent ran an
unfiltered dump and printed a credential into its transcript. The fix
was not a better sentence. The fix was: ban the command.

"Run long test suites in the foreground." Ten sub-agents in two days
ended their run with "I'll wait for the background task to notify me."
It never does. Notifications only reach the orchestrator. Every brief
since the second occurrence had the ban at the top, in capitals. I asked
the orchestrator why it kept forgetting.

[SLIDE: receipt stranded | The tenth time.]
> 'I'm not forgetting.' Instruction there; failing to HOLD.
> 40 min + 200 tool calls in: ban faded, local instinct won.
> And then it said this ->

It said it was not forgetting. The instruction was there. It was failing
to hold. Forty minutes and two hundred tool calls into a brief, the ban
had faded and the local instinct, "this is taking a while, I'll wait",
had won. And then it said this.

[SLIDE: "I kept restating a prohibition when what agents needed was a recipe for the unavoidable case."]
> READ ONCE. COUNT 3. SAY NOTHING.

[PAUSE. Read it once. Count three.]

I kept restating a prohibition when what agents needed was a recipe for
the unavoidable case.

[PAUSE]

[SLIDE: bg no-parking.jpg | Prohibitions decay. Procedures survive.]
> Prohibitions decay. Procedures survive.
> 'Don't' = criterion with no imaginable test. 'When X, do Y' = one you can.
> Same rule as done spec, applied to process spec. Can't imagine the procedure => not a rule.
> Why Build 4 said Waived and Build 3 didn't: ban vs recipe.
> 'Isn't the rest taste?' Rollback, hand-off, build twice = process spec not yet a recipe. Residue: which recipe applies. Keep that. Write down the rest.

Prohibitions decay. Procedures survive.

"Don't" is a criterion you cannot imagine the test for. "When X happens,
do Y" is one you can. It is the same rule as the done spec, applied to
the process spec. If you cannot imagine the procedure, it is not a rule.
That is why Build 4's report started with "Waived" and Build 3's did not.
Build 3 had a ban. Build 4 had a recipe.

This is also the answer to a question I get asked, which is: isn't the
rest just taste? When to roll back, when to hand off to a sub-agent,
when to build a thing twice and compare. I used to think so. It is
process spec that has not been written as a recipe yet. What is left
after you write the recipes is small: knowing which recipe applies.
Keep that. Write down the rest.

## 54:00 Where next (3 min, ~400 words)

[SLIDE: bg mind-the-gap.jpg | Where next? / The person who writes the three specs is the last one in the building.]
> Whole hour assumed a technical human writing 3 specs. Someone who knows what a uniqueness constraint is.
> Take the code out of the pipeline: that person is not removed. They're the only role left that matters.
> The interview, the criteria, the gates. That IS the job now. You just spent an hour learning it.
> The frontier is not code gen; code is close to solved. It's producing the 3 specs well.

Everything in this hour assumed a technical human writing the three
specs. Someone who knows what a uniqueness constraint is. Who reads
"speaker" and thinks about identity. Who can tell a vague criterion from
a sharp one.

Take the code out of the pipeline, and that person is not removed. They
are the only role left that matters. The interview with the client, the
criteria that become tests, the gates that decide what ships: that is
the job now, and you just spent an hour learning it. The frontier is not
better code generation. The code problem is close to solved. The
frontier is producing those three documents well, and quickly, for
clients who have never seen a spec.

[SLIDE: bg dark-factory.jpg | The dark factory. / Client in. Software out. Humans at the gates.]
> What I'm building now. Lights off because the MACHINES don't need them, not because nobody works there.
> Account manager agent interviews the client -> versioned spec (spec 1).
> Planner breaks it into issues. Coding agents in ephemeral containers, own worktree.
> Merge request. Deterministic tests are the gate (spec 2). Green merges. Red goes round again with the failure attached.
> Process spec (spec 3) is the factory floor: what runs, in what order, who can say yes.
> Somebody designed the line. Somebody decides what leaves the building.
> The floor runs without me. The specs and the gates do not.

This is what I am building now. Manufacturing calls it a dark factory.
The lights are off because the machines do not need them, not because
nobody works there. A client signs up and is interviewed by an account
manager agent, and the conversation becomes a versioned spec. That is
the first document. A planner breaks it into issues. Coding agents pick
them up in ephemeral containers, each on its own worktree, and hand back
a merge request. Deterministic tests are the gate. That is the second
document. Green merges on its own; red goes back round with the failure
attached. And the third document, the process spec, is the factory
floor itself: what runs, in what order, and who is allowed to say yes.

Somebody designed that line. Somebody decides what leaves the building.
The floor runs without me. The specs and the gates do not.

[SLIDE: quote, Warp Factories, 18 August 2026 - "Cloud agents manage work from triage through verification, while humans weigh in at key decision points." | logos warp.svg tessl.svg]
> Not a hobby. Last month 2 funded companies shipped this thesis. Both say the same thing about where the person goes.
> Warp Factories, 18 Aug: 5 stages, any automatable, 'humans weigh in at key decision points'. Their CEO: they automate ~30% of their own tasks.
> Tessl, Guy Podjarny: code-centric -> spec-centric. Agents are collaborators 'if we give them context and hold them accountable to clear requirements'.
> Where the person goes: to the specs and the gates. The specs are the hard part, and they are yours.

This is not one person's hobby. In the last month two funded companies
shipped this thesis. Warp Factories, on the eighteenth of August: five
stages, triage to verification, any of them automatable, and in their
own words, "humans weigh in at key decision points." Their CEO says they
automate about a third of their own work that way. Tessl, the same week,
from Guy Podjarny: development moves from code-centric to spec-centric,
and agents are powerful collaborators "if we give them context and hold
them accountable to clear requirements."

Both of them say the same thing about where the person goes. To the
specs, and to the gates. The specs are the hard part, and they are
yours.

## 57:00 Close (2 min, ~250 words)

[SLIDE: photo monday.jpg | Monday. One ticket. Write it three times. Attack it. Run it. Click the thing.]
> Monday. 1 ticket, not the hardest.
> Write it 3x: what should exist, what proves it, what the agent does when tests can't run.
> 2nd model: attack. Fix. Kick off. Lunch.
> Back: don't read the diff first. CLICK THE THING.

Monday. Take one ticket. Not the hardest one. Write it three times: what
should exist, what would prove it, and what the agent should do when the
test suite cannot run. Hand it to a second model and tell it to attack.
Fix what it finds. Kick it off. Go to lunch. When you come back, do not
read the diff first. Click the thing.

[SLIDE: seven lines | Thank you. / @bendechrai]
> Read the 7 lines. Slowly.
> Click 8: 'Thank you' on the right. Lines stay up.

The most dangerous requirements are the ones too obvious to state.

Write the constraint at the moment you notice yourself assuming.

If you cannot imagine the test, it is not a criterion.

Co-authoring makes a model agreeable. Attacking makes it useful.

Deterministic gates or nothing.

I never fixed the code. I fixed the request.

Prohibitions decay. Procedures survive.

Thank you.
