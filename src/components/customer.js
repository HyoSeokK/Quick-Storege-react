import React from 'react';

export default class Customer extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            name : this.props.name
        }

    }
    render(){
        return(
            <div>
                <CustomerInfo image={this.props.image} name={this.props.name}/>
                <CustomerProfile gender={this.props.gender} gender={this.props.gender}/>
            </div>
        );
    };
} 


class CustomerInfo extends React.Component{

    render(){
        return(
        <div>
            <img src={this.props.image} alt="profile"></img>
            <h1>이름 : {this.props.name}</h1>
        </div>)
    }
}

class CustomerProfile extends React.Component{

    render(){
        return(
        <div>
            <p>주소 : {this.props.address}</p>
            <p>성별 : {this.props.gender}</p>
        </div>)
    }
}