import React, { Component } from 'react'
import { Container, ListGroup, ListGroupItem, Button, InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import './Home.scss';
import logo from '../assets/chatbot-icon.png';
import chatIcon from '../assets/chat-icon.png';
import send from '../assets/send-icon.png';
import axios from "axios";

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            botMessageArray: [],
            userMessageArray: [],
            message: '',
            isOpen: false,
        }
        this.sendmessage = this.sendmessage.bind(this);
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
    }

    //recieve message from the bot 

    botReplies(response) {
        this.state.botMessageArray.push(response.data);
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
                            <div>
                                <ListGroup>
                                    {
                                        this.state.botMessageArray.map(data => <ListGroupItem className="bot-Message" key={data}> {data} </ListGroupItem>)
                                    }
                                    {
                                        this.state.userMessageArray.map(item => <ListGroupItem className="user-Message" key={item}> {item} </ListGroupItem>)
                                    }
                                </ListGroup>
                            </div>
                            <div className="input-group msg-box">
                                <input id="textbox" type="text" className="form-control" name="textbox" value={this.state.message}
                                    onChange={(event) => this.inputChangedHandler(event)} />
                                <span onClick={this.sendmessage} className="send-icon"> <img src={send} width='20px' height='20px' /></span>
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