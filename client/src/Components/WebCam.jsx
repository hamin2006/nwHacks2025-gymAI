import React, { useEffect, useRef, useState } from "react";
import * as pose from "@mediapipe/pose";
import "../css/WebCam.css";

const PoseDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [handRaised, setHandRaised] = useState(false);

  useEffect(() => {
    const setupWebcam = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Set up webcam video stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      video.srcObject = stream;

      // Initialize MediaPipe Pose
      const poseInstance = new pose.Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.3/${file}`;
        },
      });

      // Set up Pose model on results callback
      poseInstance.setOptions({
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      // Detect pose on each frame
      const detectPose = () => {
        poseInstance.send({ image: video }).then((results) => {
          context.clearRect(0, 0, canvas.width, canvas.height); // Clear previous frame
          context.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw video

          // If pose is detected, draw keypoints and check if hand is raised
          if (results.poseLandmarks) {
            // Draw keypoints
            const landmarks = results.poseLandmarks;
            landmarks.forEach((landmark) => {
              context.beginPath();
              context.arc(
                landmark.x * canvas.width,
                landmark.y * canvas.height,
                5,
                0,
                2 * Math.PI
              );
              context.fillStyle = "red";
              context.fill();
            });

            // Check if the hand is raised above the head
            const leftShoulder = landmarks[11];
            const leftElbow = landmarks[13];
            const leftWrist = landmarks[15];

            // Simple logic: If the wrist is above the shoulder, consider hand raised
            setHandRaised(leftWrist.y < leftShoulder.y);
          }

          requestAnimationFrame(detectPose);
        });
      };

      detectPose();
    };

    setupWebcam();

    return () => {
      // Clean up when component unmounts
      const video = videoRef.current;
      const stream = video.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="App">
      <h1>Gym Trainer - Hand Above Head</h1>
      <video
        ref={videoRef}
        width="640"
        height="480"
        autoPlay
        muted
        style={{ display: "none" }}
      ></video>
      <canvas ref={canvasRef} width="640" height="480"></canvas>
      <div>
        {handRaised ? (
          <p>Hand raised above the head! Red dot on face.</p>
        ) : (
          <p>Move your hand above the head to trigger the effect.</p>
        )}
      </div>
    </div>
  );
};

export default PoseDetection;
