import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import EthImage from "../images/ethereum.svg";
import axios from "axios";

const ItemDetails = () => {
  const { nftId } = useParams()
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!nftId)
      return

    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${nftId}`,
        );
        setDetails(data)
      } catch (e) {
        if (axios.isCancel(e))
          return
        console.error("Item details fetch failed:", e);
        setDetails(null);
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [nftId]);

  return (
    // skeleton
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        {loading ? (

          <section aria-label="section" className="mt90 sm-mt-0 itemdetails-skeleton">
            <div className="container">
              <div className="row main-class">
                {/* left NFT image */}
                <div className="col col-md-6 fte-ske" >
                  <div className="ske ske-media ske-shimmer" />
                </div>

                {/* Right side */}
                <div className="col col-md-6 header-ske">

                  <div className="title-bar ske-shimmer ske" />

                  <div className="col-right">
                    <div className="ske ske-line ske-line-lg ske-shimmer" />
                  </div>

                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <div className="ske-chip" />
                    </div>
                    <div className="item_info_like">
                      <div className="ske-chip" />
                    </div>
                  </div>

                  <div>
                    <div className="ske message-block ske-shimmer" />
                  </div>

                  <div className="spacer-20"></div>
                  <h6>Owner</h6>
                  <div className="item_author">
                    <div className="ske ske-avatar ske-shimmer" />
                      <div className="ske ske-line ske-shimmer" />
                  </div>

                <div className="spacer-20"></div>
                <h6>Creator</h6>
                <div className="item_author">
                  <div className="ske ske-avatar ske-shimmer" />
                  <div className="ske ske-line ske-shimmer" />
                </div>

                <div className="spacer-40"></div>
                {/* price */}
                <h6>Price</h6>
                <div className="nft-item-price">
                  <div className="ske ske-icon ske-shimmer" />
                  <div className="ske ske-line ske-shimmer" />
                </div>
              </div>
            </div>
          </div>
          </section>

      ) : details ? (

      <section aria-label="section" className="mt90 sm-mt-0">
        <div className="container">
          <div className="row">

            <div className="col-md-6 text-center">
              <img
                src={details.nftImage}
                className="img-fluid img-rounded mb-sm-30 nft-image"
                alt=""
              />
            </div>
            <div className="col-md-6">
              <div className="item_info">
                <h2>{details.title}</h2>

                <div className="item_info_counts">
                  <div className="item_info_views">
                    <i className="fa fa-eye"></i>
                    {details.views}
                  </div>
                  <div className="item_info_like">
                    <i className="fa fa-heart"></i>
                    {details.likes}
                  </div>
                </div>
                <p>
                  {details.description}
                </p>
                <div className="d-flex flex-row">
                  <div className="mr40">
                    <h6>Owner</h6>
                    <div className="item_author">
                      <div className="author_list_pp">
                        <Link to={`/author/${details.ownerId}`}>
                          <img className="lazy" src={details.ownerImage} alt={details.ownerName} />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>
                      <div className="author_list_info">
                        <Link to={`/author/${details.ownerId}`}>{details.ownerName}</Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="de_tab tab_simple">
                  <div className="de_tab_content">
                    <h6>Creator</h6>
                    <div className="item_author">
                      <div className="author_list_pp">
                        <Link to={`/author/${details.ownerId}`}>
                          <img className="lazy" src={details.creatorImage} alt={details.creatorName} />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>
                      <div className="author_list_info">
                        <Link to={`/author/${details.ownerId}`}>{details.creatorName}</Link>
                      </div>
                    </div>
                  </div>
                  <div className="spacer-40"></div>
                  <h6>Price</h6>
                  <div className="nft-item-price">
                    <img src={EthImage} alt="" />
                    <span>{details.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        ) : null}
    </div>
    </div >
  )
};



export default ItemDetails;
