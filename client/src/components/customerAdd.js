import React from 'react';
import {post} from 'axios';

class CustomerAdd extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            gender : '',
            userName : '',
            address : '',
            file : null,
            filename : ''
        }
        this.handleFileChange = this.handleFileChange.bind(this);
    }
    addCustomer =() =>{
        const url = '/api/customers';
        const formData = new FormData();
        formData.append('image',this.state.file);
        formData.append('name',this.state.userName);
        formData.append('gender',this.state.gender);
        formData.append('address',this.state.address);
        const config ={
            headers:{
                'content-type':'multipart/form-data'
            }
        }
        return post(url,formData,config);
    }
    handleFormSubmit =(e)=>{
        e.preventDefault();
        this.addCustomer().then((response)=>{
            console.log(response.data);
        });
        this.setState({
            gender : '',
            userName : '',
            address : '',
            file : null,
            filename : ''
        })
        window.location.reload();
    }
    handleFileChange(e){
        console.log(e.target.files[0].name);
        this.setState({
            file:e.target.files[0],
            filename : e.target.files[0].name
        })
    }
    handleValueChange=(e)=>{
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }
    render( ){
        return(
            <form onSubmit={this.handleFormSubmit}>
                <h1>고객추가</h1>
                프로필 이미지 : <input type="file" name="file" file={this.state.file} onChange={e => this.handleFileChange(e)}/><br/>
                 : <input type="text" name="userName" value={this.state.userName} onChange={this.handleValueChange}/><br/>
                password : <input type="text" name="gender" value={this.state.gender} onChange={this.handleValueChange}/><br/>
                주소 : <input type="text" name="address" value={this.state.address} onChange={this.handleValueChange}/><br/>
                <button type="submit">등록</button>
            </form>
        );
    }

}
export default CustomerAdd;