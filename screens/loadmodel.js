
  useEffect(() => {

      const loadModel = async () => {
        const model = await tf
          .loadLayersModel(bundleResourceIO(modelJSON, modelWeights))
          .catch(e => console.log(e));
        console.log("Model loaded!");
       // return model;
      

      
  
       const texts = [
        "Help! There's an urgent situation on campus!",
        "I need immediate assistance! Please respond quickly!",
        "I'm in trouble and need help as soon as possible.",
        "This is urgent! We require immediate support!",
        "I need support",
        "my professor is sexist",
        "I feel really bad after what happened yesterday"
      ];

      
      
      const paddedSequences = padSequences(sequences, maxlen);
     // const paddedSequences = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 22, 9, 78];
      console.log(paddedSequences);
        const predictions = model.predict(paddedSequences);
        console.log(predictions);

        const results = [];
  
        predictions.array().then((array) => {
          texts.forEach((text, index) => {
            const prediction = array[index][0];
            results.push({ text, prediction });
          });
  
          console.log(results);
        });
  
        model.dispose();

    };
  
    loadModel();
  }, []);