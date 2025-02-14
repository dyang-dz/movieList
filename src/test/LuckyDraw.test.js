import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import LuckyDraw from "../components/LuckyDraw";
import { useNavigate } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("LuckyDraw Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test("renders the shuffle button", () => {
    useNavigate.mockReturnValue(jest.fn());
    render(<LuckyDraw movies={[]} />);
    const button = screen.getByText(/Shuffle and Surprise/i);
    expect(button).toBeInTheDocument();
  });

  test("calls navigate with the correct URL when movies array is not empty", () => {
    jest.useFakeTimers();
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    const movies = [
      { id: 1, title: "Movie A" },
      { id: 2, title: "Movie B" },
      { id: 3, title: "Movie B" },
      { id: 4, title: "Movie B" },
      { id: 5, title: "Movie B" },
      { id: 6, title: "Movie B" },
      { id: 7, title: "Movie B" },
      { id: 8, title: "Movie B" },
      { id: 9, title: "Movie B" },
      { id: 10, title: "Movie B" },
    ];

    const randomSpy = jest.spyOn(Math, "random").mockReturnValue(0.2);

    render(<LuckyDraw movies={movies} />);
    const button = screen.getByText(/Shuffle and Surprise/i);
    fireEvent.click(button);

    act(() => {
      jest.advanceTimersByTime(800);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/movie/3");

    randomSpy.mockRestore();
  });

  test("does not call navigate when movies array is empty", () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(<LuckyDraw movies={[]} />);
    const button = screen.getByText(/Shuffle and Surprise/i);
    fireEvent.click(button);

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
