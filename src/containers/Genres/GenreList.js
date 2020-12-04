import React, { Component } from 'react';
import { withLastLocation } from 'react-router-last-location';
import { Breakpoint } from 'react-socks';
import MovieList from '../../components/Movie/MovieList';
import * as movieAPI from '../../services/movieAPI';
import './Genres.scss';
import { BASE_POSTER_PATH } from '../../constants/Constants';
import watermark from 'purejswatermark/dist/watermark';
const logo = '/logo192.png';
class GenreList extends Component {
  state = {
    movies: [],
    loading: true,
    error: false,
    newMovies:[]
  };

  async componentDidMount() {

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
    const { movies, loading, error, newMovies } = this.state;

    let movieGenreInfo;
    let info;

    if (error) {
      info = (
        <h3>
          Woops, something went wrong trying to fetch movies of this genre.
        </h3>
      );
    }

    if (loading) {
      info = <h3>Loading movies of this genre now...</h3>;
    }

    if (movies.length > 0 && !loading) {
      movieGenreInfo = (
        <MovieList loading={loading} error={error} movies={movies} newMovies = {newMovies} />
      );
    }

    return (
      <>
        <div
          className="genre-search-title"
          onClick={() => this.props.history.push('/genres')}
        >
          <Breakpoint medium up>
            <div>
              <i className="fa fa-chevron-left" aria-hidden="true" />
              <p>Back to Genres</p>
            </div>
            <h1>{this.props.match.params.genreName} Movies</h1>
          </Breakpoint>
          <Breakpoint small down>
            <i className="fa fa-chevron-left" aria-hidden="true" />
            <h1>{this.props.match.params.genreName}</h1>
          </Breakpoint>
        </div>
        {info && <div className="genre-search-info">{info}</div>}
        {movieGenreInfo}
      </>
    );
  }
}

export default withLastLocation(GenreList);
