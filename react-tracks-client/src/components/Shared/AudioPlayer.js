import React from "react";
import ReactPlayer from 'react-player'

const AudioPlayer = ({url}) => <div><ReactPlayer url={url} controls={true} height="30px" width="500px"/></div>;

export default AudioPlayer;
