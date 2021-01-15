import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

const Player = ({ currentSong, audioRef, isPlaying, setIsPlaying, songInfo, songs, setCurrentSong, setSongs, activeLibraryHandler }) => {

    // Event Handlers
    const playSongHandler = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }

    const dragHandler = (e) => {
        audioRef.current.currentTime = e.target.value;
    }

    const skipDragHandler = async (direction) => {
        let currentIndex = songs.findIndex(song => song.id === currentSong.id);
        if (direction === 'skip-forward') {
           await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
           activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
        }
        if (direction === 'skip-back') {
            if (currentIndex === 0) {
                await setCurrentSong(songs[songs.length - 1]);
                activeLibraryHandler(songs[songs.length - 1]);
            } else {
                await setCurrentSong(songs[(currentIndex - 1) % songs.length]);
                activeLibraryHandler(songs[(currentIndex - 1) % songs.length]);
            }
        }
        if (isPlaying) audioRef.current.play();
    }

    const convertTime = (time) => {
        return (
            Math.floor(time / 60) + ':' + ('0' + Math.floor(time % 60)).slice(-2)
        );
    }

    const trackAnimation = {
        transform: `translateX(${songInfo.animationPercentage}%)`
    }

    return (
        <div className="player">
            <div className="time-control">
                <p>{convertTime(songInfo.currentTime)}</p>
                <div
                    style={{backgroundImage: `linear-gradient(to right, ${currentSong.color[0]}, ${currentSong.color[1]}`}}
                    className="track"
                >
                    <input
                        min={0}
                        max={songInfo.duration || 0}
                        value={songInfo.currentTime}
                        onChange={dragHandler}
                        type="range"
                    />
                    <div style={trackAnimation} className="animation-bar"></div>
                </div>
                <p>{songInfo.duration ? convertTime(songInfo.duration) : '0:00'}</p>
            </div>
            <div className="play-control">
                <FontAwesomeIcon
                    className="skip-back"
                    onClick={() => skipDragHandler('skip-back')}
                    icon={faAngleLeft}
                    size="2x"
                />
                <FontAwesomeIcon
                    onClick={playSongHandler}
                    className="play"
                    icon={isPlaying ? faPause : faPlay}
                    size="2x"
                />
                <FontAwesomeIcon
                    className="skip-forward"
                    onClick={() => skipDragHandler('skip-forward')}
                    icon={faAngleRight}
                    size="2x" />
            </div>
        </div>
    );
}

export default Player;