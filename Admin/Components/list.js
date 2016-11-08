

class List extends React.Component {

    render() {
        return (
            <ul>
                {this.props.data.map((data,i) => {
                    return (<li>{data.id}: {data.name} </li>);

                }) }
            
            </ul>

        );
    }
}


module.exports = List;