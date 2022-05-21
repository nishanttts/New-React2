import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


export class News extends Component {
  static defaultProps = {
    country: 'in',
    pageSize: 6,
    category: 'general'
  }
  static propsTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }
  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor(props) {
    super(props);
    console.log("Hello i m a constructor");
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults:0
    }
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewMonkey`;
  }
  async updateNews() {
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=582b2ec9825f42cbb0c23a6ff11663c9&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData = await data.json();
    this.props.setProgress(60);
    console.log(parsedData);
    this.setState(
      {
        articles: parsedData.articles,
        totalResults: parsedData.totalResults,
        loading: false
      })
      this.props.setProgress(100);
  }
  async componentDidMount() {

    this.updateNews();
  }
  handlePrevClick = async () => {

    this.setState({ page: this.state.page - 1 });
    this.updateNews();
  }
  handleNextClick = async () => {

    this.setState({ page: this.state.page + 1 });
    this.updateNews();
  }
  fetchMoreData = async () => {
    
    
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=582b2ec9825f42cbb0c23a6ff11663c9&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
    this.setState({ page: this.state.page + 1 });
    
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);
    this.setState(
      {
        articles: this.state.articles.concat(parsedData.articles),
        totalResults: parsedData.totalResults
        
      })
  };

  render() {

    return (
      <>
      
        <h1 className="text-center" style={{ margin: '70px 0px' }}>Top Headlines from {this.capitalizeFirstLetter(this.props.category)} </h1>
        {this.state.loading && <Spinner />}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length!==this.state.totalResults}
          loader={<Spinner/>}
        >
               <div className="container">
          <div className="row">
            {this.state.articles.map((element) => {
              return <div className="col-md-4" key={element.url}>
                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imgUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
              </div>
            })
            }


             </div> 
          </div>
        </InfiniteScroll>
       </> 
      
    )
  }
}

export default News