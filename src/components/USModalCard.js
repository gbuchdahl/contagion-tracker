import React from "react";

const USModalCard = (props) => {
  let date = new Date(props.date);
  date.setDate(date.getDate());
  if (props.error === "Document not found") {
    return (
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">
            <span className="has-text-weight-bold">{props.state}</span>
          </p>
        </header>
        <section className="modal-card-body">
          <p>
            <span className="has-text-weight-bold">Error:</span> Data not found
            for {date.toDateString().slice(4)}.
          </p>
        </section>
        <section className="modal-card-foot">
          <p className="button is-warning" onClick={props.handle}>
            Close
          </p>
        </section>
      </div>
    );
  }
  if (props.new_cases !== undefined) {
    return (
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">
            <span className="has-text-weight-bold">{props.location}</span> |{" "}
            {date.toDateString().slice(4)}
          </p>
        </header>
        <section className="modal-card-body">
          <ul>
          <li>
              <strong>New Tests:</strong>{" "}
              {props.new_tests.toLocaleString("en")}
            </li>
            <li>
              <strong>New Cases:</strong> {props.new_cases.toLocaleString("en")}
            </li>
            <li>
              <strong>Total Cases:</strong>{" "}
              {props.total_cases.toLocaleString("en")}
            </li>
            <li>
              <strong>New Hospitalized:</strong>{" "}
              {props.new_hospitalized.toLocaleString("en")}
            </li>
            <li>
              <strong>New Deaths:</strong>{" "}
              {props.new_deaths.toLocaleString("en")}
            </li>
          </ul>
        </section>
        <section className="modal-card-foot">
          <p className="button is-warning" onClick={props.handle}>
            Close
          </p>
        </section>
      </div>
    );
  } else {
    return "";
  }
};

// location: "Michigan"
// new_cases: 0
// new_deaths: 0
// new_hospitalized: 0
// new_negatives: 0
// new_tests: 0
// state_code: "MI"
// total_cases: 9
// total_tests: 9
// _id: "5f184f23f60307de2d8521d8"

export default USModalCard;
