import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useApi } from "../useApi";

describe("useApi", () => {
  it("ejecuta fetcher, setea data y loading", async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true });
    const { result } = renderHook(() => useApi(fetcher));
    expect(result.current.loading).toBe(false);
    await act(async () => {
      await result.current.execute();
    });
    expect(fetcher).toHaveBeenCalled();
    expect(result.current.data).toEqual({ ok: true });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("maneja error y setea error", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useApi(fetcher));
    await act(async () => {
      await result.current.execute();
    });
    expect(result.current.data).toBeNull();
    expect(result.current.error?.message).toBe("boom");
  });
});
