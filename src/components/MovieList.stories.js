import React from "react";
import { MemoryRouter } from "react-router-dom";
import MovieList from "./MovieList";

export default {
  title: "Components/MovieList",
  component: MovieList,
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

const Template = args => <MovieList {...args} />;

export const Default = Template.bind({});
Default.args = {
  movies: [
    {
      id: 1,
      title: "Inception",
      release_date: "2010-07-16",
      poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      vote_average: 8.8,
    },
    {
      id: 2,
      title: "Interstellar",
      release_date: "2014-11-07",
      poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      vote_average: 8.6,
    },
    {
      id: 3,
      title: "The Dark Knight",
      release_date: "2008-07-18",
      poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      vote_average: 9.0,
    },
  ],
  sortOrder: "",
  toggleFavorite: () => console.log("Toggle favorite clicked"),
  favorites: [],
};

export const SortedByRatingHigh = Template.bind({});
SortedByRatingHigh.args = {
  ...Default.args,
  sortOrder: "rating_high",
};

export const SortedByRatingLow = Template.bind({});
SortedByRatingLow.args = {
  ...Default.args,
  sortOrder: "rating_low",
};

export const SortedByDateNew = Template.bind({});
SortedByDateNew.args = {
  ...Default.args,
  sortOrder: "date_new",
};

export const SortedByDateOld = Template.bind({});
SortedByDateOld.args = {
  ...Default.args,
  sortOrder: "date_old",
};

export const SortedByTitle = Template.bind({});
SortedByTitle.args = {
  ...Default.args,
  sortOrder: "title",
};
