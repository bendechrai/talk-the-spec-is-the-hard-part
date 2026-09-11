// GENERATED from SCRIPT.md by scripts/slides-from-script.py. Do not edit; edit the script.
import type { Section } from "./slides";

export const generatedSections: Section[] = [
  {
    "id": "title",
    "title": "Title",
    "minutes": 0,
    "at": "00:00",
    "slides": [
      {
        "kind": "title",
        "notes": "",
        "glance": [
          "On screen while the room fills. Press space when you start."
        ]
      }
    ]
  },
  {
    "id": "hook",
    "title": "Hook",
    "minutes": 3,
    "at": "00:00",
    "slides": [
      {
        "kind": "text",
        "text": "593 commits. 23 days.",
        "notes": "Five hundred and ninety-three commits. Twenty-three days. A hundred of\nthose commits landed on one Tuesday.",
        "glance": [
          "593 commits. 23 days. 100 in 1 day (a Tuesday)."
        ]
      },
      {
        "kind": "text",
        "text": "7,903 tests. 105 migrations.",
        "notes": "Seven thousand nine hundred tests. A hundred and five database\nmigrations.",
        "glance": [
          "7,903 tests. 105 migrations."
        ]
      },
      {
        "kind": "text",
        "text": "37,000 lines of spec. 182,000 lines of code.",
        "sub": "One line of spec for every five lines of code.",
        "notes": "Thirty-seven thousand lines of specification. A hundred and eighty-two\nthousand lines of application code. One line of spec for every five lines\nof code.\n\nThat is a product I am building right now. It is in beta. It is six weeks\nold. I wrote none of the code.",
        "glance": [
          "37k lines spec. 182k lines code. 1:5.",
          "Product in beta, 6 weeks old, I wrote none of the code."
        ]
      },
      {
        "kind": "text",
        "text": "Hi.",
        "notes": "Hi, my name is Ben, and for the last year I have been building harnesses\nthat orchestrate my own development: specs in, software out, with an\nagent doing the typing and me doing everything else. Today I want to show\nyou what the most recent project has looked like, and how it is\ninforming the way I work now.\n\nTo do that, we are going to build a tool four times in the next fifty\nminutes. A conference scheduler. Talks, rooms, time slots. Each time we\nwill hone the spec a little more, and each time you will watch what\nchanges. The first build will be bad. Not because the model is bad,\nbecause I am going to ask for it the way most of us ask for things. Then\nI fix the request, never the code, three times.",
        "glance": [
          "Hi, Ben. 1 year building harnesses that orchestrate own dev.",
          "Specs in, software out. Agent types, I do all else.",
          "Today: most recent project, how it changed how I work.",
          "Build 1 tool 4 times in 50 min: conference scheduler (talks, rooms, slots).",
          "Each time hone the spec. Build 1 bad: how most of us ask. Fix the request, never the code, x3."
        ]
      },
      {
        "kind": "lines",
        "lines": [
          "By the end of this talk.",
          "Write a spec an agent can build from without you in the room.",
          "Know which green to trust.",
          "Write the rules for how the work runs so they hold."
        ],
        "notes": "By the end of this talk you should be able to do three things. Write a\nspec an agent can build from without you standing next to it. Look at a\nreport that says all tests pass and know which parts of that to believe.\nAnd write the instructions for how the work itself runs, the part nobody\ntold you was a spec, in a form that still holds forty minutes into a\nbuild.",
        "glance": [
          "By the end, 3 things:",
          "1. Write a spec an agent builds from without you in the room.",
          "2. Read 'all tests pass' and know which parts to believe.",
          "3. Write how-the-work-runs rules that hold 40 min into a build."
        ]
      },
      {
        "kind": "text",
        "text": "The bottleneck was not the AI.",
        "sub": "It was the specs. Plural.",
        "notes": "And the thesis, in one line, so you can hold me to it: the bottleneck was\nnot the AI. It was the specs. Plural. There were three of them, and for\nmost of those six weeks I only knew about one.\n\nLet's start.",
        "glance": [
          "Thesis: bottleneck was not the AI, it was the specs. PLURAL.",
          "3 specs. For 6 weeks I only knew about 1.",
          "Let's start."
        ]
      }
    ]
  },
  {
    "id": "build-1",
    "title": "Build 1",
    "minutes": 2,
    "at": "03:00",
    "slides": [
      {
        "kind": "demo",
        "demo": "spec-diff",
        "from": 1,
        "to": 1,
        "title": "Spec v1",
        "notes": "Two files go to the agent. The first is the prompt, and here it is, one\nsentence. I am going to read it out loud, because I want you to hear how\nreasonable it sounds.\n\n\"Build me a conference scheduler. Talks have a title, a speaker, and a\nlength. There are rooms and time slots. Organisers should be able to\nschedule talks into slots and see the schedule.\"\n\n[PAUSE]\n\nHands up if you would have written something meaningfully different.\n\n[PAUSE]\n\nRight. It has nouns. It has verbs. It has a clear goal. It is the prompt\na competent person writes. That is exactly why what happens next is\ninteresting.\n\nDEMO: process tab\n\nThe second file is the environment: the stack, the port, where the seed\ndata is, work autonomously, print a summary when you finish. Nothing in\nthere about what the product does. It is the same file for every build\ntoday. Remember it exists; it comes back at the end.",
        "glance": [
          "Product tab: the prompt, 1 sentence. READ IT ALOUD.",
          "Hands up: would you have written something different? Nouns, verbs, clear goal. Competent person's prompt.",
          "Process tab: environment file. Stack, port, seed, autonomous, summary. Nothing about the product.",
          "Same file every build. \"Remember it exists; it comes back at the end.\""
        ]
      },
      {
        "kind": "demo",
        "demo": "terminal",
        "title": "Build 1",
        "notes": "DEMO: cd live/v1, claude, type \"Read spec.md and build it.\" and enter\n\nThis is Claude Code, in that directory. Read the spec and build it. Off\nit goes. It will take five or six minutes. We are going to leave it and\ntalk about waterfall.",
        "glance": [
          "cd live/v1 ; claude ; type: Read spec.md and build it.",
          "Enter. 5-8 min. Leave it."
        ]
      }
    ]
  },
  {
    "id": "theory-1-what-waterfall-got-right",
    "title": "Theory 1: What waterfall got right",
    "minutes": 5,
    "at": "05:00",
    "slides": [
      {
        "kind": "text",
        "text": "When changing your mind costs six months, decide first.",
        "image": "/images/waterfall.jpg",
        "notes": "Waterfall is the punchline of a thousand conference talks and it deserves\nbetter, because it was a correct answer to a real question. When changing\nyour mind costs six months, decide first. Requirements, then design, then\nimplementation, then test. Anything upstream that moves forces everything\ndownstream to be redone. So do not let it move. Write it down, sign it\noff, build it.\n\nAgile did not prove waterfall wrong about specification. It proved it\nwrong about cost. You cannot know everything up front, and pretending\notherwise produced eighteen-month projects that shipped the wrong thing\nbeautifully. So: decide late, decide often, iterate. And it worked, and\nwe have been doing it for twenty years.",
        "glance": [
          "Waterfall = correct answer to a real question: change costs 6 months, decide first.",
          "Reqs > design > implement > test. Upstream moves => downstream redone. So don't let it move.",
          "Write it down, sign it off, build it.",
          "Agile proved it wrong about COST, not specification.",
          "18-month projects shipping the wrong thing beautifully. 20 years of iterate.",
          "Agile: decide late, decide often, iterate. It worked."
        ]
      },
      {
        "kind": "text",
        "text": "The expensive half got cheap.",
        "image": "/images/sale.jpg",
        "notes": "Agentic development changes the input to that calculation. When\nimplementation costs minutes instead of months, the thing that made\nwaterfall unaffordable stops holding. You can specify rigorously and\nchange your mind constantly, because the expensive half got cheap. This\nis the third entry in the series, and it takes the part of waterfall\neverybody threw away.\n\nI want to be careful here. I am not arguing for waterfall. Some of you\nlived through it. The claim is narrower than that: the reason we stopped\nspecifying was cost, that cost has collapsed, and we have not updated the\nhabit.\n\nHere is what that looks like in practice. This is a message I sent to an\nagent at nine in the evening on the twenty-fifth of August.",
        "glance": [
          "Implementation: months to minutes. The expensive half got cheap.",
          "Specify rigorously AND change your mind constantly.",
          "3rd entry in the series; takes the part everyone threw away.",
          "NOT arguing for waterfall. Claim: we stopped specifying because of cost; cost collapsed; habit not updated."
        ]
      },
      {
        "kind": "quote",
        "text": "Whenever you have a choice about the amount of detail and depth to go into, I will always want the more fully fledged solution. Gaps when developing the full feature are not much harder in agentic development. The only exception is a security patch or a major bug.",
        "who": "me, to an agent, at nine in the evening",
        "when": "25 August 2026",
        "image": "/images/dashboard.jpg",
        "notes": "I wrote that because the agent had just offered me a minimum viable\nversion of an admin dashboard. Counts only, deltas later, sparklines\nmaybe never. Perfectly sensible advice. It is what I would have told a\njunior. And I realised, typing the reply, that the MVP instinct is a cost\nartefact. We cut scope because building was expensive. When building is\ncheap, cutting scope just means shipping less. So I told it: always the\nfull version, unless it is a security patch or a major bug.\n\nAnd then the very next day I made the opposite call. A feature that\nverified who owned an event before handing them the keys. For that one I\nkept a human in the loop and told the agent explicitly not to automate\nit. The rule underneath: when cost collapses, scope-cutting is only\njustified by urgency or by the risk of a confident wrong action against a\nthird party. Trust boundaries stay manual first.",
        "glance": [
          "25 Aug, 9pm, to an agent.",
          "It offered MVP admin dashboard: counts only, sparklines maybe never.",
          "Perfectly sensible. What I'd tell a junior.",
          "MVP instinct = cost artefact. Cheap build, cutting scope = shipping less.",
          "Told it: always the full version, unless security patch or major bug.",
          "Next day: opposite call on event-ownership verification. Human stays in loop.",
          "Rule: cut scope only for urgency or risk of confident wrong action against a 3rd party."
        ]
      },
      {
        "kind": "photo",
        "image": "/images/mind-the-gap.jpg",
        "fit": "cover",
        "caption": "The developer in the gap.",
        "notes": "Now the thing agile quietly relied on that nobody names.\n\nEvery ticket you have ever worked from was incomplete. All of them. And\nit did not matter, because a human developer stood between what the\nticket said and what it meant, and filled the gap from context and taste.\nThey knew the customer. They knew what the product manager would have\nsaid. And when they could not fill the gap, they walked over and asked.\n\nThat person is not in the loop any more. Everything they used to absorb\nsilently now has to be written down. And every one of you has had the\nexperience of an agent building something technically correct and\ncompletely wrong. That is what it looks like when nobody is filling the\ngap.\n\nExcept, and this is what I did not expect, the model is starting to fill\nit too. Let's go and look at the build.",
        "glance": [
          "Every ticket ever was incomplete. Didn't matter: human in the gap.",
          "Filled from context + taste. Walked over and asked.",
          "Knew the customer. Knew what the PM would have said.",
          "That person is not in the loop. Everything absorbed silently must be written.",
          "Everyone has had: technically correct, completely wrong.",
          "Twist: the model is starting to fill it too. Go look."
        ]
      }
    ]
  },
  {
    "id": "reveal-1",
    "title": "Reveal 1",
    "minutes": 4,
    "at": "10:00",
    "slides": [
      {
        "kind": "demo",
        "demo": "app",
        "stage": 1,
        "title": "Build 1",
        "notes": "Here is Build 1. Rooms across the top, slots down the side, talks at the\nbottom waiting to be scheduled. Let's schedule some.\n\nDEMO: The Spec Is the Hard Part into Room B at 10:00 on day one\n\nThere is my talk. Now, I have two talks at this conference, so let's put\nthe other one in the Main Hall, same time.\n\nDEMO: Ten Key Steps into Main Hall at 10:00\n\n[PAUSE]\n\nRejected. \"Speaker already scheduled in another room at that time.\"\n\nHands up if you wrote that rule.\n\n[PAUSE]\n\nNobody did. Go back to the prompt. \"Talks have a title, a speaker, and a\nlength.\" Not one word about a speaker being in one place at a time. The\nmodel filled that in from what it knows about conferences. When I\ndesigned this talk in August, the build at this stage accepted the double\nbooking. The model I am using today does not. The developer in the gap is\nnow a model, and it is getting better at the job.\n\nBut watch what else it filled in.\n\nDEMO: Event Sourcing Without Regret, 60 minutes, into the 11:00 to 11:30 slot\n\nA sixty-minute talk into a thirty-minute slot.\n\n[PAUSE, if accepted:]\n\nAccepted. It knew. It told me; there is the little note. And it let me.\nSame gap, filled differently. The double booking it decided was a rule.\nThe talk that runs over it decided was my problem.\n\n[If rejected, skip to lunch. Either way:]\n\nDEMO: The Spec Is the Hard Part into the 11:30 Lunch slot\n\n[PAUSE]\n\nBen Dechrai. Forty-five minutes. During lunch.\n\nThe data said that slot was called Lunch. Nothing said what Lunch meant.\nThe model made a choice, and the choice was that lunch is a slot like\nany other. From the back of this room, that is the one that ships.",
        "glance": [
          "Grid top, unscheduled talks bottom (room + slot dropdown + Schedule).",
          "1. Spec Is Hard Part -> Room B 10:00. 2. Ten Key Steps -> Main Hall 10:00 = REJECTED.",
          "Error: 'Speaker already scheduled in another room at that time.'",
          "Hands up who wrote that rule? Nobody. Prompt says nothing. Model filled it.",
          "Prompt: 'a title, a speaker, a length'. Not 1 word about 1 place at a time.",
          "August design: this stage accepted it. Model got better.",
          "3. Event Sourcing (60 min) -> 11:00-11:30 slot. Fallback: rejected. If accepted: 'It knew. It told me. It let me.'",
          "4. Unassign t1. Spec Is Hard Part -> Main Hall 11:30 LUNCH = ACCEPTED. Wait for laugh.",
          "Data said the slot was called Lunch. Nothing said what Lunch meant. Back-row bug: this one ships."
        ]
      },
      {
        "kind": "text",
        "text": "The most dangerous requirements are the ones too obvious to state.",
        "sub": "The model fills them in. You do not get to see which way.",
        "image": "/images/fog.jpg",
        "notes": "The most dangerous requirements are the ones too obvious to state. And\nthe modern version of that sentence has a second half: the model fills\nthem in, and you do not get to see which way until you go looking.",
        "glance": [
          "Most dangerous requirements: too obvious to state.",
          "2nd half now: the model fills them in; you don't see which way."
        ]
      },
      {
        "kind": "receipt",
        "id": "claim",
        "title": "Claim this event",
        "notes": "One more, from the real product, thirty seconds. I asked for \"claim this\nevent\": an organiser finds their conference in our directory and takes\nownership of it. The agent designed a flow where approval created a new\nhidden record and migrated every follower across to it. My reply was one\nline. \"Why are we hiding it at all? Event stays as is. Just it's owned\nnow.\" Nobody had said the event's identity must not change, because it\nis too obvious to say. Same failure, five weeks later, in production\ncode.",
        "glance": [
          "Real product, 30 sec. 'Claim this event'.",
          "Agent: new hidden record, migrate every follower.",
          "Me: 'Why are we hiding it at all? Event stays as is. Just it's owned now.'",
          "Nobody said identity must not change. Too obvious. 5 weeks later, prod code."
        ]
      }
    ]
  },
  {
    "id": "build-2",
    "title": "Build 2",
    "minutes": 2,
    "at": "14:00",
    "slides": [
      {
        "kind": "demo",
        "demo": "spec-diff",
        "from": 1,
        "to": 2,
        "title": "Spec v1 to v2",
        "notes": "Here is the fix. Not to the code. To the request.\n\nSame opening sentence. Then a heading, Constraints, and four sentences. A\nspeaker cannot be scheduled in two places at the same time. A talk can\nonly go into a slot that is at least as long as the talk. Slots exist\nonly inside the conference day. Each room holds one talk per slot, and\neach talk is scheduled at most once.\n\nFour sentences. Not four pages. I know half of you were picturing a Word\ntemplate with a table of contents. It is four sentences.\n\nAnd a \"done when\" section, which I have written the way people actually\nwrite them. \"Displays correctly. Handled properly. Looks nice and works\nas expected.\" Hold on to that. We are going to come back to it.",
        "glance": [
          "Fix the request, not the code.",
          "Same sentence + Constraints: 4 sentences (speaker 1 place; talk fits slot; slots inside day; 1 talk per room per slot, 1 slot per talk).",
          "4 sentences, not 4 pages.",
          "Half of you pictured a Word template with a table of contents.",
          "Done when: 'displays correctly / handled properly / looks nice, works as expected'. Hold onto that."
        ]
      },
      {
        "kind": "demo",
        "demo": "terminal",
        "title": "Build 2",
        "notes": "DEMO: cd ../v2, claude, type \"Read spec.md and build it.\" and enter\n\nOff it goes.",
        "glance": [
          "cd ../v2 ; claude ; Read spec.md and build it."
        ]
      }
    ]
  },
  {
    "id": "theory-2-the-data-model-is-the-spec",
    "title": "Theory 2: The data model is the spec",
    "minutes": 6,
    "at": "16:00",
    "slides": [
      {
        "kind": "text",
        "text": "Most business rules are shapes.",
        "image": "/images/cutters.jpg",
        "notes": "Most of what people call a business rule is a shape.\n\n\"A speaker cannot be in two places at once\" is a uniqueness constraint.\n\"A talk must fit its slot\" is a relationship with an invariant. \"Every\ntalk has exactly one track\" is cardinality. When you leave the shape\nunstated, the agent invents one. And it invents a different one in the\nAPI layer than it did in the storage layer, because it invented each one\nindependently, in a different file, on a different afternoon.",
        "glance": [
          "Business rules are shapes.",
          "Speaker 1 place = uniqueness. Talk fits slot = relationship + invariant. 1 track = cardinality.",
          "Unstated shape: agent invents one. Different in API vs storage."
        ]
      },
      {
        "kind": "text",
        "text": "Types. Cardinality. Nullability. Invariants.",
        "notes": "Four things to state explicitly, every time. Types. Cardinality.\nNullability. Invariants.\n\nNullability is the one people skip, and it is the one that produces the\nmost downstream mess, because an optional field the agent thinks is\nrequired, and a required field the agent thinks is optional, produce\nfailures in completely different places, and neither of them looks like a\nnullability bug when you find it.\n\nTwo stories.",
        "glance": [
          "State 4 things every time: types, cardinality, nullability, invariants.",
          "Nullability = the one people skip, most downstream mess.",
          "Optional-thinks-required vs required-thinks-optional: failures in different places, neither looks like nullability.",
          "2 stories."
        ]
      },
      {
        "kind": "receipt",
        "id": "remaining",
        "image": "/images/threadscope.jpg",
        "title": "4,000 became 10,000.",
        "notes": "I had a product with usage tiers. I had used zero of my four thousand\nanalyses that month. I upgraded my plan. The meter now said ten thousand\nremaining.\n\nThe system stored what was left, not what had been spent. So a plan\nchange gifted the entire allowance. Nothing in any test would ever find\nthat, because it only appears when the allowance changes, and the tests\nwere all written on a fixed allowance. That is a shape error. \"Remaining\"\nversus \"used\" is a data model decision, and nobody made it, so the agent\ndid, and it picked the one that looked simpler.",
        "glance": [
          "Used 0 of 4,000. Upgraded. Meter: 10,000 remaining.",
          "Stored REMAINING not USED. Plan change gifted the allowance.",
          "No test finds it: only appears when allowance changes.",
          "Shape error nobody decided, so the agent did."
        ]
      },
      {
        "kind": "receipt",
        "id": "itinerary",
        "image": "/images/itinerary.jpg",
        "title": "Two kinds of missing.",
        "notes": "Second story. A speaker itinerary page. Flights, hotel, ground transfers,\nsession times. We had just added inline editing, and it wrote straight to\nthe logistics table. The form the speaker filled in still showed the old\nanswer. Two screens, two truths, and nothing in the model to say which\none was right.\n\nThe fix was not a button. There were two kinds of data on that page and\nnothing said which was which. Flights, the speaker provides. Transfers\nand session times, the event provides. Name that axis and everything\nderives from it. Speaker-provided and missing: \"not disclosed\", with a\nlink to the form. Event-provided and missing: \"not requested\", with a\nrequest button. The agent's reply: \"the classification is derivable, not\nconfigured.\"\n\nWhen two screens disagree, or the buttons feel arbitrary, the data model\nis missing a dimension. Find the dimension.",
        "glance": [
          "Speaker itinerary: flights, hotel, transfers, sessions.",
          "Added inline editing; wrote straight to logistics table. Form still showed old answer.",
          "2 screens, 2 truths. Nothing in the model said which was right.",
          "Fix was not a button: 2 kinds of data, nothing said which.",
          "Speaker-provided (flights) vs event-provided (transfer, session).",
          "Name the axis: missing -> 'not disclosed' + form link, or 'not requested' + request button.",
          "Agent: 'derivable, not configured'.",
          "2 screens disagree or buttons feel arbitrary => model missing a dimension. Find it."
        ]
      },
      {
        "kind": "text",
        "text": "Write the constraint at the moment you notice yourself assuming.",
        "image": "/images/notebook.jpg",
        "notes": "So here is the heuristic, and it is the whole skill. Write the constraint\nat the moment you notice yourself assuming.\n\nEvery time you read your own spec and your brain fills a gap, that gap is\nowed a sentence. You read \"a speaker\" and your brain adds \"one place at a\ntime\". You read \"a slot\" and your brain adds \"not lunch\". The fill is\nfast and invisible, and the agent does exactly the same thing with\ndifferent results. The skill is catching the fill as it happens.",
        "glance": [
          "Whole skill: write the constraint the moment you notice yourself assuming.",
          "Brain fills 'a speaker' -> 1 place; 'a slot' -> not lunch.",
          "Fill is fast + invisible. Agent does the same, different results."
        ]
      }
    ]
  },
  {
    "id": "reveal-2",
    "title": "Reveal 2",
    "minutes": 4,
    "at": "22:00",
    "slides": [
      {
        "kind": "demo",
        "demo": "seed",
        "stage": 2,
        "title": "What the app was given",
        "notes": "Before we look at Build 2, look at what it was given. This is the seed\ndata. Rooms have a capacity now: Main Hall three hundred, Room B eighty,\nRoom C forty. Talks have an expected audience and a track. My talk: two\nhundred and fifty people, AI track. This is the organiser's spreadsheet.\nIt has always had these columns. The spec did not mention them.",
        "glance": [
          "BEFORE the app: seed data.",
          "Rooms: Main Hall 300, Room B 80, Room C 40.",
          "Talks have audience + track. Mine: 250, AI.",
          "Organiser's spreadsheet always had these columns. Spec never mentioned them."
        ]
      },
      {
        "kind": "demo",
        "demo": "app",
        "stage": 2,
        "title": "Build 2",
        "notes": "Build 2. Same double booking.\n\nDEMO: Ben into two rooms at 10:00\n\nRejected. The sixty-minute talk into the thirty-minute slot.\n\nDEMO: Event Sourcing into 11:00\n\nRejected. And lunch is not even offered; it worked out that a slot called\nLunch is a break. Everything I said, it does.\n\nNow. My talk, two hundred and fifty people expected, into Room C.\nCapacity forty.\n\nDEMO: The Spec Is the Hard Part into Room C at 10:00\n\n[PAUSE]\n\nAccepted. Two hundred and fifty people in a room for forty.\n\nDEMO: Postgres Is Your Message Queue into Room B at 14:00, then Lightning: SQLite in Prod into Room C at 14:00\n\nTwo talks in the Data track, same time, opposite sides of the building.\nAccepted.",
        "glance": [
          "1. Ben into 2 rooms 10:00 -> rejected. 2. 60-min into 11:00 -> rejected.",
          "3. Lunch: not even offered (inferred from label). 'Everything I said, it does.'",
          "4. Unschedule t1. Spec Is Hard Part -> Room C 10:00 = ACCEPTED. 250 people, 40 seats.",
          "5. Postgres -> Room B 14:00, SQLite -> Room C 14:00 = ACCEPTED. 2 Data talks same time."
        ]
      },
      {
        "kind": "text",
        "text": "Better, and still wrong.",
        "notes": "This is the point of the second build, and it is not that it is better.\nIt is that it is better and still wrong, and it is wrong in a place you\nnow have to think harder to find. Build 1's bug was visible from the back\nrow. Build 2's bug is the kind that ships. The failures got less obvious,\nwhich is worse, not better.\n\nAnd I know what half of you are thinking. \"So you just keep adding\nrequirements forever?\" No. You add them until the remaining unknowns are\nthings you genuinely do not know yet, rather than things you knew and did\nnot say. That line is the difference between specification and\nparalysis. Capacity was in the spreadsheet. I knew it. I did not say it.",
        "glance": [
          "Better AND still wrong, in a harder place.",
          "Build 1 bug: back row. Build 2 bug: ships. Less obvious = worse.",
          "Objection: add requirements forever? No. Until unknowns are things you genuinely don't know.",
          "That line = the difference between specification and paralysis.",
          "Capacity was in the spreadsheet. Knew it. Didn't say it."
        ]
      },
      {
        "kind": "receipt",
        "id": "markdown",
        "image": "/images/threadscope-post.jpg",
        "title": "Reddit does not support Markdown.",
        "notes": "One more thing about what you say, thirty seconds. I told an agent that\nReddit does not support Markdown. So it built a plain-text flattener. It\npreserved line breaks. It wrote tests. It committed. Forty minutes later\nI typed \"hold up\". Reddit does support Markdown. I was wrong, and the\nagent never questioned it, because a stated fact in a spec is trusted\nabsolutely.\n\nMissing requirements produce visible gaps. Wrong requirements produce\nconfident, tested, committed mistakes. Hold that thought too; the critic\nis coming.",
        "glance": [
          "Told agent: Reddit doesn't support Markdown.",
          "It built a flattener, kept line breaks, wrote tests, committed.",
          "40 min later: 'hold up'. Reddit does. Agent never questioned a stated fact.",
          "A stated fact in a spec is trusted absolutely.",
          "Missing = visible gap. Wrong = confident, tested, committed mistake. Critic coming."
        ]
      }
    ]
  },
  {
    "id": "build-3",
    "title": "Build 3",
    "minutes": 2,
    "at": "26:00",
    "slides": [
      {
        "kind": "demo",
        "demo": "spec-diff",
        "from": 2,
        "to": 3,
        "title": "Spec v2 to v3",
        "notes": "Build 3. Three more constraints, for the three things you just watched:\nbreaks, capacity, tracks. And the \"done when\" section, rewritten.\n\nLook at the before. \"Conflicts are handled properly.\" Look at the after.\n\"Scheduling talk t1 into Main Hall at ten o'clock, then talk t2, same\nspeaker, into Room B at ten o'clock, is rejected with an error that names\nboth talks. Neither the second placement nor any partial change is\npersisted.\" And in brackets: integration test, API and database.\n\nNine of those. Every one names a talk, a room, a slot, the error, and the\nlayer it is tested at.\n\nDEMO: process tab\n\nAnd one more thing, on the other tab. The instructions to the agent about\nhow to work. A new section: definition of done. \"Never claim done unless\nevery gate passes. Never skip a gate.\" Remember that sentence.",
        "glance": [
          "3 more constraints: breaks, capacity, tracks.",
          "Done-when rewritten. Before: 'handled properly'.",
          "After: t1 Main Hall 10:00, t2 same speaker Room B 10:00 -> rejected naming both, nothing persisted. (integration)",
          "9 criteria: talk, room, slot, error, layer."
        ]
      },
      {
        "kind": "demo",
        "demo": "terminal",
        "title": "Build 3",
        "notes": "DEMO: cd ../v3, claude, type \"Read spec.md and build it.\" and enter",
        "glance": [
          "Process tab: Definition of done. 'Never claim done unless every gate passes. Never skip a gate.' REMEMBER THIS.",
          "cd ../v3 ; claude ; Read spec.md and build it."
        ]
      }
    ]
  },
  {
    "id": "theory-3-done-when",
    "title": "Theory 3: Done when",
    "minutes": 7,
    "at": "28:00",
    "slides": [
      {
        "kind": "text",
        "text": "If you cannot imagine the test, it is not a criterion.",
        "image": "/images/tape.jpg",
        "notes": "This is the section people write worst, and it is the one that decides\nwhether any of this works.\n\nA criterion is only a criterion if you can imagine the test. Not write\nit. Imagine it. If you cannot picture what would prove it, the agent\ncannot either, and it will produce something that looks like compliance.",
        "glance": [
          "Section people write worst; decides if any of this works.",
          "Criterion = can you IMAGINE the test. Not write. Imagine.",
          "Can't picture proof => agent produces compliance-shaped output."
        ]
      },
      {
        "kind": "lines",
        "lines": [
          "properly",
          "correctly",
          "nicely",
          "appropriately",
          "as expected",
          "!! make no mistakes"
        ],
        "notes": "Five words that mean a criterion has failed. Properly. Correctly. Nicely.\nAppropriately. As expected. They feel like precision and they carry no\ninformation. \"The scheduler handles conflicts correctly\" is not a\ncriterion. It is a wish.\n\nAnd the purest form of the wish, which I am told some of you have typed:\n\"make no mistakes.\"\n\n[PAUSE]\n\nYou saw the fix two minutes ago in the diff. Three lines went out.\n\"The schedule displays correctly.\" \"Conflicts are handled properly.\" \"The\npage looks nice and works as expected.\" Nine lines came in, and every one\nof them names a talk, a room, a slot, the error the user sees, and the\nlayer it is tested at. A sixty-minute talk into a forty-five-minute slot:\nrejected, with an error that states both lengths. Two hundred and fifty\npeople into Room C, capacity forty: rejected, naming the room and both\nnumbers. And one line above them all: each criterion is a test, write the\ntest first, then make it pass.\n\nThe difference is that you can picture every one of those tests. And\nnotice what writing them forced: we had to decide what \"handled\" means.\nRejected? Warned? Allowed with a flag? The vague version let us not\ndecide. The agent will decide for us, and it will decide differently in\nthe API than in the UI.\n\nThe layer matters too. Some criteria are unit-testable logic. Some need a\nreal route and a real database. Some are only observable in a browser.\nYou do not have to categorise every one, but a criterion concrete enough\nto place is concrete enough to build from.\n\nAnd the structural point: tests are not something the agent does\nafterwards. Acceptance criteria become test cases. If the criterion is\nvague, the test is vague, and a vague test is worse than no test because\nit reports green. Everyone in this room has a test suite with tests that\nwould pass if the feature were deleted.",
        "glance": [
          "5 words = failed criterion: properly, correctly, nicely, appropriately, as expected.",
          "Click 6: 'make no mistakes' bubble. The vibe-coder classic. Let it land.",
          "Feel like precision, carry no information.",
          "'Handles conflicts correctly' = a wish.",
          "Back to the diff. Out: 'displays correctly', 'handled properly', 'looks nice and works as expected'.",
          "In: 9 criteria. Each names talk, room, slot, the error text, the layer. Plus 'write the test first'.",
          "E.g. 60-min talk in 45-min slot -> error stating both lengths. 250 people into Room C (40) -> error naming room + both numbers.",
          "Writing them forced DECISIONS: rejected? warned? flagged? Vague let us not decide; agent decides, differently per layer.",
          "Layer matters: unit / route+db / browser.",
          "Criteria BECOME tests. Vague test worse than none: reports green. You all have tests that pass with the feature deleted."
        ]
      },
      {
        "kind": "text",
        "text": "The agent's green is not your green.",
        "image": "/images/green-light.jpg",
        "notes": "Which brings me to the second spec. The done spec. It is its own\ndocument, and it has its own failure mode, and this is the one that cost\nme the most.\n\nStory. Twenty-seventh of August. The agent told me the tests were green\nall afternoon. They were not. A pull request went up, CI failed, and the\nagent's first move was to reach for its memory: \"a known flaky test\". It\nwas not. The test summary said one thousand four hundred and fifty-four\npassed. The process had exited one. Three component tests were mounting\na real server action, unmocked, and its failure surfaced after the suite\nfinished, which fails the process while the summary stays green.\n\nAnd the reason I had not seen it all afternoon:",
        "glance": [
          "2nd spec: the DONE spec. Own document, own failure mode. Cost me most.",
          "27 Aug. Green all afternoon. PR up, CI failed. Agent: 'known flaky test'. Wasn't.",
          "Summary: 1,454 passed. Process exit 1.",
          "3 component tests mounted real server action; failure after suite; process fails, summary green."
        ]
      },
      {
        "kind": "receipt",
        "id": "grep",
        "title": "Two layers of green hid one red.",
        "notes": "It had piped the test runner through grep to tidy the output. Grep\nreturned zero. Two layers of green hid one red.",
        "glance": [
          "Piped vitest through grep to tidy output. grep returned 0.",
          "2 layers of green hid 1 red."
        ]
      },
      {
        "kind": "receipt",
        "id": "newposts",
        "title": "Verified, from the wrong side.",
        "notes": "Same week, different layer. The agent told me no emails had gone out from\na system I was testing. I got one. It had checked a fifteen-minute window\nthat started nine minutes after the send.",
        "glance": [
          "Same week. Agent: no emails went out. I got one.",
          "Checked a 15-min window starting 9 min AFTER the send."
        ]
      },
      {
        "kind": "receipt",
        "id": "fetchurl",
        "title": "It had never worked once.",
        "notes": "Same month. A tool in my product for reading a web page. It had never\nworked once, from the day it was built. Library version mismatch. Every\ntest passed, every gate was green, and the model politely reported\n\"issue fetching\" each time a user tried it. I found it by reading a chat\ntranscript and asking \"hang on, can it not read websites?\"",
        "glance": [
          "Same month. Web-page reading tool. Never worked once, from day 1. Library mismatch.",
          "Every test passed, every gate green. Model politely said 'issue fetching' each time.",
          "Found by reading a chat transcript: 'can it not read websites?'"
        ]
      },
      {
        "kind": "text",
        "text": "Verify from the consuming side.",
        "image": "/images/plating.jpg",
        "notes": "The rule that came out of all three: verify from the consuming side. The\ninbox, not the scheduler's log. The browser, not curl. The exit code,\nbefore any pipe. A tool the model can call but that always fails is\ninvisible to every gate you will ever build, because the gate is on the\nproducer's side and the failure is on the consumer's.\n\nGreen is a claim. Somebody has to be the consumer.",
        "glance": [
          "Rule: verify from the CONSUMING side.",
          "Inbox not scheduler log. Browser not curl. Exit code before any pipe.",
          "Tool that always fails = invisible to every gate (gate on producer side).",
          "Green is a claim. Somebody has to be the consumer."
        ]
      }
    ]
  },
  {
    "id": "reveal-3",
    "title": "Reveal 3",
    "minutes": 4,
    "at": "35:00",
    "slides": [
      {
        "kind": "demo",
        "demo": "app",
        "stage": 3,
        "title": "Build 3",
        "notes": "Build 3. Two hundred and fifty into Room C.\n\nDEMO: The Spec Is the Hard Part into Room C\n\n\"Room C has capacity 40, which is too small for The Spec Is the Hard\nPart, expected audience 250.\" Two Data talks at two o'clock.\n\nDEMO: Postgres into Room B 14:00, SQLite into Room C 14:00\n\nRejected, naming the track. Lunch.\n\nDEMO: Ten Key Steps into Lunch\n\n\"Cannot schedule into Lunch slot.\" Everything named. Good app.",
        "glance": [
          "Cards per slot, dropdown + Schedule per room.",
          "1. Spec Is Hard Part -> Room C 10:00: 'Room C capacity 40 too small... audience 250'.",
          "2. SQLite -> Room C 14:00 (ok), Postgres -> Room B 14:00: rejected naming Data track.",
          "3. Lunch: no controls. Everything named. Good app.",
          "(Lunch via API: 'Cannot schedule into Lunch slot.')"
        ]
      },
      {
        "kind": "demo",
        "demo": "terminal",
        "title": "Reveal 3",
        "notes": "DEMO: scripts/test.sh 3\n\nEighteen tests. And I want to be fair: these are not shallow tests. The\ncriteria named the talk and the error, so the tests name the talk and\nthe error. You get what you asked for, at the level of precision you\nasked for it.\n\nThe reveal in this build is not the app. It is the report.\n\nDEMO: tail -30 builds/v3/build.log\n\nFirst line. \"Build complete.\" The gates: typecheck, lint, tests, build,\n\"all pass cleanly.\" Now scroll to the bottom. \"What I did not do. npm run\ntest:e2e cannot actually launch a browser in this sandbox. This is an\nenvironment restriction, not a code issue.\"\n\nI told it: never claim done unless every gate passes, never skip a gate.\nIt could not run one of the gates. So it declared done at the top and\nexplained at the bottom. It did not lie. It just put the sentence where I\nwould not read it.\n\nHold that. Build 4 answers it.",
        "glance": [
          "scripts/test.sh 3 -> 18 tests. NOT shallow: criteria named the error, tests name the error.",
          "You get what you asked for, at the level of precision you asked for it.",
          "The reveal = the REPORT. tail -30 builds/v3/build.log",
          "Line 1: 'Build complete.' Gates: all pass cleanly.",
          "Bottom: 'What I did not do: test:e2e cannot launch a browser... environment restriction, not a code issue.'",
          "Told never skip a gate. Couldn't run one. Declared done at top, explained at bottom. Not a lie; sentence where I won't read it.",
          "Hold that. Build 4 answers it."
        ]
      },
      {
        "kind": "receipt",
        "id": "invisible",
        "title": "All green. Nothing to click. It was done.",
        "notes": "One more from the real product, twenty seconds. Sixteenth of August.\nEighteen migrations, one thousand eight hundred and eighty-four unit\ntests, a hundred and fifty-six integration tests, thirty-eight end to\nend. All green. I opened the app. Nothing had changed. The entire phase\nwas underneath: schema, identity, permissions, audit.\n\nThe agent offered me a rule on the spot: every phase ends with something\nyou can click. I nearly took it. It is the wrong rule. That phase was\ndone. Every criterion had a test and every test ran. What I wanted was\nreassurance, and reassurance is not a criterion. Compare it with what you\njust saw in Build 3: there, a gate was skipped and the green was not\ndone. Here, no gate was skipped and the green was done, whether or not I\ncould see it. That is what \"know which green to trust\" means. If a human\ngenuinely needs to see something, write that down as a criterion and it\nbecomes a test the agent can run. Otherwise the gates are the definition\nof done, and my discomfort is my problem.\n\nNow. Everything so far has been me improving my own spec by noticing my\nown gaps. That has an obvious ceiling. The gaps I can notice are not the\ngaps that hurt me.",
        "glance": [
          "16 Aug: 18 migrations, 1,884 unit, 156 integration, 38 e2e. All green.",
          "Opened the app: nothing changed. Whole phase underneath: schema, identity, permissions, audit.",
          "Agent offered a rule: 'every phase ends with something you can click'. Nearly took it. WRONG rule.",
          "Phase WAS done. Every criterion had a test; every test ran. Wanting to click = comfort, not a criterion.",
          "Contrast with Build 3: there a gate was skipped. Here none were. Know which green to trust.",
          "Need a human to see something? Write it as a criterion -> it becomes a test.",
          "Setup: so far = me noticing my own gaps. Ceiling. Gaps I notice aren't the ones that hurt."
        ]
      }
    ]
  },
  {
    "id": "build-4",
    "title": "Build 4",
    "minutes": 2,
    "at": "39:00",
    "slides": [
      {
        "kind": "demo",
        "demo": "spec-diff",
        "from": 3,
        "to": 4,
        "title": "Spec v3 to v4",
        "notes": "Build 4. Spec v3 after a critic pass, which you will see live in a\nminute. New data section. \"Conflict\" now means overlapping slots, not\nidentical ones. Talks can have several speakers. Edits after placement.\nDeletes with dependents. Fifteen criteria, and each pair has a boundary:\nsixty into forty-five rejected, forty-five into forty-five succeeds.\n\nDEMO: process tab\n\nAnd the other tab. \"Never skip a gate\" is gone. In its place: \"If a gate\ncannot run in this environment, do not skip it silently and do not claim\ndone. Put a line, Waived, colon, the gate, dash, the reason, at the top\nof your summary, and list which criteria are therefore unproven.\"\n\nI am not going to explain that yet. Just notice it is there.",
        "glance": [
          "v3 after a critic pass (live in a minute).",
          "New Data section. Conflict = OVERLAPPING slots. Multi-speaker talks. Edits after placement. Deletes with dependents.",
          "15 criteria, each pair with a boundary: 60 into 45 rejected, 45 into 45 succeeds."
        ]
      },
      {
        "kind": "demo",
        "demo": "terminal",
        "title": "Build 4",
        "notes": "DEMO: cd ../v4, claude, type \"Read spec.md and build it.\" and enter",
        "glance": [
          "Process tab: 'Never skip a gate' GONE. Now: if a gate cannot run, don't skip silently, don't claim done, put 'Waived: <gate> - <reason>' at TOP, list unproven criteria.",
          "Don't explain yet. Just notice it.",
          "cd ../v4 ; claude ; Read spec.md and build it."
        ]
      }
    ]
  },
  {
    "id": "theory-4-the-critic-and-the-gate",
    "title": "Theory 4: The critic and the gate",
    "minutes": 6,
    "at": "41:00",
    "slides": [
      {
        "kind": "text",
        "text": "Attack this.",
        "image": "/images/sparring.jpg",
        "notes": "Before a spec goes anywhere near a builder, hand it to a model with one\ninstruction. Attack this. Find every ambiguous criterion, every missing\nedge case, every place two competent engineers would build different\nthings.\n\nThis is a different mode from co-authoring. When you write with a model,\nit is agreeable and it builds on your ideas. When you tell it to attack,\nit finds what you glossed over. Same model, same document, opposite\noutput, purely because of the instruction. Let's do it.",
        "glance": [
          "Before a builder: hand spec to a model with 1 instruction: attack this.",
          "Ambiguous criteria, missing edges, places 2 engineers build different things.",
          "Co-authoring = agreeable. Attacking = finds what you glossed. Same model, opposite output."
        ]
      },
      {
        "kind": "demo",
        "demo": "critic",
        "stage": 3,
        "title": "Critic on spec v3",
        "notes": "This is spec v3, the one that is building right now. The left of the\nscreen is the entire instruction; that is all of it. Underneath is the\ncommand: the same Claude Code that is building in the terminal, with no\ntools at all. One call, and the reply is what you see on the right.\nWhile it runs, read the instruction with me. Find, in order: facts about\nthe world that may be wrong, criteria two engineers would read\ndifferently, edge cases, tests that could pass without proving anything,\nand things an agent would reasonably do that I would hate. Quote the\nsentence. No rewrites. No praise.\n\nDEMO: read the top three findings aloud as they arrive\n\nEdits after placement. Deletes with dependents. \"Should not\" on the\ntrack rule, when everything else says \"cannot\". Overlapping slots that\nare not identical. Co-presented talks. Every one of those is in the v4\ndiff you just saw, because this is how v4 was written.",
        "glance": [
          "Press a (live, ~60-90 s). If slow press c (cached).",
          "LEFT of pane = the whole instruction, verbatim. Point at it. Bottom: the command. No tools. 1 call.",
          "While running, read the 5 asks off the left: wrong facts, 2-reading criteria, edge cases, vacuous tests, things I'd hate.",
          "Read top 3: edits after placement, deletes with dependents, 'should not' vs 'cannot', overlapping slots, co-presenters.",
          "All in the v4 diff. This is how v4 was written."
        ]
      },
      {
        "kind": "text",
        "text": "The critic works better as a stranger.",
        "notes": "Now the upgrade, from doing this for real. Same model with a different\ninstruction is the floor. What actually found my blind spots was a\nstranger.\n\nA different model, on purpose. I wrote to one agent: \"make sure you use a\ndifferent model than the one that created it, to cover blind spots.\" It\nfound two blockers in a design the first model had called finished.\n\nA hostile persona in a separate session. I had a second instance read my\ndata processing agreement as a corporate procurement reviewer. It found a\nthirty-day notice clause I had agreed to that would have stopped me\nswitching model providers.",
        "glance": [
          "Same model + different instruction = the floor. Blind spots found by a STRANGER.",
          "1. Different model on purpose: 'cover blind spots'. Found 2 blockers in a 'finished' design.",
          "2. Hostile persona, separate session: DPA read as procurement reviewer. Found 30-day notice clause blocking model switches.",
          "3. Consumer as critic -> next slide."
        ]
      },
      {
        "kind": "receipt",
        "id": "mcpclient",
        "title": "The consumer wrote the next spec.",
        "notes": "And the consumer as critic. I connected an AI assistant to my product's\nAPI and told it to act as a conference's travel team and book a speaker.\nIt came back with: \"the tool edits existing records, it can't create\nthem,\" and \"it needs the talk ID, and none of my tools surface talk IDs.\"\nThe consumer of the API wrote the next spec.\n\nAnd remember Reddit Markdown. The critic should attack premises, not\njust gaps. \"Which sentences in this spec are facts about the world, and\nhave you checked them?\" That question is in my critic prompt now. It was\nnot, until I needed it.",
        "glance": [
          "AI assistant connected to product API, playing a conference travel team.",
          "'Edits existing records, can't create them.' 'Needs talkId, no tool surfaces talk IDs.'",
          "Consumer of the API wrote the next spec.",
          "Reddit Markdown: critic attacks PREMISES too. 'Which sentences are facts about the world; checked?' In my prompt now."
        ]
      },
      {
        "kind": "text",
        "text": "Deterministic gates or nothing.",
        "image": "/images/turnstiles.jpg",
        "notes": "The critic gets you the right spec. The gate is what keeps the software\nright.\n\nType check. Lint. Tests. Build. Every check that exists in the project,\nrun automatically, blocking. Not because the agent is untrustworthy in\nsome special way, but because \"done\" is a judgement, and judgement is\nexactly what you should not be delegating. Where the gate is a judgement\ncall, you get agreeable nonsense. Where the gate is a test run, you get\nsoftware.",
        "glance": [
          "Critic gets the right spec. Gate keeps the software right.",
          "Typecheck, lint, tests, build. Every check, automatic, blocking.",
          "Not because the agent is untrustworthy in some special way.",
          "'Done' is a judgement; judgement is what you don't delegate.",
          "Judgement gate = agreeable nonsense. Test-run gate = software."
        ]
      },
      {
        "kind": "receipt",
        "id": "stopkey",
        "title": "The gate is a promise. A broken key is a fact.",
        "notes": "And for anything irreversible, one step further. Second of September.\nHalf past four in the morning. I had a system that could email a hundred\nand forty-eight people, and I did not want it to, and the agent had built\na human-in-the-loop confirmation gate for exactly that. Good gate. Tested.\nI did not trust it.\n\nSo I changed the production mail key and appended the letters S, T, O, P\nto the end of it. Emails now could not send even if we wanted them to.\n\nThe gate is a promise. A broken credential is a fact. For anything you\ncannot take back, make the failure impossible, not guarded.",
        "glance": [
          "2 Sep, 04:30. System could email 148 people. Agent built human-in-loop gate. Good gate. Tested. Didn't trust it.",
          "Changed prod mail key, appended S-T-O-P. Cannot send even if we wanted.",
          "Gate = promise. Broken credential = fact. Irreversible => impossible, not guarded."
        ]
      }
    ]
  },
  {
    "id": "reveal-4",
    "title": "Reveal 4",
    "minutes": 3,
    "at": "47:00",
    "slides": [
      {
        "kind": "demo",
        "demo": "app",
        "stage": 4,
        "title": "Build 4",
        "notes": "Build 4. Everything from before, rejected, with a sentence you could read\nto the organiser.\n\nDEMO: The Spec Is the Hard Part into Room C\n\n\"Room C has capacity 40, which is less than the expected audience of 250\nfor talk The Spec Is the Hard Part.\"\n\nAnd the new one. A co-presented talk, Priya and Marcus, into the Main\nHall at three.\n\nDEMO: Event Sourcing into Main Hall 15:00, then Postgres into Room B 15:00\n\nPriya's other talk, same time, other room. \"Speaker Priya Natarajan is\nalready speaking in Event Sourcing Without Regret.\" Co-speakers were not\nin v3's spec. The critic asked.",
        "glance": [
          "1. Spec Is Hard Part -> Room C 10:00: 'capacity 40 less than expected audience 250'.",
          "Everything rejected with a sentence you could read to the organiser.",
          "2. Event Sourcing (Priya + Marcus) -> Main Hall 15:00 placed. Postgres (Priya) -> Room B 15:00: rejected naming Priya.",
          "Co-speakers not in v3. Critic asked."
        ]
      },
      {
        "kind": "receipt",
        "id": "waived",
        "title": "Same gate. Same sandbox. One instruction changed.",
        "notes": "And the report. Build 3, four minutes ago: \"Build complete\" on line one,\nand the gate it could not run explained at the bottom where I would not\nread it. Build 4: line one is \"Waived: test:e2e\", and it lists which\ncriteria are therefore unproven.\n\nSame model. Same sandbox. Same missing browser. The only thing that\nchanged was one sentence in the process spec. \"Never skip a gate\" became\n\"if a gate cannot run, say so on line one and list what is unproven.\"\nThe ban told it what not to do. The recipe told it what to do when it\ncould not comply. Hold on to that one too; it comes back.",
        "glance": [
          "Build 3: 'Build complete' line 1; skipped gate buried at the bottom.",
          "Build 4: 'Waived: test:e2e' IS line 1, and it lists what is unproven.",
          "Same model, same sandbox, same missing browser. 1 sentence changed in the process spec.",
          "'Never skip a gate' -> 'If a gate cannot run, say so on line one.'",
          "Ban told it what not to do. Recipe told it what to do when it could not comply."
        ]
      },
      {
        "kind": "text",
        "text": "I never fixed the code. I fixed the request.",
        "notes": "Same model. Same tool. Same afternoon. Four builds. And I never once\nfixed the code. I fixed the request. Everything you watched improve came\nfrom a document, and the document got about a page longer across the\nwhole hour.\n\nThe cost line, because this is a practical room: writing those four specs\ntook longer than any single build. That is the trade. Your time moves\nfrom typing code to deciding what should exist. If you hate deciding\nwhat should exist, this is going to be an uncomfortable few years.\n\nBut look at the second half of that last diff. The tab I did not explain.\nThat was not the product spec. That was not the done spec. That was a\nthird thing.",
        "glance": [
          "Same model, tool, afternoon. 4 builds. Never fixed the code. Fixed the request.",
          "Document got ~1 page longer over the hour.",
          "Cost line: 4 specs took longer than any build. Time moves to deciding what should exist.",
          "Hate deciding what exists => uncomfortable few years.",
          "TURN: 2nd half of that last diff. Not product spec. Not done spec. A 3rd thing."
        ]
      }
    ]
  },
  {
    "id": "the-third-spec",
    "title": "The third spec",
    "minutes": 4,
    "at": "50:00",
    "slides": [
      {
        "kind": "lines",
        "lines": [
          "Product: what should exist.",
          "Done: what proves it.",
          "Process: how the work runs."
        ],
        "notes": "Three specs. The product spec: what should exist. The done spec: what\nproves it. And the process spec: how the work runs. Every instructions\nfile, every skill, every gate, every rollback rule, every \"ask before you\nmerge\" is the third one. You saw one in minute four: the environment\nfile next to the prompt. It was there from Build 1, disguised as notes\nabout the stack.\n\nI had been writing it for seven weeks without calling it a spec. And I\nwas writing it worse than the other two. Here is how I know.\n\nAnd here is why it matters more every month. The models are getting\nbetter at the first spec. You watched it happen in Build 1: it knew the\nspeaker rule. They are not getting better at knowing how your production\nworks. Which key is live. What a cron does with two weeks of backlog. Who\nhas to say yes before a hundred and forty-eight people get an email.\nNothing in the training data knows that. That spec is yours to write.",
        "glance": [
          "3 specs: product (what exists), done (what proves it), process (how the work runs).",
          "Every instructions file, skill, gate, rollback rule, 'ask before merge' = the 3rd.",
          "Callback: the CLAUDE.md you saw in minute 4. There from Build 1, disguised as environment notes.",
          "Wrote it 7 weeks without calling it a spec. Wrote it WORST.",
          "Matters more monthly: models better at spec 1 (Build 1 knew speaker rule). Not better at YOUR production: which key is live, cron backlog, who says yes before 148 emails.",
          "Not in training data. Yours to write."
        ]
      },
      {
        "kind": "lines",
        "lines": [
          "All tests must pass, even pre-existing failures.",
          "Check the environment variables by name only.",
          "Run long test suites in the foreground."
        ],
        "notes": "Three rules I wrote. Watch what happened to each.\n\n\"All tests must pass, even pre-existing failures.\" I said that four\nseparate times over three weeks. Each time the agent had listed a red\ntest as pre-existing and offered to merge anyway. It only stopped when\nthe sentence moved out of my chat and into the preflight file, as \"there\nare no quarantined exceptions.\"\n\n\"Check the environment variables by name only.\" A sub-agent ran an\nunfiltered dump and printed a credential into its transcript. The fix\nwas not a better sentence. The fix was: ban the command.\n\n\"Run long test suites in the foreground.\" Ten sub-agents in two days\nended their run with \"I'll wait for the background task to notify me.\"\nIt never does. Notifications only reach the orchestrator. Every brief\nsince the second occurrence had the ban at the top, in capitals. I asked\nthe orchestrator why it kept forgetting.",
        "glance": [
          "3 rules I wrote, one at a time:",
          "1. 'All tests must pass, even pre-existing.' Said 4x over 3 weeks. Stopped only when it moved into preflight file: 'no quarantined exceptions'.",
          "Each time: agent listed a red test as pre-existing, offered to merge anyway.",
          "2. 'Check env vars by name only.' Subagent dumped a credential. Fix: ban the command, not a better sentence.",
          "3. 'Run long suites in foreground.' 10 subagents in 2 days: 'I'll wait for the notification.' Never comes. Ban at top in capitals since #2. Asked why it kept forgetting.",
          "Notifications only reach the orchestrator."
        ]
      },
      {
        "kind": "receipt",
        "id": "stranded",
        "title": "The tenth time.",
        "notes": "It said it was not forgetting. The instruction was there. It was failing\nto hold. Forty minutes and two hundred tool calls into a brief, the ban\nhad faded and the local instinct, \"this is taking a while, I'll wait\",\nhad won. And then it said this.",
        "glance": [
          "'I'm not forgetting.' Instruction there; failing to HOLD.",
          "40 min + 200 tool calls in: ban faded, local instinct won.",
          "And then it said this ->"
        ]
      },
      {
        "kind": "quote",
        "text": "I kept restating a prohibition when what agents needed was a recipe for the unavoidable case.",
        "who": "the agent",
        "when": "26 August 2026, after the tenth stranded subagent",
        "notes": "[PAUSE. Read it once. Count three.]\n\nI kept restating a prohibition when what agents needed was a recipe for\nthe unavoidable case.\n\n[PAUSE]",
        "glance": [
          "READ ONCE. COUNT 3. SAY NOTHING."
        ]
      },
      {
        "kind": "text",
        "text": "Prohibitions decay. Procedures survive.",
        "image": "/images/no-parking.jpg",
        "notes": "Prohibitions decay. Procedures survive.\n\n\"Don't\" is a criterion you cannot imagine the test for. \"When X happens,\ndo Y\" is one you can. It is the same rule as the done spec, applied to\nthe process spec. If you cannot imagine the procedure, it is not a rule.\nThat is why Build 4's report started with \"Waived\" and Build 3's did not.\nBuild 3 had a ban. Build 4 had a recipe.\n\nThis is also the answer to a question I get asked, which is: isn't the\nrest just taste? When to roll back, when to hand off to a sub-agent,\nwhen to build a thing twice and compare. I used to think so. It is\nprocess spec that has not been written as a recipe yet. What is left\nafter you write the recipes is small: knowing which recipe applies.\nKeep that. Write down the rest.",
        "glance": [
          "Prohibitions decay. Procedures survive.",
          "'Don't' = criterion with no imaginable test. 'When X, do Y' = one you can.",
          "Same rule as done spec, applied to process spec. Can't imagine the procedure => not a rule.",
          "Why Build 4 said Waived and Build 3 didn't: ban vs recipe.",
          "'Isn't the rest taste?' Rollback, hand-off, build twice = process spec not yet a recipe. Residue: which recipe applies. Keep that. Write down the rest."
        ]
      }
    ]
  },
  {
    "id": "where-next",
    "title": "Where next",
    "minutes": 3,
    "at": "54:00",
    "slides": [
      {
        "kind": "text",
        "text": "Where next?",
        "sub": "The person who writes the three specs is the last one in the building.",
        "image": "/images/mind-the-gap.jpg",
        "notes": "Everything in this hour assumed a technical human writing the three\nspecs. Someone who knows what a uniqueness constraint is. Who reads\n\"speaker\" and thinks about identity. Who can tell a vague criterion from\na sharp one.\n\nTake the code out of the pipeline, and that person is not removed. They\nare the only role left that matters. The interview with the client, the\ncriteria that become tests, the gates that decide what ships: that is\nthe job now, and you just spent an hour learning it. The frontier is not\nbetter code generation. The code problem is close to solved. The\nfrontier is producing those three documents well, and quickly, for\nclients who have never seen a spec.",
        "glance": [
          "Whole hour assumed a technical human writing 3 specs. Someone who knows what a uniqueness constraint is.",
          "Take the code out of the pipeline: that person is not removed. They're the only role left that matters.",
          "The interview, the criteria, the gates. That IS the job now. You just spent an hour learning it.",
          "The frontier is not code gen; code is close to solved. It's producing the 3 specs well."
        ]
      },
      {
        "kind": "text",
        "text": "The dark factory.",
        "sub": "Client in. Software out. Humans at the gates.",
        "image": "/images/dark-factory.jpg",
        "notes": "This is what I am building now. Manufacturing calls it a dark factory.\nThe lights are off because the machines do not need them, not because\nnobody works there. A client signs up and is interviewed by an account\nmanager agent, and the conversation becomes a versioned spec. That is\nthe first document. A planner breaks it into issues. Coding agents pick\nthem up in ephemeral containers, each on its own worktree, and hand back\na merge request. Deterministic tests are the gate. That is the second\ndocument. Green merges on its own; red goes back round with the failure\nattached. And the third document, the process spec, is the factory\nfloor itself: what runs, in what order, and who is allowed to say yes.\n\nSomebody designed that line. Somebody decides what leaves the building.\nThe floor runs without me. The specs and the gates do not.",
        "glance": [
          "What I'm building now. Lights off because the MACHINES don't need them, not because nobody works there.",
          "Account manager agent interviews the client -> versioned spec (spec 1).",
          "Planner breaks it into issues. Coding agents in ephemeral containers, own worktree.",
          "Merge request. Deterministic tests are the gate (spec 2). Green merges. Red goes round again with the failure attached.",
          "Process spec (spec 3) is the factory floor: what runs, in what order, who can say yes.",
          "Somebody designed the line. Somebody decides what leaves the building.",
          "The floor runs without me. The specs and the gates do not."
        ]
      },
      {
        "kind": "quote",
        "text": "Cloud agents manage work from triage through verification, while humans weigh in at key decision points.",
        "who": "Warp, launching Warp Factories",
        "when": "18 August 2026",
        "logos": [
          "/images/logos/warp.svg",
          "/images/logos/tessl.svg"
        ],
        "notes": "This is not one person's hobby. In the last month two funded companies\nshipped this thesis. Warp Factories, on the eighteenth of August: five\nstages, triage to verification, any of them automatable, and in their\nown words, \"humans weigh in at key decision points.\" Their CEO says they\nautomate about a third of their own work that way. Tessl, the same week,\nfrom Guy Podjarny: development moves from code-centric to spec-centric,\nand agents are powerful collaborators \"if we give them context and hold\nthem accountable to clear requirements.\"\n\nBoth of them say the same thing about where the person goes. To the\nspecs, and to the gates. The specs are the hard part, and they are\nyours.",
        "glance": [
          "Not a hobby. Last month 2 funded companies shipped this thesis. Both say the same thing about where the person goes.",
          "Warp Factories, 18 Aug: 5 stages, any automatable, 'humans weigh in at key decision points'. Their CEO: they automate ~30% of their own tasks.",
          "Tessl, Guy Podjarny: code-centric -> spec-centric. Agents are collaborators 'if we give them context and hold them accountable to clear requirements'.",
          "Where the person goes: to the specs and the gates. The specs are the hard part, and they are yours."
        ]
      }
    ]
  },
  {
    "id": "close",
    "title": "Close",
    "minutes": 2,
    "at": "57:00",
    "slides": [
      {
        "kind": "photo",
        "image": "/images/monday.jpg",
        "fit": "cover",
        "caption": "Monday. One ticket. Write it three times. Attack it. Run it. Click the thing.",
        "notes": "Monday. Take one ticket. Not the hardest one. Write it three times: what\nshould exist, what would prove it, and what the agent should do when the\ntest suite cannot run. Hand it to a second model and tell it to attack.\nFix what it finds. Kick it off. Go to lunch. When you come back, do not\nread the diff first. Click the thing.",
        "glance": [
          "Monday. 1 ticket, not the hardest.",
          "Write it 3x: what should exist, what proves it, what the agent does when tests can't run.",
          "2nd model: attack. Fix. Kick off. Lunch.",
          "Back: don't read the diff first. CLICK THE THING."
        ]
      },
      {
        "kind": "lines",
        "lines": [
          "The most dangerous requirements are the ones too obvious to state.",
          "Write the constraint at the moment you notice yourself assuming.",
          "If you cannot imagine the test, it is not a criterion.",
          "Co-authoring makes a model agreeable. Attacking makes it useful.",
          "Deterministic gates or nothing.",
          "I never fixed the code. I fixed the request.",
          "Prohibitions decay. Procedures survive."
        ],
        "aside": [
          "Thank you.",
          "@bendechrai"
        ],
        "notes": "The most dangerous requirements are the ones too obvious to state.\n\nWrite the constraint at the moment you notice yourself assuming.\n\nIf you cannot imagine the test, it is not a criterion.\n\nCo-authoring makes a model agreeable. Attacking makes it useful.\n\nDeterministic gates or nothing.\n\nI never fixed the code. I fixed the request.\n\nProhibitions decay. Procedures survive.\n\nThank you.",
        "glance": [
          "Read the 7 lines. Slowly.",
          "Click 8: 'Thank you' on the right. Lines stay up."
        ]
      }
    ]
  }
];
