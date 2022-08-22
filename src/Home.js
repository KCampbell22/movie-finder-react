import React from "react";
import { Link } from "react-router-dom";
import { json, checkStatus } from "./utils";
import "bootstrap/dist/css/bootstrap.css";

const Movie = (props) => {
  const { Title, Year, imdbID, Type, Poster } = props.movie;

  return (
    <div className="row">
      <div className="col-4 col-md-2 col-lg-1 mb-3">
        <Link to={`/movie/${imdbID}/`}>
          <img src={Poster} alt={""} className="img-fluid" />
        </Link>
      </div>
      <div className="col-8 col-md-10 col-lg-11 mb-3">
        <Link to={`/movie/${imdbID}/`}>
          <h4>{Title}</h4>
          <p>
            {Type} | {Year}
          </p>
        </Link>
      </div>
    </div>
  );
};

class MovieFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      results: [],
      error: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    let { searchTerm } = this.state;
    searchTerm = searchTerm.trim();
    if (!searchTerm) {
      return;
    }

    fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=663da781`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        if (data.Response === "False") {
          throw new Error(data.Error);
        }

        if (data.Response === "True" && data.Search) {
          console.log(data);
          this.setState({ results: data.Search, error: "" });
        }
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      });
  }

  render() {
    const { searchTerm, results, error } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <form
              onSubmit={this.handleSubmit}
              className="form-inline my-4 mx-4 col-5 d-flex justify-content-between"
            >
              <input
                type="text"
                className="form-control mr-2 w-25 col-4"
                placeholder="frozen"
                value={searchTerm}
                onChange={this.handleChange}
              />
              <button type="submit" className="ml-3 btn btn-primary">
                Submit
              </button>
            </form>
            {(() => {
              if (error) {
                return error;
              }
              return results.map((movie) => {
                return <Movie key={movie.imdbID} movie={movie} />;
              });
            })()}
          </div>
        </div>
      </div>
    );
  }
}

export default MovieFinder;
