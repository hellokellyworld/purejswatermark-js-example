import React, { Component } from 'react';
import MovieList from '../../components/Movie/MovieList';
import * as movieAPI from '../../services/movieAPI';
import './Upcoming.scss';
import { BASE_POSTER_PATH } from '../../constants/Constants';
import watermark from 'purejswatermark/dist/watermark';
const logo = '/logo192.png';
export default class Upcoming extends Component {
  state = {
    movies: [],
    loading: true,
    error: false,
    newMovies:[]
  };

  async componentDidMount() {
    // try {
    //   const movies = await movieAPI.getUpcoming();
    //   this.setState({ movies, loading: false });
    // } catch (err) {
    //   this.setState({ loading: false, error: true });
    // }
    try {
      const movies = await movieAPI.getNowPlaying();
      Promise.all(
        movies.map((movie) => {
          return this.processMovie(movie);
        })
      ).then((newImages) => {
        console.log("this is new image",newImages)
        this.setState({
          movies: movies,
          loading: false,
          newMovies: newImages,
        });

 

       });
     
    } catch (err) {
      console.log('err', err);
      this.setState({ loading: false, error: true });
    }
  }
  async processMovie(movie) {
    try {
      return new Promise(async (resolve, reject) => {
        try {
          const moviePath = `${BASE_POSTER_PATH}/w300${movie.poster_path}`;
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

  render() {
    return (
      <>
        <h1>Upcoming Movies</h1>
        <MovieList
          loading={this.state.loading}
          error={this.state.error}
          movies={this.state.movies}
          newMovies={this.state.newMovies}
        />
      </>
    );
  }
}
