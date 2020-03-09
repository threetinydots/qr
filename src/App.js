import React from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import queryString from 'query-string';
import { QRCode } from 'react-qr-svg';
import { GithubPicker } from 'react-color';
import Slider from 'rc-slider/lib/Slider';
import 'rc-slider/assets/index.css';

class App extends React.Component {
  constructor() {
    super();
    this.qs = queryString.parse(window.location.search);
    this.state = {
      size: (this.qs.s === undefined || this.qs.s === null) ? 256 : parseInt(this.qs.s),
      text: (this.qs.v === undefined || this.qs.v === null) ? 'https://threetinydots.github.io/qr' : decodeURI(this.qs.v),
      level: 'Q',
      background: (this.qs.b === undefined || this.qs.b === null) ? '#ffffff' : this.qs.b,
      foreground: (this.qs.f === undefined || this.qs.f === null) ? '#000000' : this.qs.f,
      qrcodeAsBase64: null
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick () {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    //let svg = document.getElementById('qrcode');//.querySelector('svg');
    let image = new Image(this.state.size, this.state.size);
    image.src = this.state.qrcodeAsBase64;
    context.drawImage(image, 0, 0);
    let uri = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    //window.location = uri;
    let a = document.createElement('a');
    a.setAttribute('download', 'qrcode.png');
    a.setAttribute('href', uri);
    a.setAttribute('target', '_blank');
    a.dispatchEvent(new MouseEvent('click', {
      view: window,
      bubbles: false,
      cancelable: true
    }));
  }

  render() {
    return (
      <Container>
        <Form>
          <Form.Group>
            <Form.Label>text</Form.Label>
            <Form.Control
              type="text"
              defaultValue={this.state.text}
              onChange={(event) => this.setState({ text: event.target.value })}
              placeholder="https://threetinydots.github.io/qr" />
          </Form.Group>
          <Form.Group>
            <Form.Label>size {this.state.size}</Form.Label>
            <Slider 
              value={this.state.size}
              min={100}
              max={1000}
              onChange={(size) => this.setState({ size })} />
          </Form.Group>
          <Form.Group>
            <Form.Label>background color</Form.Label>
            <GithubPicker 
              color={ this.state.background }
              onChangeComplete={(color) => this.setState({ background: color.hex })} />
          </Form.Group>
          <Form.Group>
            <Form.Label>foreground color</Form.Label>
            <GithubPicker 
              color={ this.state.foreground }
              onChangeComplete={(color) => this.setState({ foreground: color.hex })} />
          </Form.Group>
          <QRCode
            bgColor={this.state.background}
            fgColor={this.state.foreground}
            level={this.state.level}
            style={{ width: this.state.size }}
            value={this.state.text}
            id="qrcode"
            onLoad={(event) => this.setState({ qrcodeAsBase64: 'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(event.target.getSVGDocument())) })} />
          <div>
            <button onClick={this.handleClick}>Click to download</button>
          </div>
        </Form>
      </Container>
    );
  }
}

export default App;
