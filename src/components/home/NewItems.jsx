import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios"
import OwlCarousel from "react-owl-carousel"
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";

const NewItems = () => {
  const [newItems, setNewItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems",
          { signal: controller.signal }
        );
        const list = Array.isArray(data) ? data : Object.values(data || {})
        setNewItems(list)
      } catch (e) {
        if (axios.isCancel(e)) {
          return
        }
        console.error("New Items fetch failed: ", e)
        setNewItems([])
      }
      finally {
        setLoading(false)
      }
    })();
    return () => controller.abort()
  }, [])

  const owlOptions = useMemo(() => ({
    loop: true,
    items: 4,
    nav: true,
    dots: false,
    smartSpeed: 500,
    margin: 16,
    slideBy: 1,
    mouseDrag: true,
    touchDrag: true,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      992: { items: 3 },
      1100: { items: 4 },
    },
  }), [])

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          {loading ? (
            <div className="skeleton-box">
              {[...Array(4)].map((_, i) => (
                <div className="card" key={i}>
                  <div className="nft__item" />
                  <div className="de_countdown">

                    {/* avatar + verify badge */}
                    <div className="author_list_pp">
                      <div className="ske-avatar ske-shimmer" />
                      <div className="ske-badge ske-shimmer" />
                    </div>

                    {/* image placeholder */}
                    <div className="nft__item_wrap">
                      <div className="ske-img ske-shimmer" />
                    </div>

                    {/* info area */}
                    <div className="nft__item_info">
                      <div className="ske-title ske-shimmer" />
                      <div className="ske-row">
                        <div className="ske-price ske-shimmer" />
                        <div className="ske-like">
                          <div className="ske-like-dot ske-shimmer" />
                          <div className="ske-like-bar ske-shimmer" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <OwlCarousel className="owl-theme" {...owlOptions}>
              {newItems.map(item => (
                <div className="nft_coll" key={item.id}>
                  <div className="nft__item">
                    <div className="author_list_pp">
                      <Link
                        to="/author"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title={item.title}
                      >
                        <img className="lazy" src={item.authorImage} alt="" />
                        <i className="fa fa-check"></i>
                      </Link>
                    </div>
                    <div className="de_countdown">{item.expiryDate}</div>

                    <div className="nft__item_wrap">
                      <div className="nft__item_extra">
                        <div className="nft__item_buttons">
                          <button>Buy Now</button>
                          <div className="nft__item_share">
                            <h4>Share</h4>
                            <a href="" target="_blank" rel="noreferrer">
                              <i className="fa fa-facebook fa-lg"></i>
                            </a>
                            <a href="" target="_blank" rel="noreferrer">
                              <i className="fa fa-twitter fa-lg"></i>
                            </a>
                            <a href="">
                              <i className="fa fa-envelope fa-lg"></i>
                            </a>
                          </div>
                        </div>
                      </div>

                      <Link to="/item-details">
                        <img
                          src={item.nftImage}
                          className="lazy nft__item_preview"
                          alt=""
                        />
                      </Link>
                    </div>
                    <div className="nft__item_info">
                      <Link to="/item-details">
                        <h4>{item.title}</h4>
                      </Link>
                      <div className="nft__item_price">{item.price}</div>
                      <div className="nft__item_like">
                        <i className="fa fa-heart"></i>
                        <span>{item.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </OwlCarousel>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewItems;
