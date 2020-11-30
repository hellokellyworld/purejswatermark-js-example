import React from 'react';
import { Breakpoint } from 'react-socks';
import { BASE_POSTER_PATH } from '../../constants/Constants';
import './MovieList.scss';


//var watermark = require("../../lib-watermark/dist/watermark/index.js");
         
const movie = props => {
  // const imgPath=`${BASE_POSTER_PATH}/w300${props.poster}`;
  // const imageWithText = await watermark.addTextWatermark(
  //   imgPath,
  //   {text: "Kelly Kang", textSize: 8}
  // );

  // if(imageWithText){
  return(
  <>
    <Breakpoint medium up>
      <div className="movie-component">
        {props.poster && (
          <img
            src={props.poster}
            // src={`${BASE_POSTER_PATH}/w300${props.poster}`}//{imageWithText}//{`${BASE_POSTER_PATH}/w300${props.poster}`}
            
            alt="movie poster"
            className="movie-poster"
          />
        )}
        <div className="movie-details">
          <h1 className="movie-title">{props.title}</h1>
          <p className="movie-overview">
            <strong>Synopsis:</strong> {props.overview}
          </p>
          <p className="movie-released">
            <strong>Release Date:</strong> {props.released}
          </p>
        </div>
      </div>
    </Breakpoint>
    <Breakpoint small down>
      <div className="movie-component-mobile">
        <h1 className="movie-title">{props.title}</h1>
        {props.poster && (
          <img
            src={props.poster}
            // src={`${BASE_POSTER_PATH}/w300${props.poster}`}//{imageWithText}//{`${BASE_POSTER_PATH}/w300${props.poster}`}
            alt="movie poster"
            className="movie-poster"
          />
        )}
        <div className="movie-details">
          <p className="movie-overview">
            <strong>Synopsis:</strong> {props.overview}
          </p>
          <p className="movie-released">
            <strong>Release Date:</strong> {props.released}
          </p>
        </div>
      </div>
    </Breakpoint>
  </>
  )
  // } else{
  //   return <></>
  // }
        };

export default movie;
