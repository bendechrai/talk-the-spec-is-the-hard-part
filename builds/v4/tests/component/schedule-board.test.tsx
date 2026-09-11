import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { ScheduleBoard } from "@/components/ScheduleBoard";
import { placeTalk } from "@/lib/scheduling";
import { getFullSchedule } from "@/lib/schedule-view";
import { createSeededTestDb } from "../helpers/db";

describe("ScheduleBoard rendering (seeded data)", () => {
  it("lists slots in time order, one column per room, with talk + speakers in cells, breaks spanning all rooms, and unplaced talks listed separately", () => {
    const { db } = createSeededTestDb();
    placeTalk(db, { talkId: "t1", roomId: "main", slotId: "d1-1000" });
    placeTalk(db, { talkId: "t4", roomId: "main", slotId: "d1-1500" });

    const schedule = getFullSchedule(db);
    render(<ScheduleBoard initialSchedule={schedule} />);

    const cell = screen.getByTestId("cell-d1-1000-main");
    expect(within(cell).getByText("The Spec Is the Hard Part")).toBeInTheDocument();
    expect(within(cell).getByText("Ben Dechrai")).toBeInTheDocument();

    const emptyCell = screen.getByTestId("cell-d1-1000-b");
    expect(within(emptyCell).queryByText("The Spec Is the Hard Part")).not.toBeInTheDocument();

    const multiSpeakerCell = screen.getByTestId("cell-d1-1500-main");
    expect(within(multiSpeakerCell).getByText("Event Sourcing Without Regret")).toBeInTheDocument();
    expect(within(multiSpeakerCell).getByText("Priya Natarajan, Marcus Lindqvist")).toBeInTheDocument();

    const dayHeading = screen.getByText("2026-09-10");
    const daySection = dayHeading.closest("section") as HTMLElement;
    const table = daySection.querySelector("table");
    expect(table).not.toBeNull();
    const rowTimes = within(table as HTMLTableElement)
      .getAllByRole("row")
      .slice(1)
      .map((row) => row.querySelector("td")?.textContent);
    expect(rowTimes).toEqual([
      "09:00-09:45",
      "10:00-10:45",
      "11:00-11:30",
      "11:30-12:30",
      "13:00-13:45",
      "14:00-14:45",
      "15:00-16:00",
    ]);

    const breakCell = within(daySection).getByText("Lunch");
    const breakRow = breakCell.closest("tr") as HTMLTableRowElement;
    expect(within(breakRow).getByText("Lunch")).toBe(breakCell);
    expect(breakCell.getAttribute("colspan")).toBe(String(schedule.rooms.length));

    const unplacedSection = screen.getByRole("region", { name: "Unplaced talks" });
    expect(within(unplacedSection).getByTestId("unplaced-t2")).toBeInTheDocument();
    expect(within(unplacedSection).getByTestId("unplaced-t3")).toBeInTheDocument();
    expect(within(unplacedSection).queryByTestId("unplaced-t1")).not.toBeInTheDocument();
    expect(within(unplacedSection).queryByTestId("unplaced-t4")).not.toBeInTheDocument();
  });
});
