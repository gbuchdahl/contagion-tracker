import React from 'react';



const CountryModalCard = (props) => {
    let date = new Date(props.date)
    date.setDate(date.getDate() + 1)
    if (props.new_cases !== undefined) {
        return(
            <div className="modal-card">
            <header className="modal-card-head">
                <p className="modal-card-title"><span className="has-text-weight-bold">{props.location}</span> | {date.toDateString().slice(4)}</p>
            </header>
            <section className="modal-card-body">
                <ul>
                    <li><strong>New Cases:</strong> {props.new_cases.toLocaleString('en')}</li>
                    <li><strong>Total Cases:</strong> {props.total_cases.toLocaleString('en')}</li>
                    <li><strong>New Deaths:</strong> {props.new_deaths.toLocaleString('en')}</li>
                    <li><strong>New Cases Per Million:</strong> {props.new_cases_per_million.toLocaleString('en')}</li>
                    <li><strong>Total Cases Per Million:</strong> {props.total_cases_per_million.toLocaleString('en')}</li>
                    <li><strong>New Deaths Per Million:</strong> {props.new_deaths_per_million.toLocaleString('en')}</li>
                </ul>
            </section>
        </div>
        )
    } else {
        return ""
    }

}

export default CountryModalCard;