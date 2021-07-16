import { getOptions } from "./utils";

test("getOptions", () => {
  expect(getOptions({})).toEqual({ token: undefined, secret: undefined });
});
