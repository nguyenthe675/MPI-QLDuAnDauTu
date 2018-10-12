import React from 'react'

export default class index extends React.Component {
    render() {
        return (
            <div className="spinner" style={{
                padding: 10,
                color: "#333333",
                fontWeight: "bold"
            }}>
                <i className={"fa-2x fa-spin fal fa-spinner-third"} />
                <p style={{
                    padding: 5
                }}/>
                Loading...
            </div>
        );
    }
}