import React from 'react';



const CountryModalCard = (props) => {
    let date = new Date(props.date)
    date.setDate(date.getDate() + 1)
    return (
        <div className="modal-card">
            <header className="modal-card-head">
                <p className="modal-card-title"><span className="has-text-weight-bold">{props.country_code}</span> | {date.toDateString().slice(4)}</p>
            </header>
            <section className="modal-card-body">
                <ul>
                    <li><strong>New Cases:</strong> {props.new_cases}</li>
                    <li><strong>Total Cases:</strong> {props.total_cases}</li>
                    <li><strong>New Deaths:</strong> {props.new_deaths}</li>
                    <li><strong>New Cases Per Million:</strong> {props.new_cases_per_million}</li>
                    <li><strong>Total Cases Per Million:</strong> {props.total_cases_per_million}</li>
                    <li><strong>New Deaths Per Million:</strong> {props.new_deaths_per_million}</li>
                </ul>
            </section>
        </div>
    )
}

export default CountryModalCard;