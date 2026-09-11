import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import seedJson from "@/seed.json";
import type { SeedData } from "@/lib/seed-data";
import { getScheduleView } from "@/lib/schedule-service";
import { scheduleTalk } from "@/lib/schedule-service";
import { createTestDb, seedTestDb, type TestDb } from "@/test/db-helpers";
import { ScheduleBoard } from "./schedule-board";

describe("ScheduleBoard (component render, seeded data)", () => {
  let testDb: TestDb;

  beforeEach(() => {
    testDb = createTestDb();
    seedTestDb(testDb.db, seedJson as SeedData);
    scheduleTalk(testDb.db, { talkId: "t1", slotId: "d1-1000", roomId: "main" });
    scheduleTalk(testDb.db, { talkId: "t3", slotId: "d1-1000", roomId: "b" });
  });

  afterEach(() => {
    testDb.cleanup();
  });

  it("lists every slot for each day in time order", () => {
    const view = getScheduleView(testDb.db);
    render(<ScheduleBoard initialSchedule={view} />);

    const day1 = screen.getByRole("heading", { name: "2026-09-10" });
    const day2 = screen.getByRole("heading", { name: "2026-09-11" });
    expect(day1.compareDocumentPosition(day2)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);

    const day1Slots = view.days.find((d) => d.day === "2026-09-10")?.slots ?? [];
    expect(day1Slots.map((s) => s.slotId)).toEqual(
      [...day1Slots].sort((a, b) => a.start.localeCompare(b.start)).map((s) => s.slotId),
    );

    let previous: Element | null = null;
    for (const slot of day1Slots) {
      const el = screen.getByTestId(`slot-${slot.slotId}`);
      if (previous) {
        expect(previous.compareDocumentPosition(el)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
      }
      previous = el;
    }
  });

  it("shows the room, talk title, and speaker names in a scheduled cell", () => {
    const view = getScheduleView(testDb.db);
    render(<ScheduleBoard initialSchedule={view} />);

    const cell = screen.getByTestId("cell-d1-1000-main");
    expect(within(cell).getByText("Main Hall")).toBeInTheDocument();
    expect(within(cell).getByText("The Spec Is the Hard Part")).toBeInTheDocument();
    expect(within(cell).getByText("Ben Dechrai")).toBeInTheDocument();
  });

  it("shows breaks as breaks", () => {
    const view = getScheduleView(testDb.db);
    render(<ScheduleBoard initialSchedule={view} />);

    const breakSlot = screen.getByTestId("slot-d1-1130");
    expect(within(breakSlot).getByText(/Break: Lunch/)).toBeInTheDocument();
  });

  it("lists unscheduled talks separately, excluding scheduled ones", () => {
    const view = getScheduleView(testDb.db);
    render(<ScheduleBoard initialSchedule={view} />);

    const unscheduledSection = screen.getByRole("region", { name: "Unscheduled talks" });
    expect(within(unscheduledSection).getByTestId("unscheduled-t2")).toBeInTheDocument();
    expect(within(unscheduledSection).queryByTestId("unscheduled-t1")).not.toBeInTheDocument();
    expect(within(unscheduledSection).queryByTestId("unscheduled-t3")).not.toBeInTheDocument();
  });
});
