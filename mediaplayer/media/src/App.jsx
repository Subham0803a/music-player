import React, { useState, useEffect, useRef } from 'react'
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from 'react-icons/fa';
import "./index.css"


function App() {

  const [isPlaying, setIsPlaying] = useState(false);            // track weather music-player is playing or paused
  const [currentsongindex, setCurrentSongIndex] = useState(0);  // track the index of the current playing song 
  const [file, setFile] = useState([null]);
  const [files, setFiles] = useState([]);
  const audioRef = useRef(null)                   // its is used to take refrence of the audio element then use it to manipulate dom
  // const progressbarRef = useRef(null);         // this will used for the progress bar




  // playpause function
  const handelPlayPause = () => {    
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      audioRef.current.pause();
    }
    else {
      audioRef.current.play()
    }
  };


  // previous function
  const handelPrevious = () => {
    const newindex = (currentsongindex - 1 + songs.length) % songs.length
    setCurrentSongIndex(newindex);
    audioRef.current.load();  // after click it will load new songs 
    audioRef.current.paly();  // after load it will play the new song

  };

  // next function
  const handleNext = () => {
    const newindex = (currentsongindex + 1) % songs.length;
    setCurrentSongIndex(newindex);
    audioRef.current.load();
    audioRef.current.play();

  };

  // progress bar function
  // const handelProgressbarUpdate = () => {
  //   if(!isPlaying) {
  //     const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
  //     progressbarRef.current.style.width = `${progress}`;
  //   }
  // };
  //   useEffect(() => {
  //     audioRef.current.addEventListener('timeupdate', handelProgressbarUpdate)
  //   }, [isPlaying]);



  // this is here to post songs to django and then to database
  const handleFileChange = (event) => {
    setFile(event.target.file[0]);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    console.log(formData)
    formData.append('file', file);
    console.log(file.name,formData)
    setFiles((files) => [...files, file.name])

    await fetch('http://127.0.0.1:8000/upload/', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));

    // await fetchmusic(files[currentsongindex])

  };



  // const fetchmusic = async(filename) => {

  //   fetch(`http://127.0.0.1:8000/get_songs/${filename}`)
  //   .then(response => response.blob())
  //   .then(blob => {
  //     const sfile = new File([blob], filename, {type : 'audio/mp3'});
  //     console.log(sfile)
  //   })
  // }


  // const getfiles = async () => {
  //   const res = await fetch('http://127.0.0.1:8000/all_songs/')
  //   let jsonData = await res.json()

  //   const data = jsonData.map(item => item.filename)
  //   setFiles(data)
  //   console.log(data[currentsongindex])

  //   fetchmusic(data[currentsongindex])

  // }

  // useEffect(() => {

  //   getfiles()

  // }, []);

  return (

    <div className='music-player'>

      <h1>Music Player</h1>
      {/* buttons controls & progress bar */}
      <div id='controlers'>
        <button id='previous-btn' onClick={handelPrevious}><FaStepBackward /></button>
        <button id='playpause-btn' onClick={handelPlayPause}> {isPlaying ? <FaPause /> : <FaPlay />} </button>
        <button id='next-btn' onClick={handleNext}><FaStepForward /></button><br />
      </div>

      {/* upload musics */}
      <div className='music-file'>
        <form onSubmit={handleSubmit}>
          <h1>Upload musics</h1>
          <input type="file" onChange={handleFileChange} />
          <button type='submit'>Upload</button>
        </form>
      </div>
    </div>
  )
}

export default App;
