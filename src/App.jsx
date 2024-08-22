import { useState } from "react";
import "./App.css";
import axios from "axios";
import Lottie from "react-lottie";
import animationData from "../src/assets/loader.json";

const lottieDefaultOptions = (animationData, loop = true, autoplay = true) => ({
  loop,
  autoplay,
  animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
});

function App() {
  const [originalVideo, setOriginalVideo] = useState(null);
  const [videos, setVideos] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);

    try {
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = response.data;
      console.log(result);
      setOriginalVideo(result.originalVideo); // Set the original video URL
      setVideos(result.videos); // Set the translated videos URLs
    } catch (error) {
      console.error("Error uploading video:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <nav className="navbar navbar-expand-lg">
        <a className="navbar-brand" href="#">
          <img src="../src/assets/logo.svg" alt="Logo" />
        </a>
      </nav>
      <div className="container" id="main-content">
        <h1 className="my-4" style={{ paddingBottom: "100px !important" }}>
          Upload a Video to Translate into Arabic, French and Spanish
        </h1>
        <form
          id="uploadForm"
          encType="multipart/form-data"
          className="mb-4"
          onSubmit={handleSubmit}
        >
          <div className="form-group row justify-content-center mb-3">
            <div className="col-md-6">
              <label htmlFor="formFileLg" className="form-label">
                Select a video file
              </label>
              <input
                className="form-control form-control-lg"
                id="formFileLg"
                name="video"
                type="file"
                accept="video/*"
                required
              />
            </div>
          </div>
          <div className="form-group row justify-content-center">
            <div className="col-md-6">
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
              >
                Upload
              </button>
            </div>
          </div>
        </form>
        <div id="videos" className="row">
          {originalVideo && (
            <div className="col-md-12 mb-4">
              <video controls className="w-100">
                <source src={originalVideo} type="video/mp4" />
              </video>
              <p>Original Video</p>
            </div>
          )}

          {videos.map((video, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <video controls className="w-100">
                <source src={video} type="video/mp4" />
              </video>
              <p>{["Arabic", "French", "Spanish"][index]}</p>
            </div>
          ))}
        </div>
      </div>
      {loading && (
        <div id="overlay">
          <div style={{ width: "500px", height: "500px" }}>
            <Lottie options={lottieDefaultOptions(animationData)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
