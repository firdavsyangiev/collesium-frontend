import { getApiErrorMessage } from "./errors";

test("API error helper prefers the backend error envelope", () => {
  expect(getApiErrorMessage(
    { response: { data: { error: { message: "Backend validation failed" } } } },
    "Fallback",
  )).toBe("Backend validation failed");
});

test("API error helper returns a safe fallback", () => {
  expect(getApiErrorMessage(undefined, "Please try again")).toBe("Please try again");
});
