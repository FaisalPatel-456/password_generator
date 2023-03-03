const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 15;
let checkCount = 0;

handleSlider();
setIndicator("#ccc");

//set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandInt(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}

function generateNumber(){
    return getRandInt(0, 9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandInt(97, 123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandInt(65, 91));
}

function generateSymbol(){
    const randNum = getRandInt(0, symbols.length);

    return symbols.charAt(randNum);
}

function calcStrength() {

    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent(){

    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch{
        copyMsg.innerText = "failed"
    }

    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function handleCheckBoxChange(){
    checkCount = 0;

    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
        {
            checkCount++;
        }
    });

    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input', (e) =>{

    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {

    if(passwordDisplay)
    {
        copyContent();
    }
});

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

generateBtn.addEventListener('click', () => {

    //console.log('clicked on generate');

    if(checkCount <= 0){
        return;
    }

    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }

    //main work starts from here

    //remove old password
    password = "";

    let funcArr = [];

    if(uppercaseCheck.checked)
    {
        funcArr.push(generateUpperCase);
    }

    if(lowercaseCheck.checked)
    {
        funcArr.push(generateLowerCase);
    }

    if(numbersCheck.checked)
    {
        funcArr.push(generateNumber);
    }

    if(symbolsCheck.checked)
    {
        funcArr.push(generateSymbol);
    }

    // add compulsory chars according to checkboxes
    for(let i = 0; i < funcArr.length; i++){
        password += funcArr[i]();
    }

    //add remaining length of password randomly
    for(let i = 0; i < passwordLength - funcArr.length; i++){

        let randInd = getRandInt(0, funcArr.length);

        password += funcArr[randInd]();
    }

    //console.log('password made');

    //shuffle password
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;

    // calculate strength
    calcStrength();

});

