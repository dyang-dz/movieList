import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import MovieDetail from "../components/MovieDetail";
import { useParams } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

describe("MovieDetail component", () => {
  const mockMovieDetail = {
    title: "Test Movie",
    poster_path: "/poster.jpg",
    overview: "Test overview",
    credits: {
      cast: [
        { id: 1, name: "Actor 1", profile_path: "/actor1.jpg" },
        { id: 2, name: "Actor 2", profile_path: "/actor2.jpg" },
        { id: 3, name: "Actor 3", profile_path: "/actor3.jpg" },
        { id: 4, name: "Actor 4", profile_path: "/actor4.jpg" },
        { id: 5, name: "Actor 5", profile_path: "/actor5.jpg" },
      ],
      crew: [{ id: 10, name: "Director Name", job: "Director" }],
    },
    videos: {
      results: [{ key: "abcd1234" }],
    },
  };

  beforeEach(() => {
    useParams.mockReturnValue({ id: "123" });
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders loading state initially", async () => {
    let resolveFetch;
    const fetchPromise = new Promise(resolve => {
      resolveFetch = resolve;
    });
    global.fetch.mockImplementationOnce(() => fetchPromise);

    render(<MovieDetail />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    await act(async () => {
      resolveFetch({
        ok: true,
        json: () => Promise.resolve(mockMovieDetail),
      });
    });
  });

  test("fetches and displays movie details", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockMovieDetail),
      })
    );

    await act(async () => {
      render(<MovieDetail />);
    });

    const titleElement = await screen.findByText("Test Movie");
    expect(titleElement).toBeInTheDocument();

    const poster = screen.getByAltText("Test Movie");
    expect(poster).toHaveAttribute(
      "src",
      expect.stringContaining("/poster.jpg")
    );

    expect(screen.getByText("Test overview")).toBeInTheDocument();

    expect(screen.getByText("Actor 1")).toBeInTheDocument();

    expect(screen.getByText("Director Name")).toBeInTheDocument();

    const iframe = screen.getByTitle("Movie Trailer");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", expect.stringContaining("abcd1234"));
  });
});
