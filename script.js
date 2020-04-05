class API{
    constructor(){
        this.key = "1406c0f16ced40ddae194f1c5c15d563";
    }
    async get(url){
        const response = await fetch(url);
        if(response.status===200){
            const json = await response.json();
            return json;
        }
    }
}
class UI{
    constructor(){
        this.result = document.querySelector("#result");
    }
    async paint(object){
        const place = document.querySelector("#place");
        let text;

        let array = object.data;
        array.forEach((obj,index)=>{

            let div = document.createElement("div");
            div.className = "col-md-6 col-lg-4";

            if(obj.city_name!==undefined){
                place.innerHTML = obj.city_name;
                div.innerHTML = 
                `   <div class="card">
                        <div class="mt-3">
                            <div class="lead text-uppercase">CURRENT WEATHER</div>
                            <p>${obj.ob_time}</p>
                        </div>     
                        <div>
                            <img src="${this.selectImg(obj.weather.code)}" alt="">
                            <h1 class="card-title">${obj.temp}&#176<span class="text-muted">C</span></h1>
                            <p class="text-muted">RealFeel ${obj.app_temp}&#176 </p>
                            <p class="lead">${obj.weather.description}</p>
                            <p class="lead">Precipitation: ${Math.trunc(obj.precip)}%</p>
                        </div>
                    </div> 
                `;
            }
            if(obj.moonrise_ts !== undefined){
                if(index===0)
                    text = "today";
                else if(index===1)
                    text = "tomorrow";
                else
                    text ="next day "+(index+1);
                    div.innerHTML = 
                    `   <div class="card">
                            <div class="mt-3">
                                <div class="lead text-uppercase">${text}</div>
                                <p>${obj.valid_date}</p>
                            </div>     
                            <div>
                                <img src="${this.selectImg(obj.weather.code)}" alt="">
                                <h1 class="card-title">${obj.temp}&#176<span class="text-muted">C</span></h1>
                                <p class="text-muted">RealFeel ${ obj.max_temp}&#176 </p>
                                <p class="lead">${obj.weather.description}</p>
                                <p class="lead">Precipitation: ${Math.trunc(obj.precip)}%</p>
                            </div>
                        </div> 
                    `;       
            }
            this.result.append(div);
        })
    }
    clear(){
        document.querySelector("#place").textContent ="";
        this.result.innerHTML = "";
    }
    selectImg(code){
        if(code>= 200 && code<300 )
            return "./vendors/stormy.svg";
        if(code>= 300 && code<400 )
            return "./vendors/rainy.svg";
        if(code>= 500 && code<600 )
            return "./vendors/heavyrain.svg";
        if(code>= 600 && code<700 )
            return "./vendors/snowy.svg";
        if(code>= 700 && code<800 )
            return "./vendors/";
        if(code===800)
            return "./vendors/sunny.svg"
        if(code === 900)
            return "./vendors/rainy.svg"
        if(code>= 801 && code<900 )
            return "./vendors/cloudy.svg";
    }
    alert(){
        let div = document.querySelector("#alert");
        div.classList.add("d-block")
        div.textContent = "Please search by City Name or Pin code.";
        setTimeout(function(){
            let div = document.querySelector("#alert");
            div.classList.remove("d-block")
        },5000);
    }
}
class STORAGE{
    addCity(city){
        console.log(city);
        localStorage.setItem("city",city)
    }
    addPin(pin){
        localStorage.setItem("pin",pin)
    }
    getCity(){
        return localStorage.getItem("city");
    }
    getPin(){
        return localStorage.getItem("pin");
    }
}
//APP.js
//Initiating 
const api = new API();
const ui = new UI();
const storage = new STORAGE();

const select = document.getElementById("select");
const input = document.getElementById("input");
const btn = document.getElementById("get");
const key = "1406c0f16ced40ddae194f1c5c15d563";

btn.onclick = clicked;
input.onkeydown = clicked;

function clicked(e){
    if( (e.key === "Enter" || e.type ==="click") && input.value !== "" )
    {
        let inn = input.value;
        const currentCity =`https://api.weatherbit.io/v2.0/current?city=${input.value}h&key=`+key;
        const forecastCity = `https://api.weatherbit.io/v2.0/forecast/daily?city=${input.value}&key=`+key;
        const currentPin = `https://api.weatherbit.io/v2.0/current?postal_code=${input.value}&key=`+key;
        const forecastPin = `https://api.weatherbit.io/v2.0/forecast/daily?postal_code=${input.value}&key=`+key;
        ui.clear();
        if(select.value === "city"){
            api.get(currentCity).then((res)=>
            {
                if(res!== undefined){
                    ui.paint(res);
                    storage.addCity(inn);
                }
                else
                    ui.alert();
            })
            setTimeout(api.get(forecastCity).then((res)=>{
                if(res!== undefined)
                    ui.paint(res);
            }),500)
        }
        if(select.value === "pincode"){
            api.get(currentPin).then((res)=>{
                if(res!== undefined){
                    ui.paint(res);
                    storage.addPin(inn);
                }
            })
            setTimeout(api.get(forecastPin).then((res)=>{
                if(res!== undefined)
                    ui.paint(res);
            }),500)
        }
        input.value="";
    }
}

window.addEventListener('DOMContentLoaded',function(){
    let city = storage.getCity();
    let pin = storage.getPin();

    if(city!==undefined){
        const currentCity =`https://api.weatherbit.io/v2.0/current?city=${city}h&key=`+key;
        const forecastCity = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=`+key;
        api.get(currentCity).then((res)=>
        {
            ui.paint(res);
        })
        setTimeout(api.get(forecastCity).then((res)=>{
            ui.paint(res);
        }),500)
    }
    if(pin!==undefined){
        const currentPin = `https://api.weatherbit.io/v2.0/current?postal_code=${pin}&key=`+key;
        const forecastPin = `https://api.weatherbit.io/v2.0/forecast/daily?postal_code=${pin}&key=`+key;
        api.get(currentPin).then((res)=>
        {
            ui.paint(res);
        })
        setTimeout(api.get(forecastPin).then((res)=>{
            ui.paint(res);
        }),500)
    }

})

// obj.city_Name || don't exist
// ob_time || valid_date
// obj.weather.icon $
// obj.temp $
// obj.weather.description $
// obj.app_temp || obj.max_temp: 26.1
// obj.precip ||