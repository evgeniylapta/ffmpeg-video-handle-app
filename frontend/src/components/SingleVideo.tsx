import { useSetState } from 'react-use'
import { FC, MutableRefObject, Ref, useMemo, useRef } from 'react';
import { getVideoOptions, usePlayerHandle } from './hooks';
import VideoComponent from './VideoComponent';
import axios from 'axios';

type TState = {
  imageSrc?: string
  cropLimit?: string
  cropOffset?: string
  brightness?: string
  contrast?: string
  saturation?: string
  gamma?: string
}

function useGenerate(
  fileInputRef: MutableRefObject<any>,
  logoInputRef: MutableRefObject<any>,
  audioInputRef: MutableRefObject<any>,
  subtitlesInputRef: MutableRefObject<any>
) {
  return async ({ cropOffset, cropLimit, brightness, contrast, saturation, gamma }: TState, callback: (url: string) => void) => {
    const video = fileInputRef.current?.files[0]
    const logo = logoInputRef.current?.files[0]
    const audio = audioInputRef.current?.files[0]
    const subtitles = subtitlesInputRef.current?.files[0]

    const formData = new FormData();

    if (!video) {
      alert('Please select a video')
      return
    }

    formData.append("video", video);

    if (logo) {
      formData.append('logo', logo)
    }

    if (audio) {
      formData.append('audio', audio)
    }

    if (subtitles) {
      formData.append('subtitles', subtitles)
    }

    if (cropOffset) {
      formData.append('cropOffset', cropOffset)
    }

    if (cropLimit) {
      formData.append('cropLimit', cropLimit)
    }

    if (brightness) {
      formData.append('brightness', brightness)
    }

    if (contrast) {
      formData.append('contrast', contrast)
    }

    if (saturation) {
      formData.append('saturation', saturation)
    }

    if (gamma) {
      formData.append('gamma', gamma)
    }

    try {
      const response = await axios.post('http://localhost:9000/videos/edit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      callback(response.data)

      return response.data
    } catch (e) {
      throw new Error('Something went wrong')
    }
  }
}

const SingleVideo: FC<{ title: string, onVideoGenerated: (url: string) => void }> = ({ title, onVideoGenerated }) => {
  const [state, setState] = useSetState<TState>({})
  const videoInputRef = useRef<any>()
  const logoInputRef = useRef<any>()
  const audioInputRef = useRef<any>()
  const subtitlesInputRef = useRef<any>()

  const { imageSrc, cropLimit, cropOffset, brightness, contrast, saturation, gamma } = state

  const generate = useGenerate(videoInputRef, logoInputRef, audioInputRef, subtitlesInputRef)

  const options = useMemo(() => imageSrc && getVideoOptions(imageSrc), [imageSrc])

  return (
    <div>
      <h2>{title}</h2>
      <div style={{ display: 'flex', position: 'relative' }}>
        <div>
          {imageSrc && options && (<div style={{ position: 'absolute',  right: 400, top: 0 }}><VideoComponent options={options} /></div>)}

          <br/>

          Video
          <br/>
          <input type="file" ref={videoInputRef}/>

          <br/>
          <br/>
          <br/>

          Crop offset
          <br/>
          <input type="text" value={cropOffset} onChange={(e) => setState({ cropOffset: e.target.value })}/>

          <br/>


          Crop limit
          <br/>
          <input type="text" value={cropLimit} onChange={(e) => setState({ cropLimit: e.target.value })}/>

          <br/>

          <br/>
          <br/>

          Logo (template image)
          <br/>
          <input type="file" ref={logoInputRef}/>

          <br/>
          <br/>

          Audio
          <br/>
          <input type="file" ref={audioInputRef}/>

          <br/>
          <br/>

          Subtitles
          <br/>
          <input type="file" ref={subtitlesInputRef}/>

          <br/>
          <br/>
        </div>
        <div>
          <h4>filters</h4>

          Brightness (from -1 to 1, default 0)
          <br/>
          <input type="text" value={brightness} onChange={(e) => setState({ brightness: e.target.value })}/>

          <br/>
          <br/>

          Contrast (from -1000 to 1000, default 1)
          <br/>
          <input type="text" value={contrast} onChange={(e) => setState({ contrast: e.target.value })}/>

          <br/>
          <br/>

          Saturation (from 0 to 3, default 1)
          <br/>
          <input type="text" value={saturation} onChange={(e) => setState({ saturation: e.target.value })}/>

          <br/>
          <br/>

          Gamma (from 0.1 to 10, default 1)
          <br/>
          <input type="text" value={gamma} onChange={(e) => setState({ gamma: e.target.value })}/>
        </div>
      </div>

      <br/>
      <br/>
      <br/>

      <button onClick={() => {generate(state, (url) => {
        console.log('url');
        console.log(url);
        setState({ imageSrc: url })
        onVideoGenerated(url)
      })}}>Make video</button>
    </div>
  )
}

export default SingleVideo;
