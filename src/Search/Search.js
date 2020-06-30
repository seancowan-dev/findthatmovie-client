import React from 'react';
import { FormControl, InputLabel, TextField, Select, Grid, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
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
    <img className="logo-image" src="/images/logo.png" alt="Findthatmovie Logo" />
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
                label="Search"
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
        <button 
            className="buttons"
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
        >Search</button>
    </Grid>

</form>
  }));

export default Search;
