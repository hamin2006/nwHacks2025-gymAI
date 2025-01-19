import React, { useEffect, useRef, useState } from "react";
import { Holistic } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import "../css/WebCam.css";

const WebcamWithLandmarks = ({exercise, callback}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [reps, setReps] = useState(0);
  const [timer, setTimer] = useState(60);
  const [isDown, setIsDown] = useState(false);
  const armRaisedRef = useRef(false);
  const isInDownPositionRef = useRef(false);
  const situpsStateRef = useRef({ wasUpPosition: false });
  const [repInfo, setRepInfo] = useState([]);
  const Exercises = {
    SQUATS: "squats",
    PUSHUPS: "pushups",
    SITUPS: "situps",
    PLANK: "plank"
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
      const leftHip = results.poseLandmarks?.[23] || null;
      const rightHip = results.poseLandmarks?.[24] || null;
      const leftKnee = results.poseLandmarks?.[25] || null;
      const rightKnee = results.poseLandmarks?.[26] || null;
      const leftAnkle = results.poseLandmarks?.[27] || null;
      const rightAnkle = results.poseLandmarks?.[28] || null;
      
      if (!leftHip || !rightHip || !leftKnee || !rightKnee || !leftAnkle || !rightAnkle) {
        return false;
      }

      const leftLegAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
      const rightLegAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
      
      return ((leftLegAngle <= 100) && (rightLegAngle <= 100));
    },
  
    pushups: (results) => {
      const leftHip = results.poseLandmarks?.[23] || null;
      const rightHip = results.poseLandmarks?.[24] || null;
      const leftShoulder = results.poseLandmarks?.[11] || null;
      const rightShoulder = results.poseLandmarks?.[12] || null;
      const leftElbow = results.poseLandmarks?.[13] || null;
      const rightElbow = results.poseLandmarks?.[14] || null;
      const leftWrist = results.poseLandmarks?.[15] || null;
      const rightWrist = results.poseLandmarks?.[16] || null;

      if (!leftShoulder || !rightShoulder || !leftHip || !rightHip || !leftElbow || !rightElbow || !leftWrist || !rightWrist) {
        return { isDownPosition: false, isUpPosition: false };
      }
  
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
      const leftElbow = results.poseLandmarks?.[13] || null;
      const rightElbow = results.poseLandmarks?.[14] || null;
      const leftKnee = results.poseLandmarks?.[25] || null;
      const rightKnee = results.poseLandmarks?.[26] || null;
      const leftHip = results.poseLandmarks?.[23] || null;
      const rightHip = results.poseLandmarks?.[24] || null;
      const leftAnkle = results.poseLandmarks?.[27] || null;
      const rightAnkle = results.poseLandmarks?.[28] || null;
      const leftShoulder = results.poseLandmarks?.[11] || null;
      const rightShoulder = results.poseLandmarks?.[12] || null;

      if (!leftElbow || !rightElbow || !leftKnee || !rightKnee || !leftHip || !rightHip) {
        return false;
      }
      const angleOne = calculateAngle(leftHip, leftKnee, leftAnkle);
      const angleTwo = calculateAngle(rightHip, rightKnee, rightAnkle);
      const angleThree = calculateAngle(leftShoulder, leftHip, leftKnee);
      const angleFour = calculateAngle(rightShoulder, rightHip, rightKnee);

      return (angleOne < 90 && angleTwo < 90 && angleThree < 60 && angleFour < 60);
    },

    plank: (results) => {
      const leftHip = results.poseLandmarks?.[23] || null;
      const rightHip = results.poseLandmarks?.[24] || null;
      const leftShoulder = results.poseLandmarks?.[11] || null;
      const rightShoulder = results.poseLandmarks?.[12] || null;
      const leftElbow = results.poseLandmarks?.[13] || null;
      const rightElbow = results.poseLandmarks?.[14] || null;
      const leftWrist = results.poseLandmarks?.[15] || null;
      const rightWrist = results.poseLandmarks?.[16] || null;
      const leftAnkle = results.poseLandmarks?.[27] || null;
      const rightAnkle = results.poseLandmarks?.[28] || null;

      if (!leftShoulder || !rightShoulder || !leftHip || !rightHip || !leftElbow || !rightElbow || !leftWrist || !rightWrist) {
        return false;
      }
      const leftBody = calculateAngle(leftShoulder, leftHip, leftAnkle);
      const rightBody = calculateAngle(rightShoulder, rightHip, rightAnkle);

      const leftShoulderToTorsoY = Math.abs(leftShoulder.y - leftHip.y);
      const rightShoulderToTorsoY = Math.abs(rightShoulder.y - rightHip.y);

      const threshold = 0.1;

      const isLeftShoulderNearGround = leftShoulderToTorsoY < threshold;
      const isRightShoulderNearGround = rightShoulderToTorsoY < threshold;
  
      const isDown = (isLeftShoulderNearGround && isRightShoulderNearGround) && leftBody > 150 && rightBody > 150;
  
      return isDown;
    }
  };

  const finishExercise =  () => {
    callback(repInfo);
  };
  
  const logRepInfo = (results, repCurr) => {
    const leftHip = results.poseLandmarks?.[23] || null;
    const rightHip = results.poseLandmarks?.[24] || null;
    const leftShoulder = results.poseLandmarks?.[11] || null;
    const rightShoulder = results.poseLandmarks?.[12] || null;
    const leftElbow = results.poseLandmarks?.[13] || null;
    const rightElbow = results.poseLandmarks?.[14] || null;
    const leftWrist = results.poseLandmarks?.[15] || null;
    const rightWrist = results.poseLandmarks?.[16] || null;
    const leftAnkle = results.poseLandmarks?.[27] || null;
    const rightAnkle = results.poseLandmarks?.[28] || null;
    const leftKnee = results.poseLandmarks?.[25] || null;
    const rightKnee = results.poseLandmarks?.[26] || null;

    if (exercise !== "plank" && exercise !== "wallsits") {
      const repData = {
        rep: repCurr,
        exercise,
        landmarks: {
          leftHip: { x: leftHip?.x, y: leftHip?.y },
          rightHip: { x: rightHip?.x, y: rightHip?.y },
          leftShoulder: { x: leftShoulder?.x, y: leftShoulder?.y },
          rightShoulder: { x: rightShoulder?.x, y: rightShoulder?.y },
          leftElbow: { x: leftElbow?.x, y: leftElbow?.y },
          rightElbow: { x: rightElbow?.x, y: rightElbow?.y },
          leftWrist: { x: leftWrist?.x, y: leftWrist?.y },
          rightWrist: { x: rightWrist?.x, y: rightWrist?.y },
          leftAnkle: { x: leftAnkle?.x, y: leftAnkle?.y },
          rightAnkle: { x: rightAnkle?.x, y: rightAnkle?.y },
          leftKnee: { x: leftKnee?.x, y: leftKnee?.y },
          rightKnee: { x: rightKnee?.x, y: rightKnee?.y }
        }
      };
      setRepInfo((prevRepInfo) => [...prevRepInfo, repData]);
    };
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

    const canvasCtx = canvasRef.current ? canvasRef.current.getContext("2d") : null;
    if (canvasCtx) {
    holistic.onResults(async (results) => {
      // Set canvas dimensions to match video
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      // Clear canvas
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Draw video feed
      canvasCtx.drawImage(results.image,0,0,canvasRef.current.width,canvasRef.current.height);

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

      if (exercise === Exercises.PUSHUPS) {
        const { isDownPosition, isUpPosition } = exerciseFunctions[exercise](results);
        if (isDownPosition && !isInDownPositionRef.current) {
          isInDownPositionRef.current = true;
        } else if (isUpPosition && isInDownPositionRef.current) {
          isInDownPositionRef.current = false;
            setReps((prevReps) => {
            logRepInfo(results, prevReps + 1);
            return prevReps + 1;
            });
        }
      } else if (exercise === Exercises.SQUATS) {
        const isDown = exerciseFunctions[exercise](results);
        if (isDown) {
          if (!armRaisedRef.current) {
            armRaisedRef.current = true;
            setReps((prevReps) => {
              logRepInfo(results, prevReps + 1);
              return prevReps + 1;
              });
          };
        } else {
          armRaisedRef.current = false;
        }
      } else if (exercise === Exercises.SITUPS) {
        const isUpPosition  = exerciseFunctions[exercise](results);
        if (isUpPosition && !situpsStateRef.current.wasUpPosition) {
          setReps((prevReps) => {
            logRepInfo(results, prevReps + 1);
            return prevReps + 1;
            });
        }
        situpsStateRef.current.wasUpPosition = isUpPosition;
      } else if (exercise === Exercises.PLANK) {
        setIsDown(exerciseFunctions[exercise](results));
      };

      if (results.poseLandmarks) drawLandmarks(canvasCtx, results.poseLandmarks, "red");
      if (results.faceLandmarks) drawLandmarks(canvasCtx, results.faceLandmarks, "blue");
      if (results.leftHandLandmarks) drawLandmarks(canvasCtx, results.leftHandLandmarks, "lightgreen");
      if (results.rightHandLandmarks) drawLandmarks(canvasCtx, results.rightHandLandmarks, "lightgreen");
    })};

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await holistic.send({ image: videoRef.current });
      },
      width: 960,
      height: 600,
    });

    camera.start();

    return () => {
      camera.stop();
      holistic.close();
    };
  }, []);

  useEffect(() => {
    if (exercise === Exercises.PLANK && timer > 0) {
      let interval;
      if (isDown) {
        interval = setInterval(() => {
          setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
        }, 1000);
      };

      return () => clearInterval(interval);
    }
  }, [exercise, timer, isDown, Exercises.PLANK]);

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
      <h1>{exercise === Exercises.PLANK ? `Timer: ${timer} s` : `Reps: ${reps}`}</h1>
      <button className="finish-exercise" onClick = {finishExercise}>Finish Exercise</button>
    </div>
  );
};

export default WebcamWithLandmarks;
