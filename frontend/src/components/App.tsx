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

function  useResultVideo({ secondVideoUrl, firstVideoUrl }: TState) {
  const [imgName, setImgName] = useState()

  return {
    generate: async () => {
      console.log('secondVideoUrl, firstVideoUrl');
      console.log(secondVideoUrl, firstVideoUrl);

      if (!secondVideoUrl || !firstVideoUrl) {
        alert('select both videos')
        return
      }

      try {
        const response = await axios.post('http://localhost:9000/videos/combine', {
          first: firstVideoUrl,
          second: secondVideoUrl,
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
}

function App() {
  const [shouldCombine, setShouldCombine] = useState(false);

  const [state, setState] = useSetState<TState>()

  // const isResultGenerationEnabled = !!state.firstVideoUrl && !!state.secondVideoUrl

  const { imgUrl: resultVideoUrl, generate } = useResultVideo(state)

  const options = useMemo(() => resultVideoUrl && getVideoOptions(resultVideoUrl), [resultVideoUrl])

  return (
    <div className="app">
      <SingleVideo title="First video" onVideoGenerated={(url) => setState({ firstVideoUrl: url })} />

      <hr/>

      <SingleVideo title="Second video" onVideoGenerated={(url) => setState({ secondVideoUrl: url })} />

      <hr/>

      <span>Combine video</span>
      <input type="checkbox" checked={shouldCombine} onChange={(e) => setShouldCombine(e.target.checked)} />

      <br/>
      <br/>

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
