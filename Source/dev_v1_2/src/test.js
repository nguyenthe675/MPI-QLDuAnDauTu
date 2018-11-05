// tệ
const Listing = React.createClass({
    // ...
    render() {
        return <div>{this.state.hello}</div>;
    }
});

// tốt
class Listing extends React.Component {
    // ...
    render() {
        return <div>{this.state.hello}</div>;
    }
}
