import React, { Component } from 'react';
import './../scss/main-search.css';
import $ from 'jquery';
import { store, actions } from './../store/store.js';
import Query from './../components/query.js';
import { Link, withRouter } from 'react-router-dom';
// import Pagination from "react-js-pagination";
// require("bootstrap/less/bootstrap.less");

const apiKey = '873eb20764b577e3b6adfa6f878f3379';

const baseURL = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=en-US&query=`;

const imageURL = `https://image.tmdb.org/t/p/w500`;
// var totalResults;
// let url;
// var pageCount;

class MainSearch extends Component {

  constructor(){
    super();
    this.state = store.getState().main;
  }

  componentDidMount() {
    this.unsub = store.subscribe(() => {
      this.setState(store.getState().main);
    });
  }

  componentWillUnmount() {
    this.unsub();
  }

  handleQuery(input) {
    store.dispatch(Object.assign({}, actions.QUERY_HANDLE));
     this.makeAjaxCall();
  };

  makeAjaxCall() {
    // console.log('pg#', this.state.pageNumber)
    const currentState = store.getState().main
    $.ajax({
      url: `${baseURL}/${currentState.queryInput}/&page=${currentState.pageNumber}&include_adult=false`
    })
    .done((data) => {
      // console.log('main data', data)
      let fixedData = data.results.map((x) => {
        if (x.media_type === 'movie') {
          if (x.poster_path === null) {
            return {
              idMedia: x.id,
              nameMedia: x.title,
              overview: x.overview,
              artMedia: 'no-image.png',
              dateMedia: x.release_date,
              typeMedia: x.media_type
            }
          }
          else {
            return {
              idMedia: x.id,
              nameMedia: x.title,
              overview: x.overview,
              artMedia: x.poster_path,
              dateMedia: x.release_date,
              typeMedia: x.media_type
            }
          }
        }
        else if (x.media_type === 'tv') {
          if (x.poster_path === null) {
            return {
              idMedia: x.id,
              nameMedia: x.name,
              overview: x.overview,
              artMedia: 'no-image.png',
              dateMedia: x.first_air_date,
              typeMedia: x.media_type
            }
          }
          else {
            return {
              idMedia: x.id,
              nameMedia: x.name,
              overview: x.overview,
              artMedia: x.poster_path,
              dateMedia: x.first_air_date,
              typeMedia: x.media_type
            }
          }
        }
        else if (x.media_type === 'person') {
          if (x.profile_path === null) {
            return {
              idMedia: x.id,
              nameMedia: x.name,
              artMedia: 'no-image.png',
              typeMedia: x.media_type
            }
          }
          else {
            return {
              idMedia: x.id,
              nameMedia: x.name,
              artMedia: x.profile_path,
              typeMedia: x.media_type
            }
          }
        }
      else {
        return null;
      }
      })
      store.dispatch(Object.assign({}, actions.GET_DATA, {
        results: fixedData,
        totalItemsCount: data.total_results
      }, console.log(fixedData)));
      // totalResults = data.total_results;
      // pageCount = Math.ceil(totalResults / 20);
      // // console.log(pageCount)
    });
  }

//   render() {
//   return (
//     <Pagination
//       hideDisabled
//       activePage={this.state.activePage}
//       itemsCountPerPage={PER_PAGE}
//       totalItemsCount={TOTAL_COUNT}
//       onChange={this.handlePageChange}
//       />
//      );
//     }

  handlePrevClick() {
    store.dispatch(Object.assign({}, actions.DECREMENT_PAGE));
    this.makeAjaxCall();
    window.scrollTo(0, 0);
      // console.log('pnd', this.state.pageNumber)
  }

  handleNextClick() {
      store.dispatch(Object.assign({}, actions.INCREMENT_PAGE));
      this.makeAjaxCall();
      window.scrollTo(0, 0);
  }

  addToFavorites(x, evt) {
    console.log(x.name, 'added to favorites')
    $.ajax({
      url: '/api/favorite',
      method: 'POST',
      data: {
        nameMedia: x.name,
        idMedia: x.id,
        artMedia: x.art,
        typeMedia: x.media_type
      }
    })
    .done((data) => {
      // console.log('data from add to faves ajax1', data)
      store.dispatch(Object.assign({}, actions.ADD_TO_FAVORITES, { favorites: data }))
      console.log('data from add to faves ajax2', data)
    });
  }

  onToDetails(data) {
    store.dispatch(Object.assign({}, actions.ON_TO_DETAILS, { details: data }))
  }

  render() {
    console.log(this.state)
    let searchResults = this.state.results.map((x) => {
      let url = 'no-image.png'
      if (x.artMedia !== 'no-image.png') {
        url = `${imageURL}/${x.artMedia}`
      }
      if (x.typeMedia === 'person') {
        return <li
                className="searchLis"
                key={x.idMedia}>
                <div className="favoritesItem"
                  onClick={(evt) => this.addToFavorites(x, evt)}></div>
                <img src={url} alt={x.nameMedia} />
                  <p>Name: <Link to="/details/" onClick={() => this.onToDetails(x)}>{x.nameMedia}</Link></p>
              </li>
      }
      else {
        return <li
                className="searchLis"
                key={x.idMedia}>
                <div className="favoritesItem"
                  onClick={(evt) => this.addToFavorites(x, evt)}></div>
                <img src={url} alt={x.nameMedia} />
                <p>Name: <Link to="/details/" onClick={() => this.onToDetails(x)}>{x.nameMedia}</Link></p>
                <p>Overview: {x.overview}</p>
                <p>Date: {x.dateMedia}</p>

              </li>
      }
    });
    return(
        <div className="main-search-container">
          <div className="input-box">
            <Query
              results={this.state.results}
              querySubmit={(input) => this.handleQuery(input)}
              query={this.state.query}
               />
          </div>
          <ol className="searchOL">
            {searchResults}
          </ol>
          <div className="button-container">
            <div className="page-button prev-button"
                 onClick={() => this.handlePrevClick()}
                 >previous</div>
            <div className="page-button next-button"
                 onClick={() => this.handleNextClick()}
                 >next</div>
          </div>

        </div>
    )
  }
}

// module.exports = MainSearch;

export default withRouter(MainSearch);




// <Pagination className="users-pagination pull-right" bsSize="medium"
//   hideDisabled
//   activePage={this.state.activePage}
//   itemsCountPerPage={this.state.itemsCountPerPage}
//   totalItemsCount={this.state.totalItemsCount}
//   onChange={this.handlePageChange}
//   />
