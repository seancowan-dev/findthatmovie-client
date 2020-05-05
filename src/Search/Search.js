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
            navigate('/results'); // Move user forward to next results page | Breadcrumb this later|

            props.searchStore.getMovieList(false).then(res => {
                props.searchStore.searchResults = []; // Make sure old results are removed
                if (res.results !== undefined || res.results.length !== 0) {
                    props.searchStore.total_pages = res.total_pages;
                    props.searchStore.searchResults.push(res);
                    props.searchStore.searchState = "display";
                }
                if (res.results === undefined || res.results.length === 0) {
                    props.searchStore.searchState = "none";
                }
            });
        }}
        >
            Search
        </Button>
    </Grid>

</form>
  }));

export default Search;
