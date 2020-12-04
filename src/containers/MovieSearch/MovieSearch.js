import React, { Component } from 'react';
import { Breakpoint } from 'react-socks';
import * as movieAPI from '../../services/movieAPI';
import MovieList from '../../components/Movie/MovieList';
import './MovieSearch.scss';
import { BASE_POSTER_PATH } from '../../constants/Constants';
import watermark from 'purejswatermark/dist/watermark';
const logo = '/logo192.png';

export default class MovieSearch extends Component {
  state = {
    value: '',
    movies: null,
    error: false,
    loading: false,
    prevSearch: null,
    newMovies:[],
  };

  async processMovie(movie) {
    try {
      return new Promise(async (resolve, reject) => {
        try {
          let moviePath = `${BASE_POSTER_PATH}/w300${movie.poster_path}`;
          if(!movie.poster_path)moviePath="/wutu.jpg"
          const data = await watermark.addWatermark(moviePath, logo);
          //const data = await watermark.addTextWatermark(moviePath,{text: "Kelly Kang", textSize: 8})
          resolve(data);
        } catch(error) {
          console.log(error)
          throw new Error('cannot get watermark image');
        }
      }).then((data) => {
        return Promise.resolve(data);
      });
    } catch (err) {
      console.log('error getting watermark', err);
    }
  }

  handleChange = event => {
    event.preventDefault();
    this.setState({ value: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    try {
      this.setState({ loading: true });
      const movies = await movieAPI.searchMovies(this.state.value);
      Promise.all(
        movies.map((movie) => {
          return this.processMovie(movie);
        })
      ).then((newImages) => {
        this.setState({
          movies,
          loading: false,
          prevSearch: this.state.value,
          value: '',
          newMovies:newImages.length>0 ? newImages:[]
        });
      //   this.setState({
      //     movies: movies,
      //     loading: false,
      //     newMovies: newImages,
      //   });
      });
 
    } catch (err) {
      this.setState({ error: true, loading: false });
    }
  };

  render() {
    const { movies, error, loading, prevSearch,newMovies } = this.state;
    let movieInfo = null;

    if (movies) {
      if (movies.length === 0) {
        movieInfo = (
          <h3>No movies match your search terms. Please try again.</h3>
        );
      } else if (movies.length > 0) {
        movieInfo = (
          <>
            <h2>Movie Results for: {prevSearch}</h2>
            <MovieList
              loading={this.state.loading}
              error={this.state.error}
              movies={this.state.movies}
              newMovies = {this.state.newMovies}
            />
          </>
        );
      }
    }

    if (error) {
      movieInfo = (
        <h3>
          Woops, something went wrong trying to find movies with titles like
          your search.
        </h3>
      );
    }

    if (loading) {
      movieInfo = <h3>Searching movies now...</h3>;
    }

    return (
      <>
        <h1>Movie Search</h1>
        <form className="search-form-wrapper" onSubmit={this.handleSubmit}>
          <Breakpoint medium up>
            <label className="search-label">
              Search Movie Titles Here:
              <input
                className="search-input"
                type="text"
                value={this.state.value}
                onChange={this.handleChange}
                placeholder="Movie title"
              />
            </label>
            <input type="submit" value="Search" />
          </Breakpoint>
          <Breakpoint small down>
            <label className="search-label">
              Search Movie Titles Here:
              <input
                className="search-input"
                type="text"
                value={this.state.value}
                onChange={this.handleChange}
                placeholder="Movie title"
              />
            </label>
            <input type="submit" value="Search" />
          </Breakpoint>
        </form>
        {movieInfo ? movieInfo : null}
      </>
    );
  }
}
