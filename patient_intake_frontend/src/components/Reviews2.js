import React from 'react';
import '../styles/Reviews2.css'

const emojis = [
  ["🐳", "Jhon Doe", "Amazing product! It has revolutionized our workflow."],
  ["🐋", "Dr. LK Mishra", "Incredible AI technology, highly recommend!"],
  ["🐬", "Neha Gupta", "This has made documentation so much easier."],
  ["🐟", "Naveen Varshney", "Speech to text conversion works good."],
  ["🐠", "Mr. PK Sharma", "Amazing product! It has revolutionized our workflow."],
  ["🐡", "Mrs. Nandini Varshney", "I highly recommend it, it has eased the work of documentation."],
  ["🦈", "Miss Deeksha Chaudhary", "Speech to text conversion works good."],
  ["🐙", "Mr. Deepak Singhal", "Incredible AI technology, highly recommend!"],
  ["🐚", "Miss Divya", "I would like to continue using this service in future, and hope there will be more enhancement in the app!"]
];

const EmojiCarousel = () => {
  return (

    <section>
      <div className='container'>
        <div className='row'>
          <div className='col-xl-12'>
            <h1 className=" text-center fw-medium mb-6 montserrat-top-text">What Clients Say About Us</h1>
            <div className="wrapper">
              <div className="carousel">
                {emojis.map((emoji, index) => (
                  <div key={index} className="carousel__item montserrat-top-text">
                    <div className="carousel__item-head">{emoji[0]}</div>
                    <div className="carousel__item-body">
                      <p className="title fs-4 fw-semibold">{emoji[1]}</p>
                      <p className='fs-5'>{emoji[2]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>

  );
}

export default EmojiCarousel;
