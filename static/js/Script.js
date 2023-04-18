



// line chart
var xmlhttp = new XMLHttpRequest();
var url = "http://127.0.0.1:5500//tweets.json";
xmlhttp.open("GET",url, true);
xmlhttp.send();
xmlhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
        var data = JSON.parse(this.responseText);
        var user = data.map(function(elem){
            return elem.username;
        });
        var liked = data.map(function(elem){
            return elem.Likes;
        });

        const ctx = document.getElementById('linechart').getContext('2d');
        const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: user,
            datasets: [{
                label: 'No of likes on user tweets',
                data: liked,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
        });

    }
}


// circular animation
// Positive

const Positive = () =>{
    let progress1 = setInterval(()=>{
        progressValue1++;
        valuebar1.textContent = `${progressValue1}%`;
        progressbar1.style.background = `conic-gradient(
            #09dbea ${progressValue1 * 3.6}deg,
            #a2dede ${progressValue1 * 3.6}deg
            ) `;
            if(progressValue1 == progressEndValue1){
                clearInterval(progress1);
            }
    });

}
// Negative
const Negative = () =>{
    let progress2 = setInterval(()=>{
        progressValue2++;
        valuebar2.textContent = `${progressValue2}%`;
        progressbar2.style.background = `conic-gradient(
            #09dbea ${progressValue2 * 3.6}deg,
            #a2dede ${progressValue2 * 3.6}deg
            ) `;
            if(progressValue2 == progressEndValue2){
                clearInterval(progress2);
            }
    });

}

// Neutral
const  Neutral = () =>{
    let progress4 = setInterval(()=>{
        progressValue4++;
        valuebar4.textContent = `${progressValue4}%`;
        progressbar4.style.background = `conic-gradient(
            #09dbea ${progressValue4 * 3.6}deg,
            #a2dede ${progressValue4 * 3.6}deg
            ) `;
            if(progressValue4 == progressEndValue4){
                clearInterval(progress4);
            }
    });

}



// Total
const Total = () =>{
    let progress3 = setInterval(()=>{
        progressValue3++;
        valuebar3.textContent = `${progressValue3}%`;
        progressbar3.style.background = `conic-gradient(
           #09dbea ${progressValue3 * 3.6}deg,
           #a2dede ${progressValue3 * 3.6}deg
        ) `;
        if(progressValue3 == progressEndValue3){
           clearInterval(progress3);
        }
       });

}


let progressbar1 = document.querySelector(".Positive");
let valuebar1 = document.querySelector(".Positive-value");
let progressValue1 = 0;
let progressEndValue1 = Positives;
let positivevalue = Positive(progressbar1,valuebar1,progressValue1,progressEndValue1);

let progressbar2 = document.querySelector(".Negative");
let valuebar2 = document.querySelector(".Negative-value");
let progressValue2 = 0;
let progressEndValue2 = Negatives;
const Negativevalue = Negative(progressbar2,valuebar2,progressValue2,progressEndValue2);

let progressbar3 = document.querySelector(".Total");
let valuebar3 = document.querySelector(".Total-value");
let progressValue3 = 0;
let progressEndValue3 = Totals;
let Totalvalue = Total(progressbar3,valuebar3,progressValue3,progressEndValue3);

let progressbar4 = document.querySelector(".Neutral");
let valuebar4 = document.querySelector(".Neutral-value");
let progressValue4 = 0;
let progressEndValue4 = Neutrals;
let Neutralvalue = Neutral(progressbar4,valuebar4,progressValue4,progressEndValue4);



// Table section


const SearchTable =()=> {
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

let input, filter, table, tr, td, i, txtValue;
let SearchInTheTable = SearchTable(input,filter,table,tr,td,i,txtValue);