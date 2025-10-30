import React, { useState, useEffect, useMemo } from "react";
import { Link} from "react-router-dom";
import axios from "axios";


// ---------- helpers for Countdown---------
function formatHMS(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}h ${m}m ${s}s`;
}

//ensure sale ends time is in millisecs
function normalizeExpiryMs(v) {
  if (v == null) return NaN;
  if (typeof v === "number") return v < 1e12 ? v * 1000 : v; // seconds → ms
  const t = Date.parse(v); // ISO string support
  return Number.isNaN(t) ? NaN : t;
}


const Countdown = ({ expiry }) => {
  const expiryMs = normalizeExpiryMs(expiry);
  const [remain, setRemain] = useState(
    Number.isFinite(expiryMs) ? Math.max(0, expiryMs - Date.now()) : 0
  );

  useEffect(() => {
    if (!Number.isFinite(expiryMs)) return;
    const tick = () => setRemain(Math.max(0, expiryMs - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiryMs]);

  if (!Number.isFinite(expiryMs) || remain <= 0) return null;
  return <div className="de_countdown">{formatHMS(remain)}</div>;
};

const ExploreItems = () => {
  const [exploreItems, setExploreItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const filterParam = 
      sortBy ==="price_high_to_low" ? "price_high_to_low" :
      sortBy ==="price_low_to_high" ? "price_low_to_high" :
      sortBy ==="likes_high_to_low" ? "likes_high_to_low" : "";


    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore",
          { signal: controller.signal,
            params: filterParam ? { filter: filterParam } : undefined,
           }
        );

        const list = Array.isArray(data) ? data : (data ? Object.values(data) : []);
        if (!cancelled) {
          setExploreItems(list);
          setVisibleCount(Math.min(8, list.length))
        }

      } catch (e) {
        if (axios.isCancel(e)) return
        console.error("Explore Items fetch failed:", e);
        if (!cancelled){
          setExploreItems([]);
          setVisibleCount(0)
        }
      } finally {
        if (!cancelled)
          setLoading(false);
      }
    })();
    return () => {
      cancelled = true
      controller.abort();
    }
  }, [sortBy]);

  const visibleItems = useMemo(() => 
    exploreItems.slice(0, visibleCount), [exploreItems, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 4, exploreItems.length));
  }
  // ---- loading skeleton ----
  if (loading) {
    return (
      <>
        <div>
          <select
            id="filter-items"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Default</option>
            <option value="price_low_to_high">Price, Low to High</option>
            <option value="price_high_to_low">Price, High to Low</option>
            <option value="likes_high_to_low">Most liked</option>
          </select>
        </div>

        <div className="row skeleton-box">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="main_wrapper col-lg-3 col-md-6 col-sm-6 col-xs-12"
            > 
                {/*skeleton: top left */}
              <div className="nft__item">
                <div className="author_list_pp">
                  <div className="ske-avatar ske-shimmer" />
                  <div className="ske-badge ske-shimmer" />
                </div>
                {/* image */}
                <div className="nft__item_wrap">
                  <div className="ske-img ske-shimmer" />
                </div>

                  {/* info */}
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
      </>
    );
  }

  // ---- data state ----
  return (
    <>
      <div>
        <select
          id="filter-items"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>

      {visibleItems.map((item) => (
        <div
          key={item.id}
          className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
          style={{ display: "block", backgroundSize: "cover" }}
        >
          <div className="nft__item">
            {/* avatar */}
            <div className="author_list_pp">
              <Link
                to={`/author/${item.authorId}`}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title={item.title}
              >
                <img className="lazy" src={item.authorImage} alt={item.author} />
                <i className="fa fa-check" />
              </Link>
            </div>

            {/* countdown */}
            <Countdown expiry={item?.expiryDate} />

            {/* image */}
            <div className="nft__item_wrap">
              <div className="nft__item_extra">
                <div className="nft__item_buttons">
                  <button type="button">Buy Now</button>
                  <div className="nft__item_share">
                    <h4>Share</h4>
                    <a href="#" target="_blank" rel="noreferrer">
                      <i className="fa fa-facebook fa-lg" />
                    </a>
                    <a href="#" target="_blank" rel="noreferrer">
                      <i className="fa fa-twitter fa-lg" />
                    </a>
                    <a href="#">
                      <i className="fa fa-envelope fa-lg" />
                    </a>
                  </div>
                </div>
              </div>
              <Link to={`/item-details/${item.nftId}`}>
                <img
                  src={item.nftImage}
                  className="lazy nft__item_preview"
                  alt={item.title}
                />
              </Link>
            </div>

            {/* info */}
            <div className="nft__item_info">
              <Link to="/item-details">
                <h4>{item?.title}</h4>
              </Link>
              <div className="nft__item_price">{item?.price} ETH</div>
              <div className="nft__item_like">
                <i className="fa fa-heart" />
                <span>{item?.likes}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      {visibleCount < exploreItems.length && (
        <div className="col-md-12 text-center">
          <Link to="" id="loadmore" className="btn-main lead" onClick={handleLoadMore} type="button">
            Load more 
          </Link>
        </div>
      )}
    </>
  );
};

export default ExploreItems;