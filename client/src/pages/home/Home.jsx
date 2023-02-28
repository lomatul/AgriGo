import React from "react";
import "./Home.scss";
import Featured from "../../components/featured/Featured";
import Slide from "../../components/slide/Slide";
import CatCard from "../../components/catCard/CatCard";
import ProjectCard from "../../components/projectCard/ProjectCard";
import { cards, projects } from "../../data";

function Home() {
  return (
    <div className="home">
      <Featured />
      <Slide slidesToShow={5} arrowsScroll={5}>
        {cards.map((card) => (
          <CatCard key={card.id} card={card} />
        ))}
      </Slide>
      <div className="features">
        <div className="container">
          <div className="item">
            <h1>A whole world of fresh Products at your fingertips</h1>
            <div className="title">
              <img src="https://cdn-icons-png.flaticon.com/128/190/190411.png" alt="" />
              The best for every budget
            </div>
            <p>
              Find high-quality services at every price point. No hourly rates,
              just product-based pricing.
            </p>
            <div className="title1">
              <img src="https://cdn-icons-png.flaticon.com/128/190/190411.png" alt="" />
              Quality work done quickly
            </div>
            <p1>
              Find the right seller/buyer to begin  on your products within
              minutes.
            </p1>
            <div className="title">
              <img src="https://cdn-icons-png.flaticon.com/128/190/190411.png" alt="" />
              Protected payments, every time
            </div>
            <p>
              Always know what you'll pay upfront. Your payment isn't released
              until you approve the work.
            </p>
            <div className="title1">
              <img src="https://cdn-icons-png.flaticon.com/128/190/190411.png" alt="" />
              24/7 support
            </div>
            <p1>
              Find high-quality services at every price point. No hourly rates,
              just product-based pricing.
            </p1>
          </div>
          <div className="item">
            <video src="./img/bk.mp4" controls />
          </div>
        </div>
      </div>
      <div className="explore">
        <div className="container">
          <h1>We Provide</h1>
          <div className="items">
          
          <div className="item">
              <img
                src="https://cdn-icons-png.flaticon.com/512/9362/9362306.png"
                alt=""
              />
              <div className="line"></div>

              <span>Digital Marketing</span>
            </div>
           
        
            <div className="item">
              <img
                src="https://cdn-icons-png.flaticon.com/128/3135/3135727.png"
                alt=""
              />
              <div className="line"></div>
              <span>Business</span>
            </div>
            <div className="item">
              <img
                src="https://cdn-icons-png.flaticon.com/128/4852/4852363.png"
                alt=""
              />
              <div className="line"></div>
              <span>Lifestyle</span>
            </div>
            <div className="item">
              <img
                src="https://cdn-icons-png.flaticon.com/128/1019/1019607.png"
                alt=""
              />
              <div className="line"></div>

              <span>Secured Payment</span>
            </div>
           
        
            <div className="item">
              <img
                src="https://cdn-icons-png.flaticon.com/128/2153/2153786.png"
                alt=""
              />
              <div className="line"></div>
              <span>Fresh Products</span>
            </div>
            <div className="item">
              <img
                src="https://cdn-icons-png.flaticon.com/128/870/870130.png"
                alt=""
              />
              <div className="line"></div>
              <span>Fast Delivery</span>
            </div>
            <div className="item">
              <img
                src="https://cdn-icons-png.flaticon.com/128/921/921347.png"
                alt=""
              />
              <div className="line"></div>
              <span>Authenticated Buyer and Seller</span>
            </div>
            <div className="item">
              <img
                src="https://cdn-icons-png.flaticon.com/128/2854/2854320.png"
                alt=""
              />
              <div className="line"></div>
              <span>Best Price</span>
            </div>
            <div className="item">
              <img
                src="https://cdn-icons-png.flaticon.com/128/3882/3882227.png"
                alt=""
              />
              <div className="line"></div>
              <span>Refund</span>
            </div>
      
            
          </div>
        </div>
      </div>
      <div className="features dark">
        <div className="container">
          <div className="item">
            <h1>
              About AgriGo
            </h1>
            <h1>
              A business solution designed for Sellers
            </h1>
            <h1>
              A Satisfy solution designed for Customers
            </h1>
            <p>
              Upgrade to a curated experience packed with tools and benefits,
              dedicated to businesses.Upgrade to a curated experience packed with tools and benefits,
              dedicated to businesses.Upgrade to a curated experience packed with tools and benefits,
              dedicated to businesses.Upgrade to a curated experience packed with tools and benefits,
              dedicated to businesses
            </p>
            
            <button>Explore AgriGo</button>
          </div>
          <div className="item">
            <img
              src="public\img\agrigo.jpg"
              alt=""
            />
          </div>
        </div>
      </div>

      <div className="explore1">
      <div className="container1">
          <h1>Explore the Reviews</h1>
          </div>
          </div>

    

      <Slide slidesToShow={4} arrowsScroll={4}>
        {projects.map((card) => (
          <ProjectCard key={card.id} card={card} />
        ))}
      </Slide>
    </div>
  );
}

export default Home;
