import React from "react";
import ReactDOM from "react-dom";
import Styled from "styled-components";
import 'babel-polyfill';

import Bulk from "./Bulk";
import Header from "./Header";
import NewPrescription from "./NewPrescription";
import ListPrescription from "./ListPrescription";

//Initialize Firebase
var config = {
    apiKey: "AIzaSyDTPPooX1EHPuA70wx2kj0sbd2LR3_E9ZY",
    authDomain: "myclinic-90cd5.firebaseapp.com",
    databaseURL: "https://myclinic-90cd5.firebaseio.com",
    projectId: "myclinic-90cd5",
    storageBucket: "myclinic-90cd5.appspot.com",
    messagingSenderId: "261840456165"
  };
  firebase.initializeApp(config);
// connection setting for firebase
const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);


// Main class
class App extends React.Component {
    constructor(){
        super();
        this.state = {
            UI     : "ListPrescription",           
        };
    }
    // update UI when click on header button
    setUI(loc){
        //console.log(loc);
        let locArray = ["NewPrescription","ListPrescription"];
        if(locArray.indexOf(loc) > -1){
            this.setState({ UI : loc })
        }
    }

    render(){
        return (
            <Bulk.Provider value={{
                state  : this.state,
                action : {
                    setUIFun: (data)=>{ this.setUI(data); }
                }
            }}>
                <Header />
                <UI location={this.state.UI}/>
            </Bulk.Provider>
        )
    }
}

function UI(props){
    if(props.location == "NewPrescription"){ return (<NewPrescription />) }
    if(props.location == "ListPrescription"){ return (<ListPrescription />) }
    if(props.location == ""){ return (<br />) }
}

ReactDOM.render(<App />,document.getElementById('demo'));