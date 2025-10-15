import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import OwlCarousel from "react-owl-carousel"
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const HotCollections = () => {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections",
          { signal: controller.signal }
        )
        const list = Array.isArray(data) ? data : Object.values(data || {})
        setCollections(list)
      } catch (e) {
        if (!axios.isCancel(e)) {
          console.error("hot collection fetch failed: ", e)
          setCollections([])
        }
      } finally {
        setLoading(false)
      }
    })();
    return () => controller.abort();
  }, [])

  const owlOptions = useMemo(() => ({
    loop: true,
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
      1200: { items: 4 },
    },
  }), [])

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="col-lg-12">
          <div className="text-center">
            <h2>Hot Collections</h2>
            <div className="small-border bg-color-2" />
          </div>
        </div>

        <div className="relative">
          {loading ? (
            // Skeletons
            <div className="skeleton-box">
              {[...Array(4)].map((_, i) => (
                <div className="card" key={i}>
                  <div className="nft_coll">
                    <div className="nft_wrap">
                      <div className="img shimmer" />
                    </div>

                    <div className="nft_coll_pp">
                      <div className="avatar shimmer" />
                      <div className="badge shimmer" />
                    </div>

                    <div className="nft_coll_info">
                      <div className="title shimmer" />
                      <div className="sub shimmer" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Real slider
            <OwlCarousel className="owl-theme" {...owlOptions}>
              {collections.map((item) => (
                <div className="nft_coll" key={item.id}>
                  <div className="nft_wrap">
                    <Link to="/item-details">
                      <img
                        src={item.nftImage}
                        className="lazy img-fluid"
                        alt={item.title}
                      />
                    </Link>
                  </div>

                  <div className="nft_coll_pp">
                    <Link to="/author">
                      <img className="lazy pp-coll" src={item.authorImage} alt="" />
                    </Link>
                    <i className="fa fa-check" />
                  </div>

                  <div className="nft_coll_info">
                    <Link to="/explore">
                      <h4>{item.title}</h4>
                    </Link>
                    <span>ERC-{item.code}</span>
                  </div>
                </div>
              ))}
            </OwlCarousel>
          )}
        </div>
      </div>
    </section>
  );
}

export default HotCollections;
