import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuestion: 0,
      score: 0,
      showScore: false,
      startPage: true,
      seconds: 0,
      equationsArray: this.questions()
      
    }
    this.playAgain = this.playAgain.bind(this);
    this.intervalId = 0;
  }
  
  // Get Random Number up to a Max Number
  getRandomInt = (max) =>  {
    return Math.floor(Math.random() * Math.floor(max));
  }

  // Shuffle Array
  shuffleArray = (equationsArray) => {
    let i = equationsArray.length - 1;
    for (; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = equationsArray[i];
      equationsArray[i] = equationsArray[j];
      equationsArray[j] = temp;
    }
    return equationsArray;
  }

  // Create a new array
  questions() {
    const questionAmount = 10;
    let equationsArray = [];
    let firstNumber = 0;
    let secondNumber = 0;
    let equationObject = {};
    let wrongFormat = [];
    const correctEquations = this.getRandomInt(questionAmount);
    console.log('correct equations:', correctEquations);
    // Set amount of wrong equations
    const wrongEquations = questionAmount - correctEquations;
    console.log('wrong equations:', wrongEquations);
    // Loop through, multiply random numbers up to 9, push to array
    for (let i = 0; i < correctEquations; i++) {
      firstNumber = this.getRandomInt(9);
      secondNumber = this.getRandomInt(9);
      const equationValue = firstNumber * secondNumber;
      const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
      equationObject = { value: equation, evaluated: true };
      equationsArray.push(equationObject);
    }
    // Loop through, mess with the equation results, push to array
    for (let i = 0; i < wrongEquations; i++) {
      firstNumber = this.getRandomInt(9);
      secondNumber = this.getRandomInt(9);
      const equationValue = firstNumber * secondNumber;
      wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
      wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
      wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
      const formatChoice = this.getRandomInt(2);
      const equation = wrongFormat[formatChoice];
      equationObject = { value: equation, evaluated: false };
      equationsArray.push(equationObject);
    }
    return this.shuffleArray(equationsArray);
  }


  handleAnswerOptionClick = (evaluated) => {
    if (evaluated === true) {
      this.setState({score: this.state.score + 1});
    }
    const nextQuestion = this.state.currentQuestion + 1;
    if (nextQuestion < this.state.equationsArray.length) {
      this.setState({currentQuestion: nextQuestion});
    } else {
      this.setState({showScore: true});
      this.stopTimer();
    }
  };

  // Play again button
  playAgain() {
    this.setState({
      showScore: false,
      currentQuestion: 0,
      score: 0,
      equationsArray: this.questions(),
      seconds: 0,
    });
    this.startTimer();
  }

  // Changing Start Page Value
  setStartPage = (value) =>  {
    this.setState({startPage: value})
  }


  // Timer
  startTimer() {
    this.intervalId = setInterval(() => {
      this.setState({seconds: this.state.seconds + 1})
    }, 1000) 
  }

  stopTimer() {
    clearInterval(this.intervalId);
  }


  render() {
    return (
      <div className='app'>
       
        {/* Start Page */}
        {this.state.startPage &&
        <div className='start-page'>
          <span className='start-text'>Multiplication Game</span>
          <span className='instructions'>Evaluate the equation: Faux(False) Vrai(True)</span>
          <button onClick={() => 
            {
              this.setStartPage(false);
              this.startTimer();
            }}>Start Game</button>
        </div>
        }
  
        {/* Question Page */}
        {!this.state.startPage && !this.state.showScore 
        ?
          <div className='question-page'>  
             <div className='question-section' id='question-section'>
               <div className='question-text'>
                 {this.state.equationsArray[this.state.currentQuestion].value}
              </div>
            </div>
            <div className='answer-section'>
              <button onClick={() => this.handleAnswerOptionClick(this.state.equationsArray[this.state.currentQuestion].evaluated === false)}>Faux</button>
              <button onClick={() => this.handleAnswerOptionClick(this.state.equationsArray[this.state.currentQuestion].evaluated === true)}>Vrai</button>
            </div>
          </div>
        : ''}      

        {/* Score Page */}
        {!this.state.startPage && this.state.showScore ? 
          <div className='score-section'>
           <span className='score-text'>You scored {this.state.score} out of {this.state.equationsArray.length}</span>
           <span className='time'>Time: {this.state.seconds.toFixed(1)}'s</span>
           <button onClick={this.playAgain}>Jouer Encore (Play Again)</button>
         </div>
        : ''}


      </div>
    );
  }
}


