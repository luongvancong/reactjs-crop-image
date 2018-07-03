import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import ReactCrop, {makeAspectCrop} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import img from './img_the_scream.jpg';

class App extends Component {
    state = {
        src: null,
        base64Img: null,
        pixelCrop: {},
        crop: {
            x: 10,
            y: 10,
            width: 100,
            height: 100,
        },
    };

    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader()
            reader.addEventListener(
                'load',
                () =>
                    this.setState({
                        src: reader.result,
                    }),
                false
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    onImageLoaded = image => {
        this.setState({image});
        console.log('onImageLoaded', image.naturalWidth, image.height);
        this.setState({
            crop: makeAspectCrop({
                x: 40, // 40% khung ảnh
                y: 40, // 40% khung ảnh
                aspect: 1 / 1, // Tỉ lệ 1:1
                width: 25, // Width khung crop = 25% ảnh gốc
            }, image.naturalWidth / image.naturalHeight),
            image,
        });
    };

    onCropComplete = (crop, pixelCrop) => {
        // console.log('onCropComplete, crop:', crop);
        // console.log('onCropComplete, pixelCrop:', pixelCrop);
        this.getCroppedImg();
    };

    onCropChange = (crop, pixelCrop) => {
        this.setState({ crop, pixelCrop });
        console.log('onCropChange, pixelCrop:', pixelCrop);
    };

    getCroppedImg = () => {
        let image = this.state.image;
        let pixelCrop = this.state.pixelCrop;
        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        // As Base64 string
        const base64Image = canvas.toDataURL('image/jpeg');
        this.setState({base64Img: base64Image});
    };

    render() {
        return (
            <div className="App">
                <div>
                    <input type="file" onChange={this.onSelectFile} />
                </div>
                {this.state.src && (
                    <ReactCrop
                        src={this.state.src}
                        crop={this.state.crop}
                        onImageLoaded={this.onImageLoaded}
                        onComplete={this.onCropComplete}
                        onChange={this.onCropChange}
                    />
                )}

                <div className="result">
                    <img src={this.state.base64Img} alt="" />
                </div>
            </div>
        )
    }
}

export default App;
