import { describe, expect, it } from "vitest";
import { validateScheduling, type ExistingPlacement, type RoomInfo, type SlotInfo, type TalkInfo } from "./scheduling-rules";

const mainHall: RoomInfo = { id: "main", name: "Main Hall", capacity: 300 };
const roomB: RoomInfo = { id: "b", name: "Room B", capacity: 80 };
const roomC: RoomInfo = { id: "c", name: "Room C", capacity: 40 };

const sessionSlot: SlotInfo = {
  id: "d1-1000",
  day: "2026-09-10",
  start: "10:00",
  end: "10:45",
  kind: "session",
  label: null,
};

const shortSlot: SlotInfo = {
  id: "d1-1100",
  day: "2026-09-10",
  start: "11:00",
  end: "11:45",
  kind: "session",
  label: null,
};

const lunchSlot: SlotInfo = {
  id: "d1-1130",
  day: "2026-09-10",
  start: "11:30",
  end: "12:30",
  kind: "break",
  label: "Lunch",
};

function talk(overrides: Partial<TalkInfo>): TalkInfo {
  return {
    id: "t1",
    title: "A Talk",
    speakerIds: ["speaker-1"],
    lengthMinutes: 45,
    track: "General",
    expectedAudience: 50,
    ...overrides,
  };
}

describe("validateScheduling", () => {
  it("rejects a talk longer than the slot, naming both lengths", () => {
    const t = talk({ id: "t1", title: "Long Talk", lengthMinutes: 60 });
    const result = validateScheduling({
      talk: t,
      slot: shortSlot, // 45 minutes
      room: mainHall,
      talksById: new Map([[t.id, t]]),
      existingPlacements: [],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("60");
      expect(result.error).toContain("45");
    }
  });

  it("rejects scheduling into a break slot", () => {
    const t = talk({ id: "t1", title: "Any Talk" });
    const result = validateScheduling({
      talk: t,
      slot: lunchSlot,
      room: mainHall,
      talksById: new Map([[t.id, t]]),
      existingPlacements: [],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.toLowerCase()).toContain("lunch");
    }
  });

  it("rejects a talk whose expected audience exceeds room capacity, naming room and both numbers", () => {
    const t = talk({ id: "t1", title: "Big Talk", expectedAudience: 250 });
    const result = validateScheduling({
      talk: t,
      slot: sessionSlot,
      room: roomC, // capacity 40
      talksById: new Map([[t.id, t]]),
      existingPlacements: [],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("Room C");
      expect(result.error).toContain("250");
      expect(result.error).toContain("40");
    }
  });

  it("rejects a second same-track talk scheduled into a slot that already has one", () => {
    const existingTalk = talk({
      id: "t-data-1",
      title: "Postgres Is Your Message Queue",
      track: "Data",
      speakerIds: ["priya"],
    });
    const newTalk = talk({
      id: "t-data-2",
      title: "Event Sourcing Without Regret",
      track: "Data",
      speakerIds: ["marcus"],
    });

    const existingPlacements: ExistingPlacement[] = [
      { talkId: existingTalk.id, slotId: sessionSlot.id, roomId: mainHall.id },
    ];

    const result = validateScheduling({
      talk: newTalk,
      slot: sessionSlot,
      room: roomB,
      talksById: new Map([
        [existingTalk.id, existingTalk],
        [newTalk.id, newTalk],
      ]),
      existingPlacements,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("Data");
    }
  });

  it("rejects double-booking a speaker in the same slot, naming both talks", () => {
    const t1 = talk({ id: "t1", title: "The Spec Is the Hard Part", speakerIds: ["ben"] });
    const t2 = talk({ id: "t2", title: "Ten Key Steps", speakerIds: ["ben"] });

    const existingPlacements: ExistingPlacement[] = [
      { talkId: t1.id, slotId: sessionSlot.id, roomId: mainHall.id },
    ];

    const result = validateScheduling({
      talk: t2,
      slot: sessionSlot,
      room: roomB,
      talksById: new Map([
        [t1.id, t1],
        [t2.id, t2],
      ]),
      existingPlacements,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain(t1.title);
      expect(result.error).toContain(t2.title);
    }
  });

  it("rejects a talk already scheduled elsewhere", () => {
    const t = talk({ id: "t1", title: "Repeat Talk" });
    const existingPlacements: ExistingPlacement[] = [
      { talkId: t.id, slotId: shortSlot.id, roomId: mainHall.id },
    ];

    const result = validateScheduling({
      talk: t,
      slot: sessionSlot,
      room: roomB,
      talksById: new Map([[t.id, t]]),
      existingPlacements,
    });

    expect(result.ok).toBe(false);
  });

  it("rejects scheduling into a room already occupied for that slot", () => {
    const existingTalk = talk({ id: "t1", title: "Existing Talk" });
    const newTalk = talk({ id: "t2", title: "New Talk", speakerIds: ["other-speaker"] });
    const existingPlacements: ExistingPlacement[] = [
      { talkId: existingTalk.id, slotId: sessionSlot.id, roomId: mainHall.id },
    ];

    const result = validateScheduling({
      talk: newTalk,
      slot: sessionSlot,
      room: mainHall,
      talksById: new Map([
        [existingTalk.id, existingTalk],
        [newTalk.id, newTalk],
      ]),
      existingPlacements,
    });

    expect(result.ok).toBe(false);
  });

  it("accepts a valid placement", () => {
    const t = talk({ id: "t1", title: "Fits Fine", lengthMinutes: 45, expectedAudience: 50 });
    const result = validateScheduling({
      talk: t,
      slot: sessionSlot,
      room: mainHall,
      talksById: new Map([[t.id, t]]),
      existingPlacements: [],
    });

    expect(result.ok).toBe(true);
  });
});
