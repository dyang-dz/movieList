import React from "react";
import { MemoryRouter } from "react-router-dom";
import MovieCard from "./MovieCard";

export default {
  title: "Components/MovieCard",
  component: MovieCard,
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

const Template = args => <MovieCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  movie: {
    id: 1,
    poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    title: "Sample Movie",
    vote_average: 7.8,
    release_date: "2022-05-01",
  },
  toggleFavorite: () => console.log("Toggled favorite"),
  favorites: [],
};

export const Favorited = Template.bind({});
Favorited.args = {
  movie: {
    id: 2,
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    title: "Favorited Movie",
    vote_average: 8.2,
    release_date: "2021-11-15",
  },
  toggleFavorite: () => console.log("Toggled favorite"),
  favorites: [{ id: 2 }],
};
