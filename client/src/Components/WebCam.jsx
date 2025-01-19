import React, { useEffect, useRef, useState } from "react";
import { Holistic } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import "../css/WebCam.css";

const WebcamWithLandmarks = ({exercise}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [reps, setReps] = useState(0);
  const armRaisedRef = useRef(false);
  const isInDownPositionRef = useRef(false);
  const Exercises = {
    SQUATS: "squats",
    PUSHUPS: "pushups",
    SITUPS: "situps",
  };

  const calculateAngle = (a, b, c) => {
    const vector1 = { x: a.x - b.x, y: a.y - b.y };
    const vector2 = { x: c.x - b.x, y: c.y - b.y };
    const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
    const magnitude1 = Math.sqrt(vector1.x ** 2 + vector1.y ** 2);
    const magnitude2 = Math.sqrt(vector2.x ** 2 + vector2.y ** 2);
    const angleRad = Math.acos(dotProduct / (magnitude1 * magnitude2));
    return (angleRad * 180) / Math.PI;
  };

  const exerciseFunctions = {
    squats: (results) => {
      // Squat detection logic
      const leftHip = results.poseLandmarks[23];
      const rightHip = results.poseLandmarks[24];
      const leftKnee = results.poseLandmarks[25];
      const rightKnee = results.poseLandmarks[26];
      const leftAnkle = results.poseLandmarks[27];
      const rightAnkle = results.poseLandmarks[28];
  
      const leftLegAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
      const rightLegAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
  
      return ((leftLegAngle <= 100) && (rightLegAngle <= 100));
    },
  
    pushups: (results) => {
      const leftHip = results.poseLandmarks[23];
      const rightHip = results.poseLandmarks[24];
      const leftShoulder = results.poseLandmarks[11];
      const rightShoulder = results.poseLandmarks[12];
      const leftElbow = results.poseLandmarks[13];
      const rightElbow = results.poseLandmarks[14];
      const leftWrist = results.poseLandmarks[15];
      const rightWrist = results.poseLandmarks[16];
  
      const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
      const rightArmAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

      const leftShoulderToTorsoY = Math.abs(leftShoulder.y - leftHip.y);
      const rightShoulderToTorsoY = Math.abs(rightShoulder.y - rightHip.y);

      const threshold = 0.1;

      const isLeftShoulderNearGround = leftShoulderToTorsoY < threshold;
      const isRightShoulderNearGround = rightShoulderToTorsoY < threshold;
  
      const isDownPosition = (isLeftShoulderNearGround && isRightShoulderNearGround) && leftArmAngle < 100 && rightArmAngle < 100;

      const isUpPosition = leftArmAngle > 160 && rightArmAngle > 160;
  
      return { isDownPosition, isUpPosition };
    },
  
    situps: (results) => {
      // Sit-up detection logic
      const leftHip = results.poseLandmarks[23];
      const rightHip = results.poseLandmarks[24];
      const leftShoulder = results.poseLandmarks[11];
      const rightShoulder = results.poseLandmarks[12];
  
      const calculateVerticalDistance = (a, b) => Math.abs(a.y - b.y);
  
      const torsoBent =
        calculateVerticalDistance(leftShoulder, leftHip) < 0.2 &&
        calculateVerticalDistance(rightShoulder, rightHip) < 0.2;
  
      return torsoBent;
    },
  };
  

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const holistic = new Holistic({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    });

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      refineFaceLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    const canvasCtx = canvasRef.current.getContext("2d");

    holistic.onResults((results) => {
      // Set canvas dimensions to match video
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      // Clear canvas
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Draw video feed
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      // Function to draw landmarks
      const drawLandmarks = (ctx, landmarks, color) => {
        ctx.fillStyle = color;
        landmarks.forEach((landmark) => {
          const x = landmark.x * canvasRef.current.width;
          const y = landmark.y * canvasRef.current.height;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, 2 * Math.PI);
          ctx.fill();
        });
      };

    const { isDownPosition, isUpPosition } = exerciseFunctions[exercise](results);

    if (isDownPosition && !isInDownPositionRef.current) {
      // Enter "down" position
      isInDownPositionRef.current = true;
    } else if (isUpPosition && isInDownPositionRef.current) {
      // Transition from "down" to "up" -> Count a rep
      isInDownPositionRef.current = false;
      setReps((prevReps) => prevReps + 1);
    }
      

      // Draw landmarks
      if (results.poseLandmarks) drawLandmarks(canvasCtx, results.poseLandmarks, "red");
      if (results.faceLandmarks) drawLandmarks(canvasCtx, results.faceLandmarks, "blue");
      if (results.leftHandLandmarks) drawLandmarks(canvasCtx, results.leftHandLandmarks, "green");
      if (results.rightHandLandmarks) drawLandmarks(canvasCtx, results.rightHandLandmarks, "yellow");
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await holistic.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => {
      camera.stop();
      holistic.close();
    };
  }, []);

  return (
    <div className="webcam">
      <video
        ref={videoRef}
        style={{ display: "none" }}
        autoPlay
        muted
      ></video>
      <canvas
        ref={canvasRef}
      ></canvas>
      <h1>Reps: {reps}</h1>
    </div>
  );
};

export default WebcamWithLandmarks;
