// Tests for PlayerProfile component
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlayerProfile } from "./PlayerProfile";
import { mockSummoner } from "@/test/fixtures";

describe("PlayerProfile", () => {
  const defaultProps = {
    summoner: mockSummoner,
    gameName: "TestPlayer",
    tagLine: "NA1",
  };

  it("should render player game name", () => {
    render(<PlayerProfile {...defaultProps} />);

    expect(screen.getByText("TestPlayer")).toBeInTheDocument();
  });

  it("should render player tag line with hash symbol", () => {
    render(<PlayerProfile {...defaultProps} />);

    expect(screen.getByText("#NA1")).toBeInTheDocument();
  });

  it("should render player level", () => {
    render(<PlayerProfile {...defaultProps} />);

    expect(screen.getByText(`Level ${mockSummoner.summonerLevel}`)).toBeInTheDocument();
  });

  it("should render truncated PUUID", () => {
    render(<PlayerProfile {...defaultProps} />);

    // PUUID should be truncated to first 20 characters
    const expectedTruncatedPuuid = mockSummoner.puuid.slice(0, 20);
    expect(screen.getByText(`PUUID: ${expectedTruncatedPuuid}...`)).toBeInTheDocument();
  });

  it("should render avatar container with proper structure", () => {
    const { container } = render(<PlayerProfile {...defaultProps} />);

    // Radix Avatar renders an avatar container with data-slot="avatar"
    const avatarContainer = container.querySelector('[data-slot="avatar"]');
    expect(avatarContainer).toBeInTheDocument();
    expect(avatarContainer).toHaveClass("h-24", "w-24");
  });

  it("should render avatar with fallback showing first letter", () => {
    const { container } = render(<PlayerProfile {...defaultProps} />);

    // The fallback element should be present with the first letter
    const fallback = container.querySelector('[data-slot="avatar-fallback"]');
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveTextContent("T");
  });

  it("should render avatar fallback with first letter of game name", () => {
    render(<PlayerProfile {...defaultProps} />);

    // The fallback should contain the first letter uppercased
    expect(screen.getByText("T")).toBeInTheDocument();
  });

  it("should display different game names correctly", () => {
    const customProps = {
      ...defaultProps,
      gameName: "Newyenn",
      tagLine: "GGEZ",
    };

    render(<PlayerProfile {...customProps} />);

    expect(screen.getByText("Newyenn")).toBeInTheDocument();
    expect(screen.getByText("#GGEZ")).toBeInTheDocument();
  });

  it("should display different summoner levels correctly", () => {
    const highLevelSummoner = {
      ...mockSummoner,
      summonerLevel: 999,
    };

    render(
      <PlayerProfile
        summoner={highLevelSummoner}
        gameName="HighLevel"
        tagLine="PRO"
      />
    );

    expect(screen.getByText("Level 999")).toBeInTheDocument();
  });

  it("should handle lowercase game names in avatar fallback", () => {
    const lowercaseProps = {
      ...defaultProps,
      gameName: "lowercase",
    };

    render(<PlayerProfile {...lowercaseProps} />);

    // First letter should be uppercased
    expect(screen.getByText("L")).toBeInTheDocument();
  });
});
