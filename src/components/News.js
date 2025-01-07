import React, {useEffect,useState} from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News=(props)=> {
 
  const [articles,setArticles]=useState([])
  const [loading,setLoading]=useState(true)
  const [page,setPage]=useState(1)
  const [totalResults,setTotalResult]=useState(0)
 
  const capitalizeFirstLetter = (val) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  };
  document.title = `${capitalizeFirstLetter(
    props.category
  )}- News`;
  const updateNews=async()=> {
    console.log("cdm");
    props.setProgress(20);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=a87748420d2d42f2b2c4cdad8c248b8f&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    props.setProgress(50);
    let data = await fetch(url);
    let parseData = await data.json();
    props.setProgress(80);
    setArticles(parseData.articles);
    setTotalResult(parseData.totalResults);
    setLoading(false);
    props.setProgress(100);
  }
useEffect(()=>{
  updateNews();  
},[]);

  const fetchMoreData = async () => {
    setPage(page+1)
   
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=a87748420d2d42f2b2c4cdad8c248b8f&page=${page}&pageSize=${props.pageSize}`;
    let data = await fetch(url);
    let parseData = await data.json();
    setArticles(articles.concat(parseData.articles))
    setTotalResult(parseData.totalResults)
  };
   
    return (
      <>
        <h2 className="text-center" style={{ margin: "35px 0px" }}>
           News - Top {capitalizeFirstLetter(props.category)}{" "}
          Headlines{" "}
        </h2>
        {loading && <Spinner/>}  {/* && it evaluates left expresssion if it is true it rreturns the expression on the right side. If the left side is false (or falsy), it short-circuits and returns the left side without evaluating the right side. */}
        <InfiniteScroll
          dataLength={articles?.length || 0}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
              {articles.map((element) => {
                return (
                  <div className="col-md-4" key={element.url}>
                    <NewsItem
                      title={element.title ? element.title : ""}
                      description={
                        element.description ? element.description : ""
                      }
                      imageUrl={
                        element.urlToImage
                          ? element.urlToImage
                          : "https://media.wired.com/photos/6703eb3979f13fda7f04485b/191:100/w_1280,c_limit/Satoshi-Nakamoto-biz-1341874258.jpg"
                      }
                      newsUrl={element.url}
                      author={element.author}
                      publishedDate={element.publishedAt}
                      source={element.source.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between">
          <button
            disabled={this.state.page <= 1}
            type="button"
            className="btn btn-danger"
            onClick={this.handlePrevClick}
          >
            &larr;Previous
          </button>
          <button
            type="button" disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / props.pageSize)}
            className="btn btn-danger"
            onClick={this.handleNextClick}
          >
            Next&rarr;
          </button>
        </div> */}
      </>
    );
}

News.defaultProps = {
  country: "us",
  pageSize: 6,
  category: "general",
};
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};
export default News;
