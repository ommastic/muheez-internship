import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";


const AuthorItems = () => {
  const { authorId } = useParams();
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authorId)
      return;

    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author="${authorId}`,
        );
        setItems(data)

      } catch (e) {
        if (!axios.isCancel(e))
          console.error("Author items fetch failed", e)
        setItems([]);

      } finally {
        setLoading(false)
      }
    })()

    return () => controller.abort();
  }, [authorId])

  if (loading) {
    return (
      <div className="row">
        {[...Array(8)].map((_, i) => (
          <div className="col-lg-3 col-md-6 col-xs-12" key={i}>
            <div className="nft__item skeleton" />
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {items.nftCollection.map(item => (
            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={item.id}>
              <div className="nft__item">
                <div className="author_list_pp">
                  <Link to="/author">
                    <img className="lazy" src={items.authorImage} alt="" />
                    <i className="fa fa-check"></i>
                  </Link>
                </div>
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
                        <a href="#">
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
                  <div className="nft__item_price">{item.price} ETH</div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>{item.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AuthorItems;
