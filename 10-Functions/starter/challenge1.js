'use strict'

const poll = {
  question: 'What is your favourite programming language?',
  options: ['0: JavaScript', '1: Python', '2: Rust', '3:C++'],
  answers: new Array(4).fill(0),
  registerNewAnswer() {
    const input = Number(prompt(promptText(this)))
    if (isNaN(input) || input < 0 || input >= this.answers.length) {
      console.log('Invalid input! Try again...');
      return;
    }
    this.answers[input] = this.answers[input] + 1;
    this.displayResults()
  },
  displayResults(type) {
    switch (type) {
      case 'string':
        console.log(`Poll results are ${this.answers.join(', ')}.`)
        break;
      default:
        console.log(this.answers);
    }
  }
};

function promptText(obj) {
  return `${obj.question}\n${obj.options.join('\n')}\n(Write option number)`;
}

document.querySelector('.poll').addEventListener('click', poll.registerNewAnswer.bind(poll));

poll.displayResults.call({ answers: [1, 5, 3, 9, 6, 1] });
poll.displayResults.call({ answers: [1, 5, 3, 9, 6, 1] }, 'string');
