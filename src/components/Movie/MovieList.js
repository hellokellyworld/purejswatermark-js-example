import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Breakpoint } from 'react-socks';
import Movie from './Movie';
import Card from '../Card/Card';
import './MovieList.scss';

export default class MovieList extends Component {
  state = {
    id: null,
    movieDetails: false,
  };

  selectedMovieHandler = movieId => {
    if (movieId !== null) {
      this.setState({ id: movieId, movieDetails: true });
    }
  };

  renderRedirect = () => {
    if (this.state.movieDetails) {
      return <Redirect to={`/movie/${this.state.id}`} />;
    }
  };

  render() {
    const { error, loading, movies, newMovies } = this.props;
    let movieInfo = null;

    if (!loading && !error && movies.length > 0) {
      movieInfo = movies.map((movie, index) => {
        //console.log("poster path.........",movie.poster_path)
        return (
          <Card
            key={movie.id}
            movieId={movie.id}
            goToMovieDetails={this.selectedMovieHandler}
          >
            <Movie
              title={movie.title}
              overview={movie.overview}
              poster={newMovies[index]}
              released={movie.release_date}
            />
          </Card>
        );
      });
    }

    if (error) {
      movieInfo = (
        <h3>
          Woops, something went wrong trying to fetch movies in theaters now.
        </h3>
      );
    }

    if (loading) {
      movieInfo = <h3>Loading movie data now...</h3>;
    }

    console.log("this is movie info", movieInfo)
    return (
      <>
        <Breakpoint medium up>
          <div className="movie-list">
            {this.renderRedirect()}
            {movieInfo}
          </div>
        </Breakpoint>
        <Breakpoint small down>
          <div className="movie-list-mobile">
            {this.renderRedirect()}
            {movieInfo}
          </div>
        </Breakpoint>
      </>
    );
  }
}
