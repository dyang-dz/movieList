import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const SortMenu = ({ setSortOrder }) => {
  const handleChange = useCallback(
    e => {
      setSortOrder(e.target.value);
    },
    [setSortOrder]
  );

  return (
    <FormControl fullWidth sx={{ mb: 2 }} className="sort-menu-container">
      <InputLabel>Sort by</InputLabel>
      <Select defaultValue="" onChange={handleChange}>
        {/* <MenuItem disabled value="">
          Click to Sort Movie
        </MenuItem> */}
        <MenuItem value="">Default</MenuItem>
        <MenuItem value="rating_high">Rating (High → Low)</MenuItem>
        <MenuItem value="rating_low">Rating (Low → High)</MenuItem>
        <MenuItem value="date_new">Release Date (New → Old)</MenuItem>
        <MenuItem value="date_old">Release Date (Old → New)</MenuItem>
        <MenuItem value="title">Title (A → Z)</MenuItem>
      </Select>
    </FormControl>
  );
};

SortMenu.propTypes = {
  setSortOrder: PropTypes.func.isRequired,
};

export default React.memo(SortMenu);
