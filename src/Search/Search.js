import React from 'react';
import { Button, FormControl, InputLabel, TextField, Select, Grid, MenuItem } from '@material-ui/core';
// FormControlLabel, FormHelperText, Checkbox, 
import { observer, inject } from 'mobx-react';
import uuid from 'uuid';
import { navigate } from 'hookrouter';

const Search = inject("searchStore", "dataStore", "helpers")(observer((props) => {

    let years = [];
    let genres = [];
    let countries = [];
    let ratings = [];

        for (let i = 0; i < props.dataStore.genres.length; i++) {
            genres[i] = <MenuItem key={uuid.v4()} value={props.dataStore.genres[i].code}>{props.dataStore.genres[i].genre}</MenuItem>
        }
        for (let i = 0; i < props.dataStore.years.length; i++) {
            years[i] = <MenuItem key={uuid.v4()} value={props.dataStore.years[i].code}>{props.dataStore.years[i].year}</MenuItem>
        }
        for (let i = 0; i < props.dataStore.countries.length; i++) {
            countries[i] = <MenuItem key={uuid.v4()} value={props.dataStore.countries[i].value}>{props.dataStore.countries[i].country}</MenuItem>
        }
        for (let i = 0; i < 11; i++) {
            if (i === 0) {
                ratings[i] = <MenuItem key={uuid.v4()} value={"Min"}>Min</MenuItem>
            } else {
                ratings[i] = <MenuItem key={uuid.v4()} value={i}>{i}</MenuItem>
            }
        }
    return <form className="search-form">
    <Grid 
        container
        direction="column"
        alignItems="center"
    >
    <Grid item xs={12}>
        <FormControl className="user-query-control">
            <TextField
                id="user-query-input"
                className="user-query-input"
                label="Enter keyword(s) or title"
                value={props.searchStore.searchParams.userQuery}
                onChange={(e) => {
                    props.searchStore.searchParams.userQuery = e.target.value;
                }}
            />
        </FormControl>
        <FormControl className="select-year-control">
            <InputLabel id="select-year-label">Year</InputLabel>
            <Select
                labelId="select-year-label"
                id="select-year"
                className="select-year"
                value={props.searchStore.searchParams.selectedYear}
                onChange={(e) => {
                    props.searchStore.searchParams.selectedYear = e.target.value;
                }}
                >
                {years}
            </Select>
        </FormControl>
        </Grid>
        <Grid item xs={12}>
        <FormControl className="select-genre-control">
            <InputLabel id="select-genre-label">Genre</InputLabel>
            <Select
                labelId="select-genre-label"
                id="select-genre"
                className="select-genre"
                value={props.searchStore.searchParams.selectedGenre}
                onChange={(e) => {
                    props.searchStore.searchParams.selectedGenre = e.target.value;
                }}
                >
                {genres}
            </Select>
        </FormControl>
        {/* |Temporarily disabled because this requires a combined API call which will be written on Node later |
        <FormControl className="select-country-control">
            <InputLabel id="select-country-label">Country</InputLabel>
            <Select
                labelId="select-country-label"
                id="select-country"
                className="select-country"
                value={props.searchStore.searchParams.selectedCountry}
                onChange={(e) => {
                    props.searchStore.searchParams.selectedCountry = e.target.value;
                }}
                >
                {countries}
            </Select>
        </FormControl> */}
        <FormControl className="select-rating-control-min">
            <InputLabel id="select-rating-label-min">Rating</InputLabel>
            <Select
                labelId="select-rating-label-min"
                id="select-rating-min"
                className="select-rating-min"
                value={props.searchStore.searchParams.selectedRatingMin}
                onChange={(e) => {
                    props.searchStore.searchParams.selectedRatingMin = e.target.value;
                }}
                >
                {ratings}
            </Select>
        </FormControl>
        </Grid>
        <Button
        variant="contained"
        onClick={(e) => {
            let trimmed = props.dataStore.testMovieData.results.filter(item => { // Trim MobX placeholder pairs
                if (item !== undefined) {
                    return item;
                }
                return null
            })

            // Filter results with the filter helper function
            props.searchStore.filteredResults = props.helpers.filterMovieResults(trimmed, props.searchStore.searchParams)

            // If the results array has been formed check to see if it has undefined content or not
            if (props.searchStore.filteredResults.length > 0) {
                if (props.searchStore.filteredResults[0] !== undefined) { // There are search results, display them
                    props.searchStore.searchState = "display";
                }
                if (props.searchStore.filteredResults[0] === undefined) {
                    props.searchStore.searchState = "none"; // There are not search results, tell the user
                }
            } else { // If we've reached this point it means there are also no results, tell the user
                props.searchStore.searchState = "none";
            }
            navigate('/results'); // Move user forward to next results page | Breadcrumb this later|
        }}
        >
            Search
        </Button>
    </Grid>

</form>
  }));

export default Search;
