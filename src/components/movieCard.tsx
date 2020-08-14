import React, { useState } from 'react';
import TheMovieDb from '../themoviedb';
import './movieCard.scss';
import Star from '../assets/star.svg';
import { IMovie } from '../types';

type IProps = {
  bgImage: IMovie['backdrop_path']
  title: IMovie['title']
  date: IMovie['release_date']
  poster?: boolean
  minimal?: boolean
  canLike?: boolean
  isLiked?: boolean
  onLike?: () => void
}
export default function MovieCard(props: IProps) {
  const [clicked, setClicked] = useState<boolean>(false);
  
  const w300 = TheMovieDb.getSizeClosest(300);
  const date = (props.date) ? new Date(props.date) : undefined;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div
      className={`
        MovieCard
        ${(props.poster) ? 'poster' : ''}
        ${(props.minimal) ? 'minimal' : ''}`}>

      <div
        style={{backgroundImage: (props.bgImage) ? `url('${TheMovieDb.getImage(w300, props.bgImage)}')` : undefined }}>

        {(props.canLike) &&
        <img
          src={Star} alt='Star'
          className={`
            ${(clicked) ? 'clicked' : ''}
            ${(props.isLiked) ? 'liked' : ''}`}
          onClick={starAnimationHandler} />}

        {(date) &&
        <span>{`${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`}</span>}

        <span>{props.title}</span>
      </div>
    </div>
  )

  /**
   * @description
   * Handles star animation then calling `onClik`
   */
  function starAnimationHandler() {
    setClicked(true);
    
    setTimeout(() => {
      setClicked(false);
      if (props.onLike) props.onLike();
    }, 500);
  }
}