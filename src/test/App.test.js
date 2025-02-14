import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import App from "../App";

beforeEach(() => {
  localStorage.clear();
  jest.spyOn(window, "fetch").mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          results: [
            {
              id: 1,
              title: "Test Movie",
              poster_path: "/test.jpg",
              vote_average: 8,
              release_date: "2022-01-01",
            },
          ],
        }),
    })
  );
});

afterEach(() => {
  window.fetch.mockRestore();
});

test("App renders movie list and toggles favorite status correctly", async () => {
  render(<App />);

  await waitFor(() =>
    expect(screen.getByText("Test Movie")).toBeInTheDocument()
  );

  const favoriteButton = screen.getByRole("button", {
    name: /Add to Favorites/i,
  });
  expect(favoriteButton).toBeInTheDocument();

  fireEvent.click(favoriteButton);

  await waitFor(() => {
    expect(favoriteButton.textContent).toMatch(/Remove from Favorites/);
  });

  const favorites = JSON.parse(localStorage.getItem("favorites"));
  expect(favorites).toHaveLength(1);
  expect(favorites[0].id).toBe(1);
});
