import { describe, it, expect, beforeEach } from "vitest";
import { getUserRole } from "../getUserRole";

function makeJwt(payload: any) {
  const base64 = (obj: any) => btoa(JSON.stringify(obj));
  return ["h", base64(payload), "s"].join(".");
}

describe("getUserRole", () => {
  beforeEach(() => localStorage.clear());

  it("retorna null sin tokens", () => {
    expect(getUserRole()).toBeNull();
  });

  it("lee rol de cognito:groups del id token", () => {
    const token = makeJwt({ "cognito:groups": ["GERENTE"] });
    localStorage.setItem("cognito_id_token", token);
    expect(getUserRole()).toBe("GERENTE");
  });

  it("retorna null si no hay grupos", () => {
    const token = makeJwt({});
    localStorage.setItem("cognito_id_token", token);
    expect(getUserRole()).toBeNull();
  });
});
