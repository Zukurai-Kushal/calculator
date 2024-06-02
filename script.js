function Calculator(){

    this.display = document.querySelector("#display");
    this.buttons = document.querySelectorAll("button");
    this.userInputs = [0];

    document.body.addEventListener("keydown", keydownFunction);
    document.body.addEventListener("keyup", keyupFunction);

    for(const button of this.buttons){
        button.addEventListener("click",(event) => {
            this.inputChar(button.id.split(':')[1].toString());
            event.target.blur();
        });
    }

    function getButtonID(key){
        switch (key){
            case '7':
            case '8':
            case '9':
            case '4':
            case '5':
            case '6':
            case '1':
            case '2':
            case '3':
            case '0':
            case '.':
            case '/':
            case '*':
            case '-':
            case '+':
            case '%':
            case "Backspace":
                return `ID:${key}`;
            case "Delete":
            case "Clear":
                return "ID:Delete";
            case "=":
            case "Enter":
                return "ID:=";
            case "f":
            case "~":
                return "ID:+/-";
            default:
                return null;
        }
    }

    function keydownFunction (event){
        let buttonID = getButtonID(event.key);
        if(buttonID != null){
            let button = document.getElementById(buttonID);
            button.click();
            button.classList.add("keydown-button");
        }
    }

    function keyupFunction(event) {
        let buttonID = getButtonID(event.key);
        if(buttonID != null){
            let button = document.getElementById(buttonID);
            button.classList.remove("keydown-button");
        }
    }

    this.operations = {
        '+' : (a, b) => a+b,
        '-' : (a, b) => a-b,
        '*' : (a, b) => a*b,
        '/' : (a, b) => a/b,
        '%' : (a, b) => a%b,
    }

    this.calculate = function(operands){
        let a = +operands[0]
        let b = +operands[2]
        let op = operands[1]

        if(isNaN(a) || !(op in this.operations) || isNaN(b)) return "ERROR";

        return this.operations[op](a, b)
    }

    this.checkAndCalculate = function(){
        if(this.userInputs.length >= 3){
            let operands = this.userInputs.splice(0, 3);
            let result = this.calculate(operands);
            if(isFinite(result)){
                this.userInputs.unshift(+result.toFixed(3)); //Rounds to 3 decimal places4564564  
            }
            else{
                this.userInputs = ["ERROR"];
            }
            
        }
    }

    this.inputChar = function(char){
        let lastOperand = this.userInputs[this.userInputs.length - 1];
        
        if(lastOperand === "ERROR"){
            this.clear();
            this.inputChar(char);
        }

        else if(char in this.operations){
            if(isNaN(lastOperand)) this.userInputs.pop()
            this.userInputs.push(char);
            this.checkAndCalculate();
        }
        else if (char === '='){
            this.checkAndCalculate();
        }
        else if (char === "+/-"){
            this.flipMagnitude();
        }
        else if (!isNaN(char)){
            
            if(isNaN(lastOperand)){
                this.userInputs.push(char.toString());
            }
            // Remove the previous result (result is number type while user input is string type)
            else if(typeof(lastOperand) === "number"){ 
                this.userInputs.pop();
                this.userInputs.push(char.toString());
            }
            else{
                this.userInputs[this.userInputs.length - 1] += char.toString();
            }
        }
        else if (char === '.' && !isNaN(lastOperand+'.')){
            this.userInputs[this.userInputs.length - 1] += '.';
        }
        else if (char === "Backspace"){
            this.backtrack();
        }
        else if (char === "Delete"){
            this.clear();
        }

        this.updateDisplay();
    }

    this.clear = function(){
        this.userInputs = [0];
    }

    this.backtrack = function(){
        let lastOperand = this.userInputs[this.userInputs.length - 1];
        if(typeof(lastOperand) === "string"){
            if(lastOperand.length <= 1){
                this.userInputs.pop();
                if(this.userInputs.length === 0){
                    this.clear();
                }
            }
            else{
                this.userInputs[this.userInputs.length - 1] = lastOperand.slice(0, -1);
            }
        }
        else{
            this.clear();
        }
    }

    this.updateDisplay = function(){
        let displayString = "";

        displayString = this.userInputs
            .map((char) => {
                switch (char){
                    case '*': return "\u00D7";
                    case '%': return "Mod";
                    case '/': return "\u00F7";
                    default: return char;
                }
            })
            .join(" ");

        display.textContent = displayString;
    }

    this.flipMagnitude = function(){
        let lastOperand = this.userInputs[this.userInputs.length - 1];
        if(isFinite(lastOperand)){
            this.userInputs[this.userInputs.length - 1] = (lastOperand * -1).toString();
        }
    }

    

}

myCal = new Calculator();
