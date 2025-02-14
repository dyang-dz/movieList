import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SortMenu from "../components/SortMenu";

describe("SortMenu component", () => {
  test("renders the sort menu with options", () => {
    const setSortOrderMock = jest.fn();
    render(<SortMenu setSortOrder={setSortOrderMock} />);

    expect(screen.getByText(/Sort by/i)).toBeInTheDocument();

    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toBeInTheDocument();

    fireEvent.mouseDown(selectElement);

    expect(screen.getByText("Default")).toBeInTheDocument();
    expect(screen.getByText("Rating (High → Low)")).toBeInTheDocument();
    expect(screen.getByText("Rating (Low → High)")).toBeInTheDocument();
    expect(screen.getByText("Release Date (New → Old)")).toBeInTheDocument();
    expect(screen.getByText("Release Date (Old → New)")).toBeInTheDocument();
    expect(screen.getByText("Title (A → Z)")).toBeInTheDocument();
  });

  test("calls setSortOrder when an option is selected", () => {
    const setSortOrderMock = jest.fn();
    render(<SortMenu setSortOrder={setSortOrderMock} />);

    const selectElement = screen.getByRole("combobox");
    fireEvent.mouseDown(selectElement);

    const option = screen.getByText("Rating (High → Low)");
    fireEvent.click(option);

    expect(setSortOrderMock).toHaveBeenCalledWith("rating_high");
  });
});
