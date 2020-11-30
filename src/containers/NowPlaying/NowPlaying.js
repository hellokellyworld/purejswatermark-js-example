import React, { Component } from 'react';
import MovieList from '../../components/Movie/MovieList';
import * as movieAPI from '../../services/movieAPI';
import './NowPlaying.scss';

import { BASE_POSTER_PATH } from '../../constants/Constants';

//const logo2="https://image.shutterstock.com/z/stock-vector-logo-progress-man-icon-element-template-design-logos-374709982.jpg"

const logo = '/logo192.png';
const watermark = require('../../lib-watermark/dist/watermark/index.js');

    //jpeg


  

export default class NowPlaying extends Component {
  state = {
    movies: [],
    loading: true,
    error: false,
    newMovies:[],
    imageWithText:null,
  };

  async test(){
    const imageWithText = await watermark.addTextWatermark(
      "/2.jpeg",
      {text: "Kelly Kang", textSize: 8}
    );
    this.setState({imageWithText:imageWithText})
  }

  async componentDidMount() {
    try {this.test()} 
    catch(error){console.log(error)}
    try {
      const movies = await movieAPI.getNowPlaying();

      Promise.all(
        movies.map((movie) => {
          return this.processMovie(movie);
        })
      ).then((newImages) => {
        
        this.setState({
          movies: movies,
          loading: false,
          newMovies: newImages,
        });

    //   this.setState(prevState => ({
    //     movies: {                   // object that we want to update
    //         ...prevState.movies,    // keep all other key-value pairs
    //         poster_path: newImages      // update the value of specific key
    //     }
    // }))
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
          throw new Error('can not get watermark image');
        }
      }).then((data) => {
        return Promise.resolve(data);
      });
    } catch (err) {
      console.log('error getting watermark', err);
    }
  }

  
  render() {
    if (!this.state.loading && this.state.newMovies.length > 0) {
      //console.log('this is newMovies:', this.state.newMovies[0]);
    }
    //console.log("state movie",this.state.movies)
    
    return (
      <>
        <h1 className="now-playing-title">Movies In Theaters Now</h1>
        <MovieList loading={this.state.loading} error={this.state.error} movies={this.state.movies}
        
        newMovies={this.state.newMovies}/>
        {/* <img src={this.state.imageWithText} alt="text"/> */}
        
        {!this.state.loading &&
          this.state.newMovies &&
          this.state.newMovies.map((newMovie, index) => {
            //console.log("thiis new movie", newMovie)
            //return <img src={newMovie} key={index}></img>;
            return <img src={this.state.imageWithText} alt="text"/>
          })}
      </>
    );
  }
}
