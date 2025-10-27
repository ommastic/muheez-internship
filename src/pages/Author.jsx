import React, { useState, useEffect, useMemo, useCallback } from "react";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import { Link, useParams } from "react-router-dom";
import axios from "axios";


const Author = () => {
  const { authorId } = useParams();

  const [author, setAuthor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [followers, setFollowers] = useState({})

  const copyMessage = (message) => navigator.clipboard.writeText(message).catch(() => { })

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
            params: authorId ? { id: authorId } : {},
          }
        );
        const list = Array.isArray(data) ? data : Object.values(data || {})

        //if authorId provided, pick the matching author, otherwise keep the result
        const result = authorId ? list.find((a) => String(a.id) === String(authorId)) || null
          : (list && list.length ? list[0] : null);

        if (!cancelled)
          setAuthor(result)
      } catch (e) {
        if (axios.isCancel(e))
          return
        console.error("Author fetch failed", e)
        if (!cancelled)
          setAuthor(null);

      } finally {
        if (!cancelled)
          setLoading(false)
      }
    })()
    return () => {
      cancelled = true;
      controller.abort();
    }
  }, [authorId])

  const isFollowing = useMemo(() => {
    if (!author)
      return false;
    return followers[author.id] != null;
  }, [author, followers])

  const followerCount = useMemo(() => {
    if (!author)
      return 0;
    return followers[author.id] ?? author.followers
  }, [author, followers])

  const follow = useCallback(item => {
    setFollowers(follow => (
      { ...follow, [item.id]: (follow[item.id] ?? item.followers) + 1 }))
  }, [setFollowers])

  const unfollow = useCallback(item => {
    setFollowers(follow => {
      const { [item.id]: _ignore, ...rest } = follow
      return rest
    })
  }, [setFollowers])

  const AuthorSkeleton = () => (
    <section aria-label="section">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="d_profile de-flex">
              <div className="de-flex-col">
                <div className="profile_avatar">
                  <div className="ske-avatar ske-shimmer" />
                  <div className="profile_name">
                    <h4>
                      <div className="ske-line ske-shimmer" />
                      <span className="profile_username">
                        <div className="ske-line ske-shimmer" />
                      </span>
                      <span id="wallet" className="profile_wallet">
                        <div className="ske-line ske-shimmer" />
                      </span>
                      <div className="ske-btn ske-shimmer" />
                    </h4>
                  </div>
                </div>
              </div>
              <div className="profile_follow de-flex">
                <div className="de-flex-col">
                  <div className="ske-line ske-shimmer" />
                  <div className="ske-btn ske-shimmer" />
                </div>
              </div>
            </div>
          </div>

          {/* Fake grid of author items */}
          <div className="col-md-12 mt-4">
            <div className="row">
              {[...Array(4)].map((_, i) => (
                <div className="col-md-3 mb-3" key={i}>
                  <div className="ske-card ske-shimmer" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          data-bgimage="url(images/author_banner.jpg) top"
          style={{ backgroundImage: `url(${AuthorBanner}) top` }}
        />

        {

          loading ? <AuthorSkeleton />

            : (

              <section aria-label="section" key={author.id}>
                <div className="container">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="d_profile de-flex">
                        <div className="de-flex-col">
                          <div className="profile_avatar">
                            <img src={author.authorImage} alt="" />

                            <i className="fa fa-check"></i>
                            <div className="profile_name">
                              <h4>
                                {author.authorName}
                                <span className="profile_username">@{author.tag}</span>
                                <span id="wallet" className="profile_wallet">
                                  {author.address}
                                </span>
                                <button id="btn_copy" title="Copy Text" onClick={() => copyMessage(author.address)}>
                                  Copy
                                </button>
                              </h4>
                            </div>
                          </div>
                        </div>
                        <div className="profile_follow de-flex">
                          <div className="de-flex-col">
                            <div className="profile_follower">({followerCount}) followers</div>
                            <Link to="#" className="btn-main" onClick={isFollowing ? unfollow(author) : follow(author)}>
                              {isFollowing ? "unfollow" : "follow"}
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
            )}
      </div>
    </div >
  );
};

export default Author;
