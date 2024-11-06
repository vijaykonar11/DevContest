import React from "react";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styles/Reviews.css";
import img1 from "../styles/reviewbg1.jpg";
import img2 from "../styles/reviewbg2.jpg";
import img3 from "../styles/reviewbg3.jpg";

const Reviews = () => {
  const reviews = [
    {
      image: img1,
      text: "Amazing product! It has revolutionized our workflow."
    },
    {
      image: img2,
      text: "Incredible AI technology, highly recommend!"
    },
    {
      image: img3,
      text: "This has made documentation so much easier."
    },
    {
      image: img2,
      text: "Incredible AI technology, highly recommend!"
    },
    {
      image: img3,
      text: "I highly recommend it, it has eased the work of documentation."
    },
    {
      image: img1,
      text: "Speech to text conversion works good."
    },
    {
      image: img3,
      text: "This has made documentation so much easier."
    },
  ];

  return (
    <div className="wrapper">
      <Carousel showThumbs={false} infiniteLoop={true} useKeyboardArrows={true}>
        {reviews.map((review, index) => (
          <div key={index} className="item" style={{ backgroundImage: `url(${review.image})` }}>
            <div className="review-text">{review.text}</div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Reviews;
