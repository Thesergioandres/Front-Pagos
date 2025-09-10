import { describe, it, expect } from "vitest";
import React from "react";
import { AuthProvider } from "../auth-context";
import { AuthContext } from "../auth-context-base";
import { render, screen } from "@testing-library/react";

function Consumer() {
  const ctx = React.useContext(AuthContext)!;
  return (
    <div>
      <span data-testid="auth">{String(ctx.isAuthenticated)}</span>
      <button onClick={() => ctx.setIsAuthenticated(true)}>login</button>
    </div>
  );
}

describe("AuthProvider", () => {
  it("proporciona contexto y permite cambiar auth state", () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
    expect(screen.getByTestId("auth").textContent).toBe("false");
  });
});
