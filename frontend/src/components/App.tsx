import './App.css';
import VideoComponent from "./VideoComponent";
import { FC, MutableRefObject, Ref, useCallback, useMemo, useRef, useState } from "react";
import videojs from 'video.js';
import axios from 'axios';
import SingleVideo from './SingleVideo';
import { useSetState } from 'react-use';

function getVideoOptions(src: string): videojs.PlayerOptions {
  return {
    autoplay: false,
    playbackRates: [0.5, 1, 1.25, 1.5, 2],
    controls: true,
    responsive: true,
    sources: [{
      src: src,
      type: 'video/mp4'
    }]
  }
}

function  useResultVideo({ secondVideoUrl, firstVideoUrl, offsetFirstVideo, filterType }: TState) {
  const [imgName, setImgName] = useState()

  return {
    generate: async () => {
      console.log('secondVideoUrl, firstVideoUrl', 'filterType');
      console.log(secondVideoUrl, firstVideoUrl, filterType);

      if (!secondVideoUrl || !firstVideoUrl) {
        alert('select both videos')
        return
      }

      try {
        const response = await axios.post('http://localhost:9000/videos/combine', {
          first: firstVideoUrl,
          second: secondVideoUrl,
          offset: offsetFirstVideo ,
          filterType: filterType || 'fade'
        })

        setImgName(response.data)
      } catch (e) {
        throw new Error('Something went wrong')
      }
    },
    imgUrl: imgName && 'http://localhost:9000/' + imgName
  }
}

type TState = {
  firstVideoUrl: string
  secondVideoUrl: string
  offsetFirstVideo?: string
  filterType: 'fade' | 'radial' | 'hlslice' | 'vuslice' | 'hblur'
}


function App() {
  const [state, setState] = useSetState<TState>({firstVideoUrl: "", offsetFirstVideo: "", secondVideoUrl: "", filterType:'fade'})
  // const isResultGenerationEnabled = !!state.firstVideoUrl && !!state.secondVideoUrl

  const { imgUrl: resultVideoUrl, generate } = useResultVideo(state)

  const options = useMemo(() => resultVideoUrl && getVideoOptions(resultVideoUrl), [resultVideoUrl])

  return (
    <div className="app">
      <SingleVideo title="First video" onVideoGenerated={(url, duration) =>{
        console.log('url', url)
        setState({ firstVideoUrl: url, offsetFirstVideo: duration.toString()})
      }} />

      <hr/>

      <SingleVideo title="Second video" onVideoGenerated={(url) => {
        console.log('url', url)
        setState({ secondVideoUrl: url })
      } } />

      <hr/>
      <div>
      <label htmlFor="filterType">Choose a filter type (default fade):</label>
      <br/>
      <select name="filterType"
              id="filterType"
              value={state.filterType}
              onChange={(e)=>setState({filterType: e.target.value as TState['filterType']})}>
        <option value='fade'>Fade</option>
        <option value="radial">Radial</option>
        <option value="hlslice">Hlslice</option>
        <option value="vuslice">Vuslice</option>
        <option value="hblur">Hblur</option>
      </select>
      </div>
      <hr/>

      <button onClick={generate}>Generate result video</button>

      {resultVideoUrl && (
        <>
          <hr/>

          <h2>Result video</h2>
          <VideoComponent options={options} />
        </>
      )}
    </div>
  );
}

export default App;
