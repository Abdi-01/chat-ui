import React, { Component } from 'react';
import { Button, Container, Input, Table } from 'reactstrap';
import HeaderComp from './components/navbar';
import io from 'socket.io-client'
import Axios from 'axios'

const APIURL = 'https://thawing-lake-66770.herokuapp.com'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      userCount: 0,
      user: '',
      pesan: ''
    }
  }

  joinChat = () => {
    //  Untuk memberikan trigger komunikasi otomatis ke API BE, sesuai url. Shingga komunikasi socket terbuka
    const socket = io(APIURL)
    // Mengaktifkan socket, untuk menunggu pesan berdasarkan eventKey dari pengirim
    socket.emit('JoinChat', { nama: this.state.user })
    socket.on('chat message', msgs => this.setState({ messages: msgs }))
    socket.on('user connected', count => this.setState({ userCount: count }))
    // socket.on('userCheck', check => {
    //   console.log(check);
    //   this.setState({ userCheck: check });
    //   // Mengambil data pesan yg sudah ada terlebih dahulu
    //   if (check) {
    //     Axios.get(APIURL + '/chat/getMessages')
    //       .then((res) => {
    //         this.setState({ messages: res.data })
    //         alert('Join Group ✅')
    //       })
    //   } else {
    //     alert('User Exist ⛔')
    //   }
    // })
    // Mengambil data pesan yg sudah ada terlebih dahulu
    Axios.get(APIURL + '/chat/getMessages')
      .then((res) => {
        this.setState({ messages: res.data })
        alert('Join Group ✅')
      }).catch((err) => {
        console.log(err)
      })
  }

  onBtSendMessage = () => {
    Axios.post(APIURL + '/chat/sendMessages', {
      nama: this.state.user,
      message: this.state.pesan
    }).then((res) => {
      this.setState({ pesan: '' })
      alert('Message Send ✅')
    })
  }

  onBtClear = () => {
    Axios.delete(APIURL + '/chat/clearMessages')
      .then((res) => {
        alert('Clear Messages')
      })
  }

  renderMessages = () => {
    return this.state.messages.map((item, index) => {
      return (
        <tr key={index}>
          <td>{item.nama}</td>
          <td>{item.message}</td>
        </tr>
      )
    })
  }

  render() {
    return (
      <Container style={{ width: '50%' }}>
        <HeaderComp />
        <h2>CharUI Group User Connected :{this.state.userCount}</h2>
        <Input placeholder="Join Name" onChange={e => this.setState({ user: e.target.value })} />
        <Button onClick={this.joinChat}>Join</Button>
        <Table>
          <thead>
            <th>Nama</th>
            <th>Pesan</th>
            <th><Button onClick={this.onBtClear}>Clear</Button></th>
          </thead>
          <tbody>
            {this.renderMessages()}
          </tbody>
          <tfoot>
            <td colSpan="2">
              <Input type="textarea" value={this.state.pesan} placeholder="Your messages" onChange={e => this.setState({ pesan: e.target.value })} />
            </td>
            <td>
              <Button onClick={this.onBtSendMessage}>Send</Button>
            </td>
          </tfoot>
        </Table>
      </Container>
    );
  }
}

export default App;