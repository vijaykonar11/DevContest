import React from "react";
import '../styles/priceCard.css';

const PriceCard=()=>{
    return(
        <div className="py-5">

          <div className="Price-container">
            <h2 className="title">Unlock Exclusive <br/> Membership</h2>
            {/* <h3 className="price">$1.29<span>per visit</span></h3> */}
            <p className="description">Gain exclusive access to our premium Voice to Text converter. Enjoy high-quality Audio and PDF files on your preferred devices.</p>
            <b className="offer">Act fast! Offer ends on September 20, 2024.</b>
            <a className="subscribe-button" href="#">Subscribe Now</a>
            <div className="ribbon-wrap">
              <div className="ribbon">Special Offer!</div>
            </div>
          </div>

        </div>
    )
}

export default PriceCard;