import React from 'react'
import '../Playlist/Playlist.css'
import Tracklist from '../Tracklist/Tracklist.js'

class Playlist extends React.Component{
    constructor(props){
        super(props)
        this.handleNameChange = this.handleNameChange.bind(this)
    }
    handleNameChange(nameChangeEvent){
        this.props.onNameChange(nameChangeEvent.target.value)
    }
    render(){
        return (
            <div className="Playlist">
                <input defaultValue={this.props.playlistName}
                        onChange={this.handleNameChange}
                />
                <Tracklist tracks={this.props.playlistTracks}
                            onRemove={this.props.onRemove}
                            isRemoval={true}
                />
                <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
            </div>
        )
    }
}
export default Playlist