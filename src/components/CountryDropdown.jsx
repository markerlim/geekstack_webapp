import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import countries from "i18n-iso-countries"; // ISO country data library
import en from "i18n-iso-countries/langs/en.json"; // English language data

countries.registerLocale(en); // Register the language data

const CountrySearch = ({ value, onChange, width }) => {
  const countryOptions = Object.values(countries.getNames("en")).map(country => ({
    label: country,
  }));

  return (
    <Autocomplete
      sx={{width:{width}}}
      options={countryOptions}
      getOptionLabel={(option) => option.label}
      value={countryOptions.find((opt) => opt.label === value) || null}
      onChange={(event, newValue) => onChange(newValue ? newValue.label : "")}
      renderInput={(params) => (
        <TextField {...params} label="Country" fullWidth />
      )}
    />
  );
};

export default CountrySearch;
