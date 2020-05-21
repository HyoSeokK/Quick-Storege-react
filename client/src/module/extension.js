export default (ext)=>{
    if(ext=='jpg' || ext=='png' || ext == 'gif'){
        return "img"
    }else if( ext=='avi' || ext =='mkv' || ext =='mp4'){
        return "video"
    }else if( ext=='zip' || ext=='7z'){
        return "zip"
    }else if(ext=='mp3' || ext =='flac'){
        return "music"
    }

}