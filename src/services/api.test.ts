// Tests for API service
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSummoner, getMatchHistory, checkHealth } from "./api";
import { mockSummoner, mockMatchList } from "@/test/fixtures";

describe("API Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSummoner", () => {
    it("should fetch summoner data successfully", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockSummoner),
      });
      global.fetch = mockFetch;

      const result = await getSummoner({
        region: "na",
        gameName: "TestPlayer",
        tagLine: "NA1",
      });

      expect(result).toEqual(mockSummoner);
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/v1/summoner",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            region: "na",
            gameName: "TestPlayer",
            tagLine: "NA1",
          }),
        }
      );
    });

    it("should throw error when response is not ok", async () => {
      const errorMessage = "Player not found";
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        text: () => Promise.resolve(errorMessage),
      });
      global.fetch = mockFetch;

      await expect(
        getSummoner({
          region: "na",
          gameName: "NonExistent",
          tagLine: "XXX",
        })
      ).rejects.toThrow(errorMessage);
    });

    it("should throw generic error when no error text is provided", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve(""),
      });
      global.fetch = mockFetch;

      await expect(
        getSummoner({
          region: "na",
          gameName: "TestPlayer",
          tagLine: "NA1",
        })
      ).rejects.toThrow("API error: 500");
    });
  });

  describe("getMatchHistory", () => {
    it("should fetch match history successfully", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockMatchList),
      });
      global.fetch = mockFetch;

      const result = await getMatchHistory({
        region: "na",
        puuid: "test-puuid",
        count: 20,
      });

      expect(result).toEqual(mockMatchList);
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/v1/matches",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            region: "na",
            puuid: "test-puuid",
            gameName: undefined,
            tagLine: undefined,
            count: 20,
          }),
        }
      );
    });

    it("should use default count of 20 when not specified", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockMatchList),
      });
      global.fetch = mockFetch;

      await getMatchHistory({
        region: "na",
        puuid: "test-puuid",
      });

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.count).toBe(20);
    });

    it("should include gameName and tagLine when provided", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockMatchList),
      });
      global.fetch = mockFetch;

      await getMatchHistory({
        region: "na",
        gameName: "TestPlayer",
        tagLine: "NA1",
        count: 10,
      });

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.gameName).toBe("TestPlayer");
      expect(callBody.tagLine).toBe("NA1");
      expect(callBody.count).toBe(10);
    });

    it("should throw error when response is not ok", async () => {
      const errorMessage = "Failed to fetch matches";
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve(errorMessage),
      });
      global.fetch = mockFetch;

      await expect(
        getMatchHistory({
          region: "na",
          puuid: "test-puuid",
        })
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("checkHealth", () => {
    it("should return true when gateway is healthy", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
      });
      global.fetch = mockFetch;

      const result = await checkHealth();

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:8080/health",
        {
          method: "POST",
        }
      );
    });

    it("should return false when gateway returns error", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
      });
      global.fetch = mockFetch;

      const result = await checkHealth();

      expect(result).toBe(false);
    });

    it("should return false when fetch throws an error", async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error("Network error"));
      global.fetch = mockFetch;

      const result = await checkHealth();

      expect(result).toBe(false);
    });
  });
});
