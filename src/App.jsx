import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import * as faceapi from 'face-api.js';
import { updateAttendance } from './components/api';

function App() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [recognizedPerson, setRecognizedPerson] = useState("");
  const [recognizedData, setRecognizedData] = useState([]);

  useEffect(() => {
    startVideo();
    loadModels();
  }, []);

  // const startVideo = () => {
  //   navigator.mediaDevices.getUserMedia({ video: true })
  //     .then(currentStream => {
  //       videoRef.current.srcObject = currentStream;
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }

  const startVideo = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa:',devices)
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      if (videoDevices.length > 0) {
        const externalCamera = videoDevices.find(device => device.deviceId === 'ie+0N1nJcBqpGs+RXnIQIHk3TQw2r5OxpAK0vzJmRNo=');
        const selectedDevice = externalCamera || videoDevices[0];

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: selectedDevice.deviceId }
        });

        videoRef.current.srcObject = stream;
      } else {
        console.log('No video devices found.');
      }
    } catch (error) {
      console.error('Error starting video:', error);
    }
  };




  const loadModels = async () => {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      faceapi.nets.ageGenderNet.loadFromUri('/models'),
      faceapi.nets.mtcnn.loadFromUri('/models')
    ]);
    console.log('faceapi.nets', faceapi.nets);
    faceDetection();
  };


  // const drawJawline = (landmarks, context) => {
  //   const jawline = landmarks.getJawOutline(); // Get jawline points

  //   context.beginPath();
  //   context.moveTo(jawline[0].x, jawline[0].y);
  //   for (const point of jawline) {
  //     context.lineTo(point.x, point.y);
  //   }
  //   context.closePath();
  //   context.strokeStyle = 'blue'; // Change color to blue
  //   context.lineWidth = 2;
  //   context.stroke();
  // };

  // const faceDetection = async () => {
  //   const labeledFaceDescriptors = await loadLabeledImages();

  //   setInterval(async () => {
  //     const detections = await faceapi.detectSingleFace(videoRef.current,
  //       new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();


  //     const context = canvasRef.current.getContext('2d');
  //     context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

  //     if (detections) {
  //       const landmarks = detections.landmarks;

  //       // Define the eye and forehead regions manually based on landmarks
  //       const eyeRegion = landmarks.getLeftEye().concat(landmarks.getRightEye());
  //       const foreheadRegion = [landmarks.getLeftEye()[0], landmarks.getRightEye()[3], landmarks.getNose()[0]];

  //       const eyeDetections = await faceapi.detectAllFaces(videoRef.current,
  //         new faceapi.TinyFaceDetectorOptions())
  //         .withFaceLandmarks()
  //         .withFaceDescriptors()
  //         .withFaceExpressions()
  //         .withAgeAndGender();

  //       const foreheadDetections = await faceapi.detectAllFaces(videoRef.current,
  //         new faceapi.TinyFaceDetectorOptions())
  //         .withFaceLandmarks()
  //         .withFaceDescriptors()
  //         .withFaceExpressions()
  //         .withAgeAndGender();

  //       const allDetections = eyeDetections.concat(foreheadDetections);

  //       const resized = faceapi.resizeResults(allDetections, {
  //         width: 940,
  //         height: 650
  //       });
  //       faceapi.draw.drawDetections(canvasRef.current, resized);
  //       faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
  //       faceapi.draw.drawFaceExpressions(canvasRef.current, resized);

  //       // drawJawline(landmarks, context);

  //       const recognizedData = [];

  //       for (const detection of allDetections) {
  //         const faceDescriptor = detection.descriptor;
  //         const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
  //         const bestMatch = faceMatcher.findBestMatch(faceDescriptor);
  //         const UNKNOWN_PERSON_THRESHOLD = 0.5;
  //         const expressions = detection.expressions;
  //         const dominantExpression = getDominantExpression(expressions);




  //         const gender = detection.gender;
  //         const age = detection.age;
  //         //const expressions = detection.expressions;
  //         const personData = {
  //           id: bestMatch.label,
  //           gender: gender,
  //           age: age.toFixed(0),
  //           expressions: expressions,
  //           dominantExpression: dominantExpression,



  //         };

  //       recognizedData.push(personData);

  //       if (bestMatch.distance < UNKNOWN_PERSON_THRESHOLD) {
  //         console.log(`Recognized: ${bestMatch.label}`);

  //       } else {
  //         console.log("Unknown Person");

  //       }
  //     }

  //     // Log the current time here
  //     const currentTime = new Date().toLocaleTimeString();
  //     console.log("Current Time:", currentTime);

  //     setRecognizedData(recognizedData);
  //     console.log("Recognized Data:", recognizedData);
  //   }
  //   }, 500);
  // }; 


  const faceDetection = async () => {
    const labeledFaceDescriptors = await loadLabeledImages();

    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(videoRef.current,
        new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withFaceExpressions()
        .withAgeAndGender();

      const context = canvasRef.current.getContext('2d');
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      const resized = faceapi.resizeResults(detections, {
        width: 940,
        height: 650
      });
      faceapi.draw.drawDetections(canvasRef.current, resized);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resized);

      const recognizedData = [];

      for (const detection of detections) {
        const faceDescriptor = detection.descriptor;
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
        const bestMatch = faceMatcher.findBestMatch(faceDescriptor);
        const UNKNOWN_PERSON_THRESHOLD = 0.7;
        const expressions = detection.expressions;
        const dominantExpression = getDominantExpression(expressions);

        const gender = detection.gender;
        const age = detection.age;
        const personData = {
          id: `${bestMatch.label}`,
          gender: gender,
          age: age.toFixed(0),
          expressions: expressions,
          dominantExpression: dominantExpression,
          time:new Date().toLocaleTimeString(),
          
        };

        recognizedData.push(personData);
        console.table('Recognized', `${bestMatch.label}`, `${bestMatch.distance}`);
        if (bestMatch.distance < UNKNOWN_PERSON_THRESHOLD) {
          updateDatabase(bestMatch.label);
         // console.log(updateAttendance)
          console.log(`Recognized: ${bestMatch.label}`);
          // console.table('Recognized', `${bestMatch.label}`, `${bestMatch.distance}`);
        } else {
          console.log("Unknown Person");
        }
      }

      // Log the current time here
      const currentTime = new Date().toLocaleTimeString();
      //console.log("Current Time:", currentTime);


      setRecognizedData(recognizedData);
    //  console.log("Recognized Data:", recognizedData);
      updateDatabase(recognizedData);
    }, 500);
  };

  const getDominantExpression = (expressions) => {
    let dominantExpression = null;
    let maxConfidence = 0;

    for (const expression in expressions) {
      if (expressions[expression] > maxConfidence) {
        maxConfidence = expressions[expression];
        dominantExpression = expression;
      }
    }

    return dominantExpression;
  };

  const loadLabeledImages = async () => {
    const labeledDescriptors = [];

    const labels = ['mukul','05', '06','16','17','18','19','20','21'];

    for (const label of labels) {
      const descriptors = [];

      try {
        const img = await faceapi.fetchImage(`/Lables/${label}.jpg`);
        const detection = await faceapi.detectSingleFace(img,
          new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptor();

        if (detection) {
          const descriptor = detection.descriptor;
          descriptors.push(descriptor);
        }
      } catch (error) {
        console.error(`Error loading or detecting face in image ${label}:`, error);
      }

      // Load additional images with appended numbers
      let i = 1;
      while (true) {
        try {
          const img = await faceapi.fetchImage(`/Lables/${label}_${i}.jpg`);
          const detection = await faceapi.detectSingleFace(img,
            new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptor();

          if (detection) {
            const descriptor = detection.descriptor;
            descriptors.push(descriptor);
          }
        } catch (error) {
          // Break the loop when no more images are found
          break;
        }
        i++;
      }

      if (descriptors.length > 0) {
        labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(label, descriptors));
      }
    }

    return labeledDescriptors;
  };


  // ... (your import statements and component definition)

  return (
    <div className="myapp">
      <h1>Face Detection</h1>
      <div className="appvide">
        <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
      </div>
      <canvas ref={canvasRef} width="940" height="650" className="appcanvas" />

      <div className="recognized-labels">
        {recognizedData.map((data, index) => (
          <div key={index} className="recognized-person">
            <p>ID: {data.id},(Gender: {data.gender},Age: {data.age},Expression: {data.dominantExpression})</p>

            {/* <p>Expressions:</p> */}
            {/* <ul>
            {Object.keys(data.expressions).map((expression, index) => (
              <li key={index}>
                {expression}: {data.expressions[expression]}
              </li>
            ))}
          </ul> */}
          </div>
        ))}
      </div>
    </div>
  );

}

export default App;

async function updateDatabase(data) {
  try {
    for (const personData of data) {
      console.log('Updating attendance for ID:', personData.id);
      console.log('Time:', personData.time);

      const response = await fetch(`http://localhost:4000/attendances/${personData.id}`, {
        
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attendance: 1, // Incrementing by one is handled on the server
          last_attendance_date: new Date().toISOString(),
          last_attendance_time: personData.time,
        }),
      });

      if (response.ok) {
        console.log(`Attendance for ID ${personData.label} updated successfully`);
      } else {
        console.error(`Failed to update attendance for ID ${personData.label}`);
      }
    }
  } catch (error) {
    console.error('Error updating database:', error);
  }
}
