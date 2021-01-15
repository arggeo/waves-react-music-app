import React from 'react';

const LibrarySong = ({ song, songs, setSongs, setCurrentSong, audioRef, isPlaying }) => {

    // Event Handlers
    const songSelectHandler = async () => {
        // const selectedSong = songs.filter(dataSong => dataSong.id === song.id);
        // setCurrentSong(selectedSong[0]);
        await setCurrentSong(song);
        if (isPlaying) audioRef.current.play();

        const newSongs = songs.map(dataSong => {
            if (dataSong.id === song.id) {
                return {...dataSong, active: true};
            } else {
                return {...dataSong, active: false};
            }
        });
        setSongs(newSongs);
    }

    return (
        <div onClick={songSelectHandler} className={`library-song ${song.active ? 'selected' : ''}`}>
            <img src={song.cover} alt={song.name} />
            <div className="song-description">
                <h3>{song.name}</h3>
                <h4>{song.artist}</h4>
            </div>
        </div>
    );
}

export default LibrarySong;