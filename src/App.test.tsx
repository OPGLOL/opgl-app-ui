// Tests for App component
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { mockSummoner, mockMatchList } from "@/test/fixtures";

// Mock the API module
vi.mock("@/services/api", () => ({
  getSummoner: vi.fn(),
  getMatchHistory: vi.fn(),
}));

import { getSummoner, getMatchHistory } from "@/services/api";

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initial render", () => {
    it("should render the app header", () => {
      render(<App />);

      expect(screen.getByText("OPGL")).toBeInTheDocument();
      expect(
        screen.getByText("League of Legends Performance Analytics")
      ).toBeInTheDocument();
    });

    it("should render the search section", () => {
      render(<App />);

      expect(screen.getByText("Search Player")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Game Name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Tag")).toBeInTheDocument();
    });

    it("should render the empty state message", () => {
      render(<App />);

      expect(screen.getByText("Enter a Riot ID to get started")).toBeInTheDocument();
      expect(screen.getByText("Example: Newyenn#GGEZ")).toBeInTheDocument();
    });

    it("should render the footer", () => {
      render(<App />);

      expect(screen.getByText("OPGL Desktop v0.1.0")).toBeInTheDocument();
      expect(
        screen.getByText("Make sure opgl-gateway is running on localhost:8080")
      ).toBeInTheDocument();
    });

    it("should not render player profile initially", () => {
      render(<App />);

      expect(screen.queryByText("Level")).not.toBeInTheDocument();
    });

    it("should not render match history initially", () => {
      render(<App />);

      expect(screen.queryByText("Match History")).not.toBeInTheDocument();
    });
  });

  describe("search functionality", () => {
    it("should call API and display player profile on successful search", async () => {
      const user = userEvent.setup();

      vi.mocked(getSummoner).mockResolvedValue(mockSummoner);
      vi.mocked(getMatchHistory).mockResolvedValue(mockMatchList);

      render(<App />);

      // Fill in the search form
      const gameNameInput = screen.getByPlaceholderText("Game Name");
      const tagLineInput = screen.getByPlaceholderText("Tag");
      const searchButton = screen.getByRole("button", { name: /search/i });

      await user.type(gameNameInput, "TestPlayer");
      await user.type(tagLineInput, "NA1");
      await user.click(searchButton);

      // Wait for API calls to complete
      await waitFor(() => {
        expect(getSummoner).toHaveBeenCalledWith({
          region: "na",
          gameName: "TestPlayer",
          tagLine: "NA1",
        });
      });

      // Check that player profile is displayed
      await waitFor(() => {
        expect(screen.getByText("TestPlayer")).toBeInTheDocument();
        expect(screen.getByText("#NA1")).toBeInTheDocument();
      });
    });

    it("should display match history after successful search", async () => {
      const user = userEvent.setup();

      vi.mocked(getSummoner).mockResolvedValue(mockSummoner);
      vi.mocked(getMatchHistory).mockResolvedValue(mockMatchList);

      render(<App />);

      const gameNameInput = screen.getByPlaceholderText("Game Name");
      const tagLineInput = screen.getByPlaceholderText("Tag");
      const searchButton = screen.getByRole("button", { name: /search/i });

      await user.type(gameNameInput, "TestPlayer");
      await user.type(tagLineInput, "NA1");
      await user.click(searchButton);

      await waitFor(() => {
        expect(getMatchHistory).toHaveBeenCalledWith({
          region: "na",
          puuid: mockSummoner.puuid,
          count: 20,
        });
      });

      await waitFor(() => {
        expect(
          screen.getByText(`Match History (${mockMatchList.length} games)`)
        ).toBeInTheDocument();
      });
    });

    it("should display error message when API call fails", async () => {
      const user = userEvent.setup();

      const errorMessage = "Player not found";
      vi.mocked(getSummoner).mockRejectedValue(new Error(errorMessage));

      render(<App />);

      const gameNameInput = screen.getByPlaceholderText("Game Name");
      const tagLineInput = screen.getByPlaceholderText("Tag");
      const searchButton = screen.getByRole("button", { name: /search/i });

      await user.type(gameNameInput, "NonExistent");
      await user.type(tagLineInput, "XXX");
      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText("Error")).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it("should display generic error message for non-Error exceptions", async () => {
      const user = userEvent.setup();

      vi.mocked(getSummoner).mockRejectedValue("Unknown error");

      render(<App />);

      const gameNameInput = screen.getByPlaceholderText("Game Name");
      const tagLineInput = screen.getByPlaceholderText("Tag");
      const searchButton = screen.getByRole("button", { name: /search/i });

      await user.type(gameNameInput, "TestPlayer");
      await user.type(tagLineInput, "NA1");
      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText("Error")).toBeInTheDocument();
        expect(screen.getByText("Failed to fetch player data")).toBeInTheDocument();
      });
    });

    it("should clear previous error when starting new search", async () => {
      const user = userEvent.setup();

      // First search fails
      vi.mocked(getSummoner).mockRejectedValueOnce(new Error("First error"));

      render(<App />);

      const gameNameInput = screen.getByPlaceholderText("Game Name");
      const tagLineInput = screen.getByPlaceholderText("Tag");
      const searchButton = screen.getByRole("button", { name: /search/i });

      // First search - fails
      await user.type(gameNameInput, "TestPlayer");
      await user.type(tagLineInput, "NA1");
      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText("Error")).toBeInTheDocument();
      });

      // Second search - succeeds
      vi.mocked(getSummoner).mockResolvedValueOnce(mockSummoner);
      vi.mocked(getMatchHistory).mockResolvedValueOnce(mockMatchList);

      await user.clear(gameNameInput);
      await user.clear(tagLineInput);
      await user.type(gameNameInput, "NewPlayer");
      await user.type(tagLineInput, "NEW");
      await user.click(searchButton);

      // Error should be cleared during new search
      await waitFor(() => {
        expect(screen.queryByText("First error")).not.toBeInTheDocument();
      });
    });
  });

  describe("error state", () => {
    it("should not show error message initially", () => {
      render(<App />);

      expect(screen.queryByText("Error")).not.toBeInTheDocument();
    });

    it("should hide empty state when error is displayed", async () => {
      const user = userEvent.setup();

      vi.mocked(getSummoner).mockRejectedValue(new Error("API Error"));

      render(<App />);

      const gameNameInput = screen.getByPlaceholderText("Game Name");
      const tagLineInput = screen.getByPlaceholderText("Tag");
      const searchButton = screen.getByRole("button", { name: /search/i });

      await user.type(gameNameInput, "Test");
      await user.type(tagLineInput, "NA1");
      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText("Error")).toBeInTheDocument();
      });

      // Empty state should be hidden since search was attempted
      expect(
        screen.queryByText("Enter a Riot ID to get started")
      ).not.toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("should show loading indicator while searching", async () => {
      const user = userEvent.setup();

      // Create a promise that we can control
      let resolvePromise: (value: typeof mockSummoner) => void;
      const pendingPromise = new Promise<typeof mockSummoner>((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(getSummoner).mockReturnValue(pendingPromise);

      render(<App />);

      const gameNameInput = screen.getByPlaceholderText("Game Name");
      const tagLineInput = screen.getByPlaceholderText("Tag");
      const searchButton = screen.getByRole("button", { name: /search/i });

      await user.type(gameNameInput, "TestPlayer");
      await user.type(tagLineInput, "NA1");
      await user.click(searchButton);

      // Should show loading indicator
      await waitFor(() => {
        expect(screen.getByText("⏳")).toBeInTheDocument();
      });

      // Resolve the promise
      vi.mocked(getMatchHistory).mockResolvedValue(mockMatchList);
      resolvePromise!(mockSummoner);

      // Loading indicator should disappear
      await waitFor(() => {
        expect(screen.queryByText("⏳")).not.toBeInTheDocument();
      });
    });

    it("should disable search button while loading", async () => {
      const user = userEvent.setup();

      // Create a pending promise
      vi.mocked(getSummoner).mockReturnValue(new Promise(() => {}));

      render(<App />);

      const gameNameInput = screen.getByPlaceholderText("Game Name");
      const tagLineInput = screen.getByPlaceholderText("Tag");
      const searchButton = screen.getByRole("button", { name: /search/i });

      await user.type(gameNameInput, "TestPlayer");
      await user.type(tagLineInput, "NA1");
      await user.click(searchButton);

      // Button should be disabled while loading
      await waitFor(() => {
        expect(searchButton).toBeDisabled();
      });
    });
  });
});
