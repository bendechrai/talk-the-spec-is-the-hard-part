import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getDb } from "@/db/client";
import { getScheduleView, scheduleTalk } from "@/lib/schedule-service";
import { minimalSeed, seedTestDb, createTestDbForEnv, type EnvTestDb } from "@/test/db-helpers";
import { ScheduleBoard } from "@/components/schedule-board";
import { DELETE, GET, POST } from "./api/schedule/route";

function wireFetchToRouteHandlers() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = typeof input === "string" || input instanceof URL ? input : input.url;
      const request = new Request(new URL(url, "http://localhost"), init);
      if (request.method === "GET") return GET();
      if (request.method === "POST") return POST(request);
      if (request.method === "DELETE") return DELETE(request);
      throw new Error(`Unhandled method ${request.method}`);
    }),
  );
}

describe("Schedule page (integration: route + render)", () => {
  let env: EnvTestDb;

  beforeEach(() => {
    env = createTestDbForEnv();
    seedTestDb(getDb(), minimalSeed);
    wireFetchToRouteHandlers();
  });

  afterEach(() => {
    env.cleanup();
    vi.unstubAllGlobals();
  });

  it("shows a rejection error without a full reload, and the schedule stays in sync with the database", async () => {
    scheduleTalk(getDb(), { talkId: "t1", slotId: "d1-1000", roomId: "main" });
    const initialSchedule = getScheduleView(getDb());

    const user = userEvent.setup();
    render(<ScheduleBoard initialSchedule={initialSchedule} />);

    const cell = screen.getByTestId("cell-d1-1000-b");
    const select = cell.querySelector("select") as HTMLSelectElement;
    await user.selectOptions(select, "t2");
    const submitButton = cell.querySelector("button[type=submit]") as HTMLButtonElement;
    await user.click(submitButton);

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("The Spec Is the Hard Part");
    expect(alert.textContent).toContain("Ten Key Steps");

    await waitFor(() => {
      const dbView = getScheduleView(getDb());
      expect(dbView.unscheduledTalks.map((t) => t.id).sort()).toEqual(["t2", "t3"]);
    });

    const dbView = getScheduleView(getDb());
    const mainCell = screen.getByTestId("cell-d1-1000-main");
    expect(mainCell.textContent).toContain("The Spec Is the Hard Part");
    expect(dbView.days.flatMap((d) => d.slots).flatMap((s) => s.cells).filter((c) => c.placement)).toHaveLength(1);
  });
});
