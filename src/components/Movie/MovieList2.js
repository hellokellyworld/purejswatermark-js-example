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
    errors:this.initializeError()

  };

  
  selectedMovieHandler = movieId => {
    if (movieId !== null) {
      this.setState({ id: movieId, movieDetails: true });
    }
  };

  initializeError() {
		return {
			textContent: "have error now",
		};
  }
  

  renderRedirect = () => {
    if (this.state.movieDetails) {
      return <Redirect to={`/movie/${this.state.id}`} />;
    }
  };

  async componentDidMount(){
   
    
  }

  async shouldComponentUpdate(){
   
  }

 render() {
    const { error, loading, newMovies} = this.props;
    let movieInfo = null;
    if (!loading && !error  &&  newMovies.length>0) {
      movieInfo = newMovies.map( ( newMovie,index) => {            
        return (
          <Card
            key={newMovie.movie.id}
            movieId={newMovie.movie.id}
            goToMovieDetails={this.selectedMovieHandler}
          >
            <Movie
              title={newMovie.movie.title}
              overview={newMovie.movie.overview}
              poster={newMovie.imageData}
              released={newMovie.movie.release_date}
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
        <div>
          {this.state.errors.textContent}
        </div>
      </>
     )
  }
}
