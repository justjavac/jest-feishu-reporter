import { getOptions } from "./utils";

test("getOptions", () => {
  expect(getOptions({})).toHaveProperty("token");
  expect(getOptions({})).toHaveProperty("secret");
});
