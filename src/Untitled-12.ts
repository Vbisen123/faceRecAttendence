// import {useRef,useEffect} from 'react'
// import './App.css'
// import * as faceapi from 'face-api.js'

// function App(){
//   const videoRef = useRef()
//   const canvasRef = useRef()

//   // LOAD FROM USEEFFECT
//   useEffect(()=>{
//     startVideo()
//     videoRef && loadModels()

//   },[])



//   // OPEN YOU FACE WEBCAM
//   const startVideo = ()=>{
//     navigator.mediaDevices.getUserMedia({video:true})
//     .then((currentStream)=>{
//       videoRef.current.srcObject = currentStream
//     })
//     .catch((err)=>{
//       console.log(err)
//     })
//   }
//   // LOAD MODELS FROM FACE API

//   const loadModels = ()=>{
//     Promise.all([
//       // THIS FOR FACE DETECT AND LOAD FROM YOU PUBLIC/MODELS DIRECTORY
//       faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
//       faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
//       faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
//       faceapi.nets.faceExpressionNet.loadFromUri("/models")

//       ]).then(()=>{
//       faceMyDetect()
//     })
//   }

//   const faceMyDetect = ()=>{
//     setInterval(async()=>{
//       const detections = await faceapi.detectAllFaces(videoRef.current,
//         new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()

//       // DRAW YOU FACE IN WEBCAM
//       canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(videoRef.current)
//       faceapi.matchDimensions(canvasRef.current,{
//         width:940,
//         height:650
//       })

//       const resized = faceapi.resizeResults(detections,{
//          width:940,
//         height:650
//       })

//       faceapi.draw.drawDetections(canvasRef.current,resized)
//       faceapi.draw.drawFaceLandmarks(canvasRef.current,resized)
//       faceapi.draw.drawFaceExpressions(canvasRef.current,resized)


//     },1000)
//   }

//   return (
//     <div className="myapp">
//     <h1>FAce Detection</h1>
//       <div className="appvide">
        
//       <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
//       </div>
//       <canvas ref={canvasRef} width="940" height="650"
//       className="appcanvas"/>
//     </div>
//     )

// }

// export default App;


// import React, { useRef, useEffect, useState } from 'react';
// import './App.css';
// import * as faceapi from 'face-api.js';

// function App() {
//   const videoRef = useRef();
//   const canvasRef = useRef();
//   const [recognizedPerson, setRecognizedPerson] = useState("");
//   const [recognizedLabels, setRecognizedLabels] = useState([]);
  

//   useEffect(() => {
//     startVideo();
//     loadModels();
//   }, []);

//   const startVideo = () => {
//     navigator.mediaDevices.getUserMedia({ video: true })
//       .then(currentStream => {
//         videoRef.current.srcObject = currentStream;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   const loadModels = async () => {
//     await Promise.all([
//       faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
//       faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//       faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
//       faceapi.nets.faceExpressionNet.loadFromUri('/models'),
//       faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
//       faceapi.nets.ageGenderNet.loadFromUri('/models'),
//     ]);
//     console.log('faceapi.nets',faceapi.nets)
//     faceDetection();
//   }

//   const faceDetection = async () => {
//     const labeledFaceDescriptors = await loadLabeledImages();

//     setInterval(async () => {
//       const detections = await faceapi.detectAllFaces(videoRef.current,
//         new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptors().withFaceExpressions().withAgeAndGender();

//       const context = canvasRef.current.getContext('2d');
//       context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

//       const resized = faceapi.resizeResults(detections, {
//         width: 940,
//         height: 650
//       });
//       faceapi.draw.drawDetections(canvasRef.current, resized);
//       faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);

//       const recognizedLabels = [];

//       for (const detection of detections) {
//         const faceDescriptor = detection.descriptor;
//         const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
//         const bestMatch = faceMatcher.findBestMatch(faceDescriptor);
//         const UNKNOWN_PERSON_THRESHOLD = 0.6;

//       //   if (bestMatch.distance < UNKNOWN_PERSON_THRESHOLD) {
//       //     recognizedLabels.push(`ID: ${bestMatch.label}`);
//       //     console.log(`Recognized: ${bestMatch.label}`);
//       //     const { gender, age } = detection;
//       //     const expressions = detection.expressions;


//       //     const recognizedPersonInfo = `${bestMatch.label} (Gender: ${gender}, Age: ${age.toFixed(0)})`;
//       //     recognizedLabels.push(recognizedPersonInfo);
//       //     console.log(`Gender: ${gender}`);
//       //     console.log(`Age: ${age}`);
//       //     console.log('Expressions:', expressions);

//       //   } else {
//       //     recognizedLabels.push("Unknown Person");
//       //     console.log("Unknown Person");
//       //   }
//       // }

//       if (bestMatch.distance < UNKNOWN_PERSON_THRESHOLD) {
//         const { gender, age } = detection;
//         const expressions = detection.expressions;
//         const recognizedPersonInfo = `ID:${bestMatch.label} (Gender: ${gender}, Age: ${age.toFixed(0)}) `;
//         recognizedLabels.push(recognizedPersonInfo);
//         console.log(`Recognized: ${bestMatch.label}`);
//         console.log(`Gender: ${gender}`);
//         console.log(`Age: ${age}`);
//         console.log('Expressions:', expressions);

//       } else {
//         const gender = detection.gender;
//         const age = detection.age;
//         const expressions = detection.expressions;
//         const unknownPersonInfo = `Unknown Person (Gender: ${gender}, Age: ${age.toFixed(0)}) }`;
//         recognizedLabels.push(unknownPersonInfo);
//         console.log("Unknown Person");
//         console.log(`Gender: ${gender}`);
//         console.log(`Age: ${age}`);
//        // console.log('Expressions:', expressions);
//       }
//     }

//       // Log the current time here
//       const currentTime = new Date().toLocaleTimeString();
//       console.log("Current Time:", currentTime);

//       setRecognizedLabels(recognizedLabels);
//       console.log("Recognized Labels:", recognizedLabels);
//     }, 100);
//   };

//   const loadLabeledImages = async () => {
//     const labeledDescriptors = [];
//     const labels = ['01', '02', '03', '04', '05', '06','11','12','13','14','15'];

//     for (const label of labels) {
//       try {
//         const img = await faceapi.fetchImage(`/Lables/${label}.jpg`);
//         const detection = await faceapi.detectSingleFace(img,
//           new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptor();

//         if (detection) {
//           const descriptor = detection.descriptor;
//           labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(label, [descriptor]));
//         }
//       } catch (error) {
//         console.error(`Error loading or detecting face in image ${label}:`, error);
//       }
//     }

//     return labeledDescriptors;
//   };

//   return (
//     <div className="myapp">
//       <h1>Face Detection</h1>
//       <div className="appvide">
//         <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
//       </div>
//       <canvas ref={canvasRef} width="940" height="650" className="appcanvas" />

//       <div className="recognized-labels">
//         {recognizedLabels.map((label, index) => (
//           <p key={index}>{label}</p>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;

