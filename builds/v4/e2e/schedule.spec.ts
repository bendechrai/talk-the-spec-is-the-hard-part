import { expect, test } from "@playwright/test";

interface ScheduleApiResponse {
  rooms: { id: string; name: string }[];
  days: {
    date: string;
    slots: {
      id: string;
      start: string;
      end: string;
      kind: "session" | "break";
      placementsByRoom: Record<string, { id: string; title: string } | null>;
    }[];
  }[];
  unplacedTalks: { id: string; title: string }[];
}

test("schedule page lists unplaced talks and the grid on initial load", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Conference Scheduler" })).toBeVisible();
  await expect(page.getByTestId("unplaced-t1")).toBeVisible();
  await expect(page.getByText("2026-09-10")).toBeVisible();
  await expect(page.getByText("Lunch").first()).toBeVisible();
});

test("a rejected placement shows an error without a full reload and the schedule matches the database", async ({
  page,
}) => {
  await page.goto("/");

  // Mark this page instance so we can detect a full navigation/reload later.
  await page.evaluate(() => {
    (window as unknown as { __noReloadMarker: string }).__noReloadMarker = "still-here";
  });

  const t1Row = page.getByTestId("unplaced-t1");
  await t1Row.getByLabel("Room for The Spec Is the Hard Part").selectOption("main");
  await t1Row.getByLabel("Slot for The Spec Is the Hard Part").selectOption("d1-1000");
  await t1Row.getByRole("button", { name: "Place" }).click();

  await expect(page.getByTestId("cell-d1-1000-main")).toContainText("The Spec Is the Hard Part");
  await expect(page.getByTestId("unplaced-t1")).toHaveCount(0);

  const t2Row = page.getByTestId("unplaced-t2");
  await t2Row.getByLabel("Room for Ten Key Steps for Enhanced Web App Security").selectOption("b");
  await t2Row
    .getByLabel("Slot for Ten Key Steps for Enhanced Web App Security")
    .selectOption("d1-1000");
  await t2Row.getByRole("button", { name: "Place" }).click();

  const alert = page.getByRole("alert");
  await expect(alert).toBeVisible();
  await expect(alert).toContainText("Ben Dechrai");
  await expect(alert).toContainText("Ten Key Steps for Enhanced Web App Security");

  const markerStillPresent = await page.evaluate(
    () => (window as unknown as { __noReloadMarker?: string }).__noReloadMarker,
  );
  expect(markerStillPresent).toBe("still-here");

  // t2 must still be listed as unplaced: the rejected request was not persisted.
  await expect(page.getByTestId("unplaced-t2")).toBeVisible();

  const apiSchedule: ScheduleApiResponse = await page
    .request.get("/api/schedule")
    .then((res) => res.json());

  const unplacedIds = apiSchedule.unplacedTalks.map((t) => t.id);
  expect(unplacedIds).toContain("t2");
  expect(unplacedIds).not.toContain("t1");

  const day1 = apiSchedule.days.find((d) => d.date === "2026-09-10");
  const slot1000 = day1?.slots.find((s) => s.id === "d1-1000");
  expect(slot1000?.placementsByRoom.main?.title).toBe("The Spec Is the Hard Part");
  expect(slot1000?.placementsByRoom.b).toBeNull();

  // Rendered DOM must agree with what the API/database report.
  await expect(page.getByTestId("cell-d1-1000-b")).not.toContainText(
    "Ten Key Steps for Enhanced Web App Security",
  );
});
