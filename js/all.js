
 // 指定 DOM
var calresultP = document.getElementById("calresult");
var calresulttextP = document.getElementById("calresulttext");
var bmireset = document.querySelector(".bmireset");
var userHeightInput = document.getElementById("userheight");
var userWeightInput = document.getElementById("userweight");
var userbmilist = document.querySelector('.userbmilist');
var userBMIDataPool = JSON.parse(localStorage.getItem('userBMIData')) || [];

// 監聽與更新
calresultP.addEventListener('click',calresultBtnAction,false);
userHeightInput.addEventListener('blur',checkData,false);
userWeightInput.addEventListener('blur',checkData,false);
userbmilist.addEventListener('click', toggleDone);
updateList(userBMIDataPool);

// 計算顯示BMI並新增到localStorage
function calresultBtnAction() {

    if(userHeightInput.value && userWeightInput){
        var currentNow = new Date();
        var month = ["01","02","03","04","05","06","07","08","09","10","11","12"];
        var userFillDate = month[currentNow.getMonth()] + "-" + currentNow.getDate() + "-" + currentNow.getFullYear();
        var userHeightData = parseFloat(userHeightInput.value / 100) ;
        var userWeightData = parseInt(userWeightInput.value);
        var userBMIData = (userWeightData / (userHeightData * userHeightData)).toFixed(2);

        var ArrayBMIResult = levelBMI(userBMIData).split(",");
        var colorBMIResult = ArrayBMIResult[0];
        var textBMIResult = ArrayBMIResult[1];
        //console.log(textBMIResult);

        // calresultP改為顯示BMI，並修改樣式
        calresultP.innerHTML = userBMIData + "<br /><span class=\"bmiclass\" style=\"display: block;\">BMI</span>";
        calresultP.className = "bmiResultBg bmiBorder bmi" + colorBMIResult;

        // calresultP顯示BMI結果，並修改樣式
        if (document.querySelector('.bmiResultText').style.display == "") {
            document.querySelector('.bmiResultText').style.display = "inline";
        }
        calresulttextP.innerHTML = textBMIResult;
        calresulttextP.className = "bmiResultBg  bmi" + colorBMIResult;

        // bmireset處理
        if (bmireset.style.display == "") {
            bmireset.style.display = "inline";
        }
        bmireset.className = "bmireset bmi" + colorBMIResult;

        var userBMIDataDict = {
                userHeight: userHeightData*100,
                userWeight: userWeightData,
                userBMI: userBMIData,
                userFillDate: userFillDate
        };
        userBMIDataPool.push(userBMIDataDict);
        updateList(userBMIDataPool);
        localStorage.setItem('userBMIData',JSON.stringify(userBMIDataPool));
    } else {
        alert('您尚未輸入完整的資料哦!!');
    }
}

// 更新網頁內容
function updateList(items) {
    str = '';
    var len = items.length;
    //console.log(items);
    for (var i = 0; len > i; i++) {
        var ArrayBMIResult = levelBMI(items[i].userBMI).split(",");
        var colorBMIResult = ArrayBMIResult[0];
        var textBMIResult = ArrayBMIResult[1]; 
        str += "<li><div class=\"bmiTxt bmi" + colorBMIResult + "\">"+ textBMIResult + "</div><div><sup class=\"bmiclass\">BMI</sup>&nbsp;" + items[i].userBMI + "</div><div><sup class=\"bmiclass\">weight</sup>&nbsp;" + items[i].userWeight + "kg</div><div><sup class=\"bmiclass\">height</sup>&nbsp;" + items[i].userHeight + "cm</div><div>" + items[i].userFillDate + "</div><div><a href=\"#\" data-index=" + i + " />刪除</a></div></li>";
    }
    userbmilist.innerHTML = str;
}

// 刪除BMI資料
  function toggleDone(e) {
    e.preventDefault();
    if(e.target.nodeName !== 'A'){return};
    var index = e.target.dataset.index;
    userBMIDataPool.splice(index, 1);
    localStorage.setItem('userBMIData', JSON.stringify(userBMIDataPool));
    updateList(userBMIDataPool);
  }

// 檢查使用者是否正確輸入資料
function checkData(e) {
    e.preventDefault();
    var str = e.target.value;
    var targetID = e.target.id;
    if (str=='') {
        var alertString = '';
        if (targetID == 'userheight') {
            alertString = "您尚未輸入身高！";
        } else if (targetID == 'userweight') {
            alertString = "您尚未輸入體重！";
        }
        document.getElementById(targetID).className = "borderRed";
        alert(alertString);
    } else {
        //console.log(parseInt(str));
        if (isNaN(parseInt(str))) {
            document.getElementById(targetID).className = "borderRed";
            alert("您輸入非數字的資料了！");
        } else {
            document.getElementById(targetID).className = "";
        }
    }
}

// 計算BMI指數
function levelBMI(calcBMI) {
    if (calcBMI < 18.5) {
        return "Blue,過輕"; //過輕
    } else if (18.5 <= calcBMI && calcBMI < 24.0) {
        return "Green,理想"; //理想
    } else if (24.0 <= calcBMI && calcBMI < 27.0) {
        return "Orange,過重"; //過重
    } else if (27.0 <= calcBMI && calcBMI < 30.0) {
        return "Orangedeep,輕度肥胖"; //輕度肥胖
    } else if (30.0 <= calcBMI && calcBMI < 35.0) {
        return "Orangedeep,中度肥胖"; //中度肥胖
    } else if (calcBMI >= 35) {
        return "Red,過度肥胖"; //過度肥胖
    }
}