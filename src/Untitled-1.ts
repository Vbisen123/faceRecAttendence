
  // const faceDetection = async () => {
  //   const labeledFaceDescriptors = await loadLabeledImages();
  
  //   setInterval(async () => {
  //     const detections = await faceapi.detectAllFaces(videoRef.current,
  //       new faceapi.MtcnnOptions()).withFaceLandmarks();
  
  //     const context = canvasRef.current.getContext('2d');
  //     context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  
  //     if (detections && detections.length > 0) {
  //       const landmarks = detections[0].landmarks; // MTCNN returns an array of detections
  
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
  
  //       const recognizedData = [];
  
  //       for (const detection of allDetections) {
  //         const faceDescriptor = detection.descriptor;
  //         const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
  //         const bestMatch = faceMatcher.findBestMatch(faceDescriptor);
  //         const UNKNOWN_PERSON_THRESHOLD = 0.5;
  
  //         const gender = detection.gender;
  //         const age = detection.age;
  //         const expressions = detection.expressions;
  //         const personData = {
  //           id: bestMatch.label,
  //           gender: gender,
  //           age: age.toFixed(0),
  //           expressions: expressions
  //         };

  //       recognizedData.push(personData);

  //       if (bestMatch.distance < UNKNOWN_PERSON_THRESHOLD) {
  //         console.log(`Recognized: ${bestMatch.label}`);
  //         // console.log(`Gender: ${gender}`);
  //         // console.log(`Age: ${age}`);
  //         // console.log('Expressions:', expressions);

  //       } else {
  //         console.log("Unknown Person");
  //         // console.log(`Gender: ${gender}`);
  //         // console.log(`Age: ${age}`);
  //         // console.log('Expressions:', expressions);
  //       }
  //     }

  //     // Log the current time here
  //     const currentTime = new Date().toLocaleTimeString();
  //     console.log("Current Time:", currentTime);

  //     setRecognizedData(recognizedData);
  //     console.log("Recognized Data:", recognizedData);
  //   }
  //   }, 1000);
  // };
