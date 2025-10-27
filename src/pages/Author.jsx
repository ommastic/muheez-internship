import React, { useState, useEffect, useMemo } from "react";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import { Link } from "react-router-dom";
import AuthorImage from "../images/author_thumbnail.jpg";
import axios from "axios";
import { useParams } from "react-router-dom"

const Author = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    let controller = new AbortController();
    let cancelled = false;

      (async () => {
        try {
          setLoading(true)
          const { data } = await axios.get(
            "https://us-central1-nft-cloud-functions.cloudfunctions.net/authors",
            { 
              signal: controller.signal,
              params: authorId ? { id: authorId } : {}
             }
          );
          const list = Array.isArray(data) ? data : object.values( data || {})

          //if authorId provided, pick the matching author, otherwise keep the result
          const result = authorId ? list.find((a) => String(a.id) === String(authorId)) || null
          : list;

          if (!cancelled)
            setAuthor(list)
        } catch(e){
          if (axios.isCancel(e))
            return
          console.error("Author fetch failed", e)
          if (!cancelled){
          setAuthor(authorId ? null : []);
          }
        }finally{
          if (!cancelled)
            setLoading(false)
        }
    })()
    return () => {
      cancelled = true;
      controller.abort();
    }
  }, [authorId])

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          data-bgimage="url(images/author_banner.jpg) top"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      <img src={AuthorImage} alt="" />

                      <i className="fa fa-check"></i>
                      <div className="profile_name">
                        <h4>
                          Monica Lucas
                          <span className="profile_username">@monicaaaa</span>
                          <span id="wallet" className="profile_wallet">
                            UDHUHWudhwd78wdt7edb32uidbwyuidhg7wUHIFUHWewiqdj87dy7
                          </span>
                          <button id="btn_copy" title="Copy Text">
                            Copy
                          </button>
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      <div className="profile_follower">573 followers</div>
                      <Link to="#" className="btn-main">
                        Follow
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <AuthorItems />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
