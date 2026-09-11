import { test, expect } from "@playwright/test";

test("organiser can schedule and unschedule a talk", async ({ page }) => {
  await page.goto("/");

  const cell = page.getByTestId("cell-d2-1400-c");
  await cell.locator("select").selectOption("t10");
  await cell.locator("button[type=submit]").click();

  await expect(cell.getByText("Lightning: SQLite in Prod")).toBeVisible();
  await expect(cell.getByText("Dele Okafor")).toBeVisible();
  await expect(page.getByTestId("unscheduled-t10")).not.toBeVisible();

  await cell.getByRole("button", { name: "Unschedule" }).click();

  await expect(cell.getByText("Lightning: SQLite in Prod")).not.toBeVisible();
  await expect(page.getByTestId("unscheduled-t10")).toBeVisible();
});

test("rejected scheduling attempt shows an error without a full reload", async ({ page }) => {
  await page.goto("/");

  const firstCell = page.getByTestId("cell-d2-0900-main");
  await firstCell.locator("select").selectOption("t1");
  await firstCell.locator("button[type=submit]").click();
  await expect(firstCell.getByText("The Spec Is the Hard Part")).toBeVisible();

  const markerAttribute = "data-e2e-marker";
  await page.evaluate((attr) => document.documentElement.setAttribute(attr, "still-here"), markerAttribute);

  const secondCell = page.getByTestId("cell-d2-0900-b");
  await secondCell.locator("select").selectOption("t2");
  await secondCell.locator("button[type=submit]").click();

  const alert = page.getByRole("alert");
  await expect(alert).toBeVisible();
  await expect(alert).toContainText("The Spec Is the Hard Part");
  await expect(alert).toContainText("Ten Key Steps for Enhanced Web App Security");

  await expect(page.locator(`html[${markerAttribute}="still-here"]`)).toHaveCount(1);

  await expect(secondCell.getByText("Ten Key Steps for Enhanced Web App Security")).not.toBeVisible();
});
