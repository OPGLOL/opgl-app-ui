// Tests for MatchCard component
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MatchCard } from "./MatchCard";
import {
  mockMatch,
  mockDefeatMatch,
  mockPerfectKDAMatch,
  mockParticipant,
  mockPerfectParticipant,
} from "@/test/fixtures";

describe("MatchCard", () => {
  // Mock current date for consistent time-based tests
  const mockNow = new Date("2024-01-15T12:00:00.000Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockNow);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("rendering", () => {
    it("should render match card for a victory", () => {
      render(
        <MatchCard match={mockMatch} puuid={mockParticipant.puuid} />
      );

      expect(screen.getByText("Victory")).toBeInTheDocument();
    });

    it("should render match card for a defeat", () => {
      const defeatParticipant = mockDefeatMatch.participants[0];
      render(
        <MatchCard match={mockDefeatMatch} puuid={defeatParticipant.puuid} />
      );

      expect(screen.getByText("Defeat")).toBeInTheDocument();
    });

    it("should render champion name", () => {
      render(
        <MatchCard match={mockMatch} puuid={mockParticipant.puuid} />
      );

      expect(screen.getByText(mockParticipant.championName)).toBeInTheDocument();
    });

    it("should render game mode", () => {
      render(
        <MatchCard match={mockMatch} puuid={mockParticipant.puuid} />
      );

      expect(screen.getByText(mockMatch.gameMode)).toBeInTheDocument();
    });

    it("should render team position when available", () => {
      render(
        <MatchCard match={mockMatch} puuid={mockParticipant.puuid} />
      );

      expect(screen.getByText(mockParticipant.teamPosition)).toBeInTheDocument();
    });

    it("should render KDA stats", () => {
      render(
        <MatchCard match={mockMatch} puuid={mockParticipant.puuid} />
      );

      // KDA format: kills/deaths/assists
      const expectedKDA = `${mockParticipant.kills}/${mockParticipant.deaths}/${mockParticipant.assists}`;
      expect(screen.getByText(expectedKDA)).toBeInTheDocument();
    });

    it("should render CS count", () => {
      render(
        <MatchCard match={mockMatch} puuid={mockParticipant.puuid} />
      );

      expect(screen.getByText(`${mockParticipant.totalMinionsKilled} CS`)).toBeInTheDocument();
    });

    it("should render damage dealt in k format", () => {
      render(
        <MatchCard match={mockMatch} puuid={mockParticipant.puuid} />
      );

      const expectedDamage = (mockParticipant.totalDamageDealtToChampions / 1000).toFixed(1);
      expect(screen.getByText(`${expectedDamage}k`)).toBeInTheDocument();
    });

    it("should return null when player is not found in participants", () => {
      const { container } = render(
        <MatchCard match={mockMatch} puuid="non-existent-puuid" />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe("KDA calculation", () => {
    it("should calculate KDA ratio correctly", () => {
      render(
        <MatchCard match={mockMatch} puuid={mockParticipant.puuid} />
      );

      // KDA = (kills + assists) / deaths = (10 + 7) / 3 = 5.67
      const expectedKDA = ((mockParticipant.kills + mockParticipant.assists) / mockParticipant.deaths).toFixed(2);
      expect(screen.getByText(`${expectedKDA} KDA`)).toBeInTheDocument();
    });

    it("should display Perfect KDA when deaths are zero", () => {
      render(
        <MatchCard match={mockPerfectKDAMatch} puuid={mockPerfectParticipant.puuid} />
      );

      expect(screen.getByText("Perfect KDA")).toBeInTheDocument();
    });
  });

  describe("CS per minute calculation", () => {
    it("should calculate CS per minute correctly", () => {
      render(
        <MatchCard match={mockMatch} puuid={mockParticipant.puuid} />
      );

      // CS/min = (totalMinionsKilled / gameDuration) * 60
      // = (180 / 1800) * 60 = 6.0
      const expectedCSPerMin = ((mockParticipant.totalMinionsKilled / mockMatch.gameDuration) * 60).toFixed(1);
      expect(screen.getByText(`${expectedCSPerMin}/min`)).toBeInTheDocument();
    });
  });

  describe("game duration formatting", () => {
    it("should format game duration as MM:SS", () => {
      render(
        <MatchCard match={mockMatch} puuid={mockParticipant.puuid} />
      );

      // 1800 seconds = 30:00
      expect(screen.getByText("30:00")).toBeInTheDocument();
    });

    it("should pad seconds with leading zero", () => {
      const shortMatch = {
        ...mockMatch,
        gameDuration: 605, // 10:05
      };

      render(
        <MatchCard match={shortMatch} puuid={mockParticipant.puuid} />
      );

      expect(screen.getByText("10:05")).toBeInTheDocument();
    });
  });

  describe("date formatting", () => {
    it("should display hours ago for recent matches", () => {
      const twoHoursAgo = new Date(mockNow.getTime() - 2 * 60 * 60 * 1000);
      const recentMatch = {
        ...mockMatch,
        gameCreation: twoHoursAgo.toISOString(),
      };

      render(
        <MatchCard match={recentMatch} puuid={mockParticipant.puuid} />
      );

      expect(screen.getByText("2h ago")).toBeInTheDocument();
    });

    it("should display days ago for older matches", () => {
      const threeDaysAgo = new Date(mockNow.getTime() - 3 * 24 * 60 * 60 * 1000);
      const oldMatch = {
        ...mockMatch,
        gameCreation: threeDaysAgo.toISOString(),
      };

      render(
        <MatchCard match={oldMatch} puuid={mockParticipant.puuid} />
      );

      expect(screen.getByText("3d ago")).toBeInTheDocument();
    });

    it("should display Just now for very recent matches", () => {
      const justNow = new Date(mockNow.getTime() - 30 * 60 * 1000); // 30 minutes ago
      const veryRecentMatch = {
        ...mockMatch,
        gameCreation: justNow.toISOString(),
      };

      render(
        <MatchCard match={veryRecentMatch} puuid={mockParticipant.puuid} />
      );

      expect(screen.getByText("Just now")).toBeInTheDocument();
    });
  });

  describe("champion icon", () => {
    it("should render avatar container with proper structure", () => {
      const { container } = render(
        <MatchCard match={mockMatch} puuid={mockParticipant.puuid} />
      );

      // Radix Avatar renders an avatar container with data-slot="avatar"
      const avatarContainer = container.querySelector('[data-slot="avatar"]');
      expect(avatarContainer).toBeInTheDocument();
      expect(avatarContainer).toHaveClass("h-16", "w-16");
    });

    it("should render avatar fallback with first letter of champion name", () => {
      const { container } = render(
        <MatchCard match={mockMatch} puuid={mockParticipant.puuid} />
      );

      // The fallback element should be present with the first letter of champion name
      const fallback = container.querySelector('[data-slot="avatar-fallback"]');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent(mockParticipant.championName.charAt(0));
    });
  });
});
