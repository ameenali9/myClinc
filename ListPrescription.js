import React from "react";
import Styled from "styled-components";
import 'babel-polyfill';

import Paper from "./File";
import PdfGenerator from "./pdf";

//Style
let List    = Styled.div `  width:80%;margin:16px 10%;box-shadow:4px 4px 20px silver;border-radius:10px;padding:8px;display:flex;justify-content:space-between;align-items:center; 
&:hover{border:2px solid gray}`;
let Div     = Styled.div ` padding:8px;  `;
let Text    = Styled.div ` padding:8px;text-transform:capitalize;font-size:1em;padding-left:16px;font-family: 'Lora', serif; `;
let Button  = Styled.button `font-size:1em;padding:12px 22px;border-radius:20px;border:2px solid gray;font-family: 'Lora', serif;font-weight:bold;
                                background-color:#gray;color:black;outline:none;cursor:pointer;margin:0px 4px;text-transform:capitalize;
                            &:hover {background-color:#234;color:#fff;font-weight:unset;border:2px solid #fff;}
                            &:active {background-color:#3058a9;color:#fff;font-weight:unset;border:2px solid #fff;}`;

//main class
class Container1 extends React.Component{
    constructor(){
        super();
        this.state = {
            Data : [],
            Print: {name: "", date: "", birth: 0, data:"[]"} //default value
        }
        this.getData();
    }
    // get all prescriptions that saved at firebase database
    getData(){                      /*case/CCX5mb2nBL7X3BLUr8BQ =>> find the only obj that you want */
        firebase.firestore().collection("case").orderBy("date", "desc").onSnapshot((snapshot)=>{
            let FireBase = [];
            snapshot.forEach((doc)=>{ 
                let Obj = doc.data();
                //console.log(Obj)
                Obj.id = doc.id; //push document id that related to firebase database
                //console.log(Obj.id)
                FireBase.push(Obj);
            })
            this.setState({ Data : FireBase });
            //console.log(this.state.Data);
        });
    }
    // print or view certain prescription for target case
    showData(event, type){
        //index of data of prescription at Data state array
        let index =  event.target.value;
        //console.log(index)
        //update print state array
        this.setState({ Print : this.state.Data[index] })
        if(type == "view"){
            let Paper = document.getElementById('View');
            Paper.style.zIndex = "4";
            Paper.style.opacity = "1";

        }
        if(type == "print"){ //convert HTML to canvas and then to pdf file and set it name, check script tags at index.html file
            let filename = event.target.name;
            const PDFData = document.getElementById('pdfDemo');
            html2canvas(PDFData).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF("p", "mm", "a4");
                let width = pdf.internal.pageSize.getWidth();
                let height = pdf.internal.pageSize.getHeight();
                pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
                pdf.save(filename + ".pdf");
            });
        }
    }
    // close slide side bar after click on res cross icon
    closePaper(){
        let Paper = document.getElementById('View');
        Paper.style.zIndex = "-3";
        Paper.style.opacity = "0";
    }
    
    render(){
        return(
            <React.Fragment>
                {this.state.Data.map((item,i)=>{
                    console.log(i)
                    return (
                        <List key={i}>
                            <Div>
                               
                                <Text><b>name : </b>{item.name}</Text>
                                <Text><b>birth : </b>{item.birth}</Text>  
                            </Div>
                            <Div>
                                <Button value={i} onClick={(event)=>{this.showData(event,"view")}}>View</Button>
                                <Button value={i} name={item.name + " " + item.date} onClick={(event)=>{this.showData(event,"print")}}>PDF</Button>
                            </Div>
                        </List>
                    )
                })}
                <Paper.Provider value={{
                    state : this.state.Print,
                    action: { ClosePaperFun : ()=>{ this.closePaper() } }
                }}>
                    <PdfGenerator />
                </Paper.Provider>
            </React.Fragment>
        )
    }
}

export default Container1;