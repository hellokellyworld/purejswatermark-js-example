import React, { Component } from 'react';
import MovieList from '../../components/Movie/MovieList';
import * as movieAPI from '../../services/movieAPI';
import './NowPlaying.scss';
import { BASE_POSTER_PATH } from '../../constants/Constants';
import watermark from 'purejswatermark/dist/watermark';
const logo = '/logo192.png';
const eg = '/eg.jpg'

export default class NowPlaying extends Component {
  state = {
    movies: [],
    loading: true,
    error: false,
    newMovies:[],
    imageWithText:null,
    newMoviesWithTextWatermark:[]
  };

  async componentDidMount() {
    try {
      const movies = await movieAPI.getNowPlaying();
      Promise.all(
        movies.map((movie) => {
          return this.processMovieWithWatermark(movie);
        })
      ).then((newImages) => {
        this.setState({
          movies: movies,
          loading: false,
          newMovies: newImages,
          //newMoviesWithTextWatermark:newImagesWithTextWatermark,
        });
       });
       Promise.all(
        movies.map((movie) => {
          return this.processMovieWithTextWatermark(movie);
        })
      ).then((newImagesWithTextWatermark) => {
        this.setState({
        newMoviesWithTextWatermark:newImagesWithTextWatermark,
        });
       });
    } catch (err) {
      console.log('err', err);
      this.setState({ loading: false, error: true });
    }  
  }
  

  async processMovieWithWatermark(movie) {
    try {
      return new Promise(async (resolve, reject) => {
        try {
          const moviePath = `${BASE_POSTER_PATH}/w300${movie.poster_path}`;
          const data = await watermark.addWatermark(moviePath, logo);
          resolve(data);
        } catch(error) {
          console.log(error)
          throw new Error('cannot get watermark image');
        }
      }).then((data) => {
        return Promise.resolve(data);
      });
    } catch (err) {
      console.log('error getting watermark', err)
    }
  }


  async processMovieWithTextWatermark(movie) {
    try {
      return new Promise(async (resolve, reject) => {
        try {
          const moviePath = `${BASE_POSTER_PATH}/w300${movie.poster_path}`;
          const dataWithTextWatermark=await watermark.addTextWatermark(moviePath,{text: "", textSize: 8})
          resolve(dataWithTextWatermark)
        } catch(error) {
          console.log(error)
          throw new Error('cannot get watermark image');
        }
      }).then((data) => {
        return Promise.resolve(data);
      });
    } catch (err) {
      console.log('error getting watermark', err)
    }
  }

  
  render() {
    return (
      <>
        <h1 className="now-playing-title">Movies In Theaters Now</h1>
        <MovieList loading={this.state.loading} error={this.state.error} movies={this.state.movies}      
        newMovies={this.state.newMovies}/>
        <MovieList loading={this.state.loading} error={this.state.error} movies={this.state.movies}      
        newMovies={this.state.newMoviesWithTextWatermark}/>
      </>
    );
  }
}
