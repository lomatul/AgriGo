import React from "react";
import "./Featured.scss";

function Featured() {
  return (
    <div className="featured">
      <div className="container">
      {/* <video src="./img/bk.mp4"  autoPlay  ></video>
       */}
       {/* <div className="background">
       <img src="./img/backpic.jpg" alt="" />
       </div> */}
          <div className="left">
          <h1>
            Find the perfect services at your Doorstep
          </h1>
          <div className="search">
            <div className="searchInput">
              <img src="./img/search.png" alt="" />
              <input type="text" placeholder='Search Anything ' />
            </div>
            <button>Search</button>
          </div>
          <div className="popular">
            <span>Popular:</span>
            <button>Selling</button>
            <button>Bidding</button>
            <button>Vegetables</button>
            <button>Fresh</button>
            <button>Delivery services</button>
          </div>
        </div>
        
      </div>
      
    </div>
  );
}

export default Featured;
