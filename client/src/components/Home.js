/*global chrome*/
import React, { Component } from 'react'
import { Container, ListGroup, ListGroupItem, Button, InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import './Home.scss';
import logo from '../assets/chatbot-icon.png';
import chatIcon from '../assets/chat-icon.png';
import send from '../assets/send-icon.png';
import axios from "axios";

class HomePage extends Component {
    el = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            botMessageArray: [],
            userMessageArray: [],
            message: '',
            isOpen: false,
            messageDetail: {
                user:'',
                message:''
            }
        }
        this.sendmessage = this.sendmessage.bind(this);
        this.enterPressed = this.enterPressed.bind(this);
    };
    
    //send message to the bot 

    sendmessage(e) {
       
        e.preventDefault();
        axios.get('http://localhost:5003/api/getData', {
            params: {
                message: this.state.message
            }
        })
            .then(response => {
                this.botReplies(response)
            })
        this.state.userMessageArray.push(this.state.message);
        this.setState(
            this.state
        )
        this.state.message = '';
    //     var list = document.getElementById("chat-group");
    //     var targetLi = document.getElementById("chat-list"); // id tag of the <li> element

    // list.scrollTop = (targetLi.offsetTop - 50);
    }
   
    //recieve message from the bot 

    botReplies(response) {
        this.state.userMessageArray.push(response.data);
        this.setState(
            this.state
        )
    }

    // onchange tracker event

    inputChangedHandler(event) {
        this.setState({
            message: event.target.value
        })
        
        
    }
    enterPressed(event){
        if (event.keyCode == 13 || event.which == 13){
           this.sendmessage(event)
        }
    }

    componentDidMount() {
        this.scrollToBottom();
      }
    
      componentDidUpdate() {
        this.scrollToBottom();
      }
    
      scrollToBottom() {
        const node = this.refs.el;
        node && node.scrollIntoView({block: "end", behavior: 'smooth'})
        // this.el.scrollIntoView({ behavior: 'smooth' });
      }
    //render the HTML part

    render() {
        return (
            <Container>
                <div className="chat-container" >
                    <div>
                        <div className="chat-history-div" style={{ width: 100, minWidth: 320, minHeight: 320, height: 100, border: '1px solid #dedede' }}>
                            <div color="grey" className="chat-button">
                                <img src={logo} width='50px' height='50px' className="chat-icon" ></img>
                                <span className="chat-label">Ask Josie</span>
                                <span className="float-right msg-icon-container"><img src={chatIcon} width='25px' height='22px' className="message-icon" ></img></span>
                            </div>
                            <div  ref={el => { this.el = el; }}>
                                <ListGroup id="chat-group">
                                    {
                                        this.state.botMessageArray.map(data => <ListGroupItem id="chat-list"  className="bot-Message" key={data}> {data} </ListGroupItem>)
                                    }
                                    {
                                        this.state.userMessageArray.map(item => <ListGroupItem id="chat-list" className="user-Message" key={item}> {item} </ListGroupItem>)
                                    }
                                </ListGroup>
                            </div>
                            <div className="input-group msg-box">
                                <input id="textbox" type="text" className="form-control type-textbox" name="textbox" value={this.state.message}
                                    onChange={(event) => this.inputChangedHandler(event)} autoComplete="off" onKeyPress= {this.enterPressed} />
                                <span onClick={this.sendmessage} className="send-icon"> Chat<img src={send} width='20px' height='20px' /></span>
                            </div>
                        </div>
                        <div>

                        </div>
                    </div>

                </div>
            </Container>

        )
    }
}


export default HomePage