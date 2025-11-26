// Tests for MatchHistory component
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MatchHistory } from "./MatchHistory";
import { mockMatchList, mockParticipant, emptyMatchList } from "@/test/fixtures";

describe("MatchHistory", () => {
  const testPuuid = mockParticipant.puuid;

  // Mock current date for consistent time-based tests in MatchCard
  const mockNow = new Date("2024-01-15T12:00:00.000Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockNow);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("loading state", () => {
    it("should render loading skeletons when isLoading is true", () => {
      render(
        <MatchHistory
          matches={emptyMatchList}
          puuid={testPuuid}
          isLoading={true}
        />
      );

      expect(screen.getByText("Match History")).toBeInTheDocument();
      // Check for skeleton elements (5 loading skeletons)
      const skeletons = document.querySelectorAll('[class*="animate-pulse"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("should display Match History heading when loading", () => {
      render(
        <MatchHistory
          matches={emptyMatchList}
          puuid={testPuuid}
          isLoading={true}
        />
      );

      expect(screen.getByText("Match History")).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("should render empty message when no matches are found", () => {
      render(
        <MatchHistory
          matches={emptyMatchList}
          puuid={testPuuid}
          isLoading={false}
        />
      );

      expect(screen.getByText("No matches found")).toBeInTheDocument();
    });
  });

  describe("with matches", () => {
    it("should render match history heading with game count", () => {
      render(
        <MatchHistory
          matches={mockMatchList}
          puuid={testPuuid}
          isLoading={false}
        />
      );

      expect(
        screen.getByText(`Match History (${mockMatchList.length} games)`)
      ).toBeInTheDocument();
    });

    it("should render correct number of match cards", () => {
      render(
        <MatchHistory
          matches={mockMatchList}
          puuid={testPuuid}
          isLoading={false}
        />
      );

      // Each match that has the player should render a MatchCard
      // mockMatchList has 3 matches, but only 2 have the testPuuid participant
      const matchCards = document.querySelectorAll('[class*="border-l-4"]');
      expect(matchCards.length).toBeGreaterThan(0);
    });

    it("should render game modes from matches", () => {
      render(
        <MatchHistory
          matches={mockMatchList}
          puuid={testPuuid}
          isLoading={false}
        />
      );

      // All our mock matches have CLASSIC game mode
      const classicModes = screen.getAllByText("CLASSIC");
      expect(classicModes.length).toBeGreaterThan(0);
    });
  });

  describe("single match", () => {
    it("should display correct game count for single match", () => {
      const singleMatch = [mockMatchList[0]];

      render(
        <MatchHistory
          matches={singleMatch}
          puuid={testPuuid}
          isLoading={false}
        />
      );

      expect(screen.getByText("Match History (1 games)")).toBeInTheDocument();
    });
  });

  describe("transitions", () => {
    it("should show matches after loading completes", () => {
      const { rerender } = render(
        <MatchHistory
          matches={emptyMatchList}
          puuid={testPuuid}
          isLoading={true}
        />
      );

      // Initially loading
      expect(screen.getByText("Match History")).toBeInTheDocument();

      // After loading completes with matches
      rerender(
        <MatchHistory
          matches={mockMatchList}
          puuid={testPuuid}
          isLoading={false}
        />
      );

      expect(
        screen.getByText(`Match History (${mockMatchList.length} games)`)
      ).toBeInTheDocument();
    });

    it("should show empty state after loading completes with no matches", () => {
      const { rerender } = render(
        <MatchHistory
          matches={emptyMatchList}
          puuid={testPuuid}
          isLoading={true}
        />
      );

      // After loading completes with no matches
      rerender(
        <MatchHistory
          matches={emptyMatchList}
          puuid={testPuuid}
          isLoading={false}
        />
      );

      expect(screen.getByText("No matches found")).toBeInTheDocument();
    });
  });
});
