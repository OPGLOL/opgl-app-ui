// Tests for PlayerSearch component
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlayerSearch } from "./PlayerSearch";

describe("PlayerSearch", () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render search form with all inputs", () => {
    render(<PlayerSearch onSearch={mockOnSearch} isLoading={false} />);

    // Check that the region selector exists
    expect(screen.getByRole("combobox")).toBeInTheDocument();

    // Check that the game name input exists
    expect(screen.getByPlaceholderText("Game Name")).toBeInTheDocument();

    // Check that the tag line input exists
    expect(screen.getByPlaceholderText("Tag")).toBeInTheDocument();

    // Check that the search button exists
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("should have search button disabled when inputs are empty", () => {
    render(<PlayerSearch onSearch={mockOnSearch} isLoading={false} />);

    const searchButton = screen.getByRole("button", { name: /search/i });
    expect(searchButton).toBeDisabled();
  });

  it("should enable search button when game name and tag line are filled", async () => {
    const user = userEvent.setup();
    render(<PlayerSearch onSearch={mockOnSearch} isLoading={false} />);

    const gameNameInput = screen.getByPlaceholderText("Game Name");
    const tagLineInput = screen.getByPlaceholderText("Tag");
    const searchButton = screen.getByRole("button", { name: /search/i });

    // Initially disabled
    expect(searchButton).toBeDisabled();

    // Fill in the inputs
    await user.type(gameNameInput, "TestPlayer");
    await user.type(tagLineInput, "NA1");

    // Now enabled
    expect(searchButton).not.toBeDisabled();
  });

  it("should call onSearch with correct values when form is submitted", async () => {
    const user = userEvent.setup();
    render(<PlayerSearch onSearch={mockOnSearch} isLoading={false} />);

    const gameNameInput = screen.getByPlaceholderText("Game Name");
    const tagLineInput = screen.getByPlaceholderText("Tag");
    const searchButton = screen.getByRole("button", { name: /search/i });

    await user.type(gameNameInput, "TestPlayer");
    await user.type(tagLineInput, "NA1");
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith("na", "TestPlayer", "NA1");
  });

  it("should trim whitespace from inputs before submitting", async () => {
    const user = userEvent.setup();
    render(<PlayerSearch onSearch={mockOnSearch} isLoading={false} />);

    const gameNameInput = screen.getByPlaceholderText("Game Name");
    const tagLineInput = screen.getByPlaceholderText("Tag");
    const searchButton = screen.getByRole("button", { name: /search/i });

    await user.type(gameNameInput, "  TestPlayer  ");
    await user.type(tagLineInput, "  NA1  ");
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith("na", "TestPlayer", "NA1");
  });

  it("should not submit when only game name is filled", async () => {
    const user = userEvent.setup();
    render(<PlayerSearch onSearch={mockOnSearch} isLoading={false} />);

    const gameNameInput = screen.getByPlaceholderText("Game Name");
    const searchButton = screen.getByRole("button", { name: /search/i });

    await user.type(gameNameInput, "TestPlayer");

    expect(searchButton).toBeDisabled();
  });

  it("should not submit when only tag line is filled", async () => {
    const user = userEvent.setup();
    render(<PlayerSearch onSearch={mockOnSearch} isLoading={false} />);

    const tagLineInput = screen.getByPlaceholderText("Tag");
    const searchButton = screen.getByRole("button", { name: /search/i });

    await user.type(tagLineInput, "NA1");

    expect(searchButton).toBeDisabled();
  });

  it("should disable search button when isLoading is true", async () => {
    const user = userEvent.setup();
    render(<PlayerSearch onSearch={mockOnSearch} isLoading={true} />);

    const gameNameInput = screen.getByPlaceholderText("Game Name");
    const tagLineInput = screen.getByPlaceholderText("Tag");
    const searchButton = screen.getByRole("button", { name: /search/i });

    await user.type(gameNameInput, "TestPlayer");
    await user.type(tagLineInput, "NA1");

    // Even with filled inputs, button should be disabled when loading
    expect(searchButton).toBeDisabled();
  });

  it("should show loading indicator when isLoading is true", () => {
    render(<PlayerSearch onSearch={mockOnSearch} isLoading={true} />);

    // Check for the loading spinner emoji
    expect(screen.getByText("⏳")).toBeInTheDocument();
  });

  it("should display hash symbol before tag line input", () => {
    render(<PlayerSearch onSearch={mockOnSearch} isLoading={false} />);

    expect(screen.getByText("#")).toBeInTheDocument();
  });

  it("should have North America as default region", () => {
    render(<PlayerSearch onSearch={mockOnSearch} isLoading={false} />);

    // The combobox should show North America as the selected value
    expect(screen.getByRole("combobox")).toHaveTextContent("North America");
  });
});
