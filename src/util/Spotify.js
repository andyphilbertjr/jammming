const clientId = 'c5e83816b9c24ef1977df5acc54231de'
const redirectURI = 'https://jammingcodaacademyap.surge.sh'

let userAccessToken

const Spotify = {
    getAccessToken(){
        const hasAccessToken = window.location.href.match(/access_token=([^&]*)/)
        const hasExpiresIn = window.location.href.match(/expires_in=([^&]*)/)
        if(userAccessToken){
            return userAccessToken
        }
        if(hasAccessToken && hasExpiresIn){
            userAccessToken = hasAccessToken[1]
            const expiresIn = Number(hasExpiresIn[1])
            window.setTimeout(() => userAccessToken = null, expiresIn * 1000)
            window.history.pushState('Access Token', null, '/')
            return userAccessToken
        } else {
            const scope = 'user-read-private playlist-modify-public';
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
        }
    },
    search(searchTerm){
        const accessToken = this.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,{
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(
            response => {
                if(response.ok){
                    return response.json()
                } 
                throw new Error('Request Failed!')
            }, networkError => console.log(networkError.message)
        ).then(
            jsonResponse => {
                if(jsonResponse.tracks){
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri

                }))
            }else {
                return []
            }
        })
    },
    savePlaylist(playlistName, trackList){
        this.getAccessToken()
        const headers =  {
            Authorization: `Bearer ${userAccessToken}`

        }
        let userID
        let playlistId

        if(playlistName && trackList){
            return fetch('https://api.spotify.com/v1/me', {
                    headers: headers
                }
            ).then(response => {
                if(response.ok){
                    return response.json()
                }
                throw new Error('Request failed!')
            }, networkError => console.log(networkError.message)
            ).then(jsonResponse => {
                return userID = jsonResponse.id
            }).then(() => {
                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                        headers: headers ,
                        method: 'POST',
                        body: JSON.stringify({name: playlistName})
                    })
                }).then(response => {
                    if(response.ok){
                        return response.json()
                    }
                    throw new Error('Request Failed!')
                }, networkError => console.log(networkError.message)
                ).then(jsonResponse => {
                    return playlistId = jsonResponse.id
                }).then(() => {
                    return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistId}/tracks`, {
                        headers: headers, 
                        method: 'POST',
                        body: JSON.stringify({uris: trackList})
                    })
                    
                }).then(response => {
                    if (response.ok) {
                        return response.json()
                    }
                    throw new Error('Request Failed!')
                }, networkError => console.log(networkError.message)
                ).then(jsonResponse => {
                })
            } else {
                return
            }
    }
}
  
export default Spotify