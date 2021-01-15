import React, { useState, useRef } from 'react';

// Styles
import './styles/app.scss';

// Components
import Song from './components/Song';
import Player from './components/Player';
import Library from './components/Library';
import Nav from './components/Nav';

// Data
import data from './data';

function App() {

    // States
    const [songs, setSongs] = useState(data());
    const [currentSong, setCurrentSong] = useState(songs[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [songInfo, setSongInfo] = useState({
        duration: 0,
        currentTime: 0,
        animationPercentage: 0
    });
    const [libraryStatus, setLibraryStatus] = useState(false);

    // References
    const audioRef = useRef(null);

    // Event Handlers
    const timeUpdateHandler = (e) => {
        const duration = e.target.duration;
        const currentTime = e.target.currentTime;
        const roundedCurrent = Math.round(currentTime);
        const roundedDuration = Math.round(duration);
        const animationPercentage = Math.round((roundedCurrent / roundedDuration) * 100);
        setSongInfo({duration, currentTime, animationPercentage});
    }

    const songEndHandler = async () => {
        let currentIndex = songs.findIndex(song => song.id === currentSong.id);
        await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
        activeLibraryHandler(songs[(currentIndex + 1) % songs.length])
        if (isPlaying) audioRef.current.play();
    }

    const activeLibraryHandler = (nextPrev) => {
        const newSongs = songs.map(dataSong => {
            if (dataSong.id === nextPrev.id) {
                return {...dataSong, active: true};
            } else {
                return {...dataSong, active: false};
            }
        });
        setSongs(newSongs);
    }

    return (
        <div className={`App ${libraryStatus ? 'library-active' : ''}`}>
            <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
            <Song currentSong={currentSong} />
            <Player
                currentSong={currentSong}
                audioRef={audioRef}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                songInfo={songInfo}
                songs={songs}
                setCurrentSong={setCurrentSong}
                setSongs={setSongs}
                activeLibraryHandler={activeLibraryHandler}
            />
            <Library
                songs={songs}
                setSongs={setSongs}
                setCurrentSong={setCurrentSong}
                audioRef={audioRef}
                isPlaying={isPlaying}
                libraryStatus={libraryStatus}
            />
            <audio
                ref={audioRef}
                src={currentSong.audio}
                onLoadedMetadata={timeUpdateHandler}
                onTimeUpdate={timeUpdateHandler}
                onEnded={songEndHandler}
            ></audio>
        </div>
    );
}

export default App;
