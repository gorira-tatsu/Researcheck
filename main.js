// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyAc91klrsA-NXeWxGV_--FM2FB1pD_Oc1k",
    authDomain: "researcheck-c6439.firebaseapp.com",
    projectId: "researcheck-c6439",
    storageBucket: "researcheck-c6439.appspot.com",
    messagingSenderId: "86049752207",
    appId: "1:86049752207:web:80640fba82fc9b788e1cfa",
    measurementId: "G-ESLY2Q6641"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics()

const db = firebase.firestore();

const antonym_list = {
    "メリット":"デメリット",
    "デメリット":"メリット",
    "危険":"安全",
    "安全":"危険",
    "大きい":"小さい",
    "小さい":"大きい",
    "遅い":"早い",
    "早い":"遅い",
    "暑い":"寒い",
    "寒い":"暑い",
    "良い":"悪い",
    "悪い":"良い",
    "新しい":"古い",
    "古い":"新しい",
    "若い":"年寄り",
    "年寄り":"若い",
    "短い":"長い",
    "長い":"短い",
    "薄い":"厚い",
    "厚い":"薄い",
    "重い":"軽い",
    "軽い":"重い",
    "強い":"弱い",
    "弱い":"強い",
    "太い":"細い",
    "細い":"太い",
    "安い":"高い",
    "高い":"安い",
    "遠い":"近い",
    "近い":"遠い",
    "正しい":"間違い",
    "間違い":"正しい",
    "最高":"最悪",
    "最悪":"最高",
}

async function record_search_word_to_firebase(search_word) {

    const res = await db.collection('Search').add({
        Search_Word:search_word
    });

}

async function record_access_to_firebase(url, title){

    const res = await db.collection('access').add({
        title: title,
        url: url
    });

}

function get_search_word_form() {
    return document.getElementById("q")
}

function give_click_event_to_search_result(result) {
    for (c=0;c!==result.length;c++) {
        result[c].addEventListener('click', function () {
            record_access_to_firebase(event.target.href,event.target.textContent)
        })
    }
}

function  get_search_result() {
    Result = []
    for(c=1;c!==11;c++){
        Result.push(document.querySelector(`#___gcse_0 > div > div > div > div.gsc-wrapper > div.gsc-resultsbox-visible > div > div > div.gsc-expansionArea > div:nth-child(${c}) > div.gs-webResult.gs-result > div.gsc-thumbnail-inside > div > a`))
    }
    return Result
}

function get_antonym(target_array) {
    for (x in antonym_list) {
        target_found = target_array.indexOf(x)
        if (target_found !== -1) {
            return antonym_list[x];
        }
        else {
            return '';
        }
    }
}

function split_space(target) {
    return target.split(/[\s\u3000]+/)
}

function return_exclusion() {
    let target_value = []
    let target = document.getElementsByClassName('exclusion')
    for (let c=0;c !== target.length;c++){
        if (target[c].value !== ""){
            target_value.push(' -' + target[c].value )
        }
    }
    return target_value.join('')
}

function Search(target_found, exclusion, from) {
    record_search_word_to_firebase(get_search_word_form().value + target_found + exclusion)

    if (from === null) {
        record_history_to_local_storage()
        show_local_storage()
    }

    else if (from === 'history') {
    }

    document.getElementsByClassName('gsc-input')[2].value = get_search_word_form().value + target_found + exclusion; // 代入
    document.querySelector('#___gcse_0 > div > div > form > table > tbody > tr > td.gsc-search-button > button').click();
    compare_search_result(get_search_word_form().value + target_found + exclusion)
    window.setTimeout(function () {give_click_event_to_search_result(get_search_result())}, 2*1000); // click eventを付与
}

function pushSearch(from) {
    if (get_search_word_form().value !== '') {
        if (from === '') {
            Search(get_antonym(split_space(get_search_word_form().value)), return_exclusion())
        }
        else if (from === 'history') {
            Search(get_antonym(split_space(get_search_word_form().value)), return_exclusion(), 'history')
        }
    }
}

function increase_exclusion_form() {
    document.getElementById('exclusion-group').insertAdjacentHTML('beforeend','<input type="text" class="form-control search-input exclusion search-group AddExclusion">')
}

function resetForm() {
    target = document.getElementsByClassName('search-group')
    for (x in target){
        target[x].value = ""
    }
    decrement_all_exclusion_form()
}

function get_data_exists_in_form() {
    let search_group = document.getElementsByClassName('search-group')
    let SearchWord_list = []
    for (let c=0;c!==search_group.length;c++){
        if(search_group[c].value !== ''){
            SearchWord_list.push(search_group[c].value)
        }
    }
    return SearchWord_list
}

function record_history_to_local_storage() {
    let SearchWord = get_data_exists_in_form()
    localStorage.setItem(Date.now(), SearchWord)
}

function show_local_storage() {
    let element = document.getElementById("history");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    let a = []
    for (let i = 0; i < localStorage.length; i++) {
        a.push(localStorage.key(i))
    }

    let result = a.sort(function(a,b){
        if( a > b ) return -1;
        if( a < b ) return 1;
        return 0;
    });

    console.log(result)

    for(let c=0;c!==5;c++) {
        if (localStorage.getItem(result[c]) !== null) {
            let s = localStorage.getItem(result[c]).split(',')
            document.getElementById('history').insertAdjacentHTML('beforeend', `<br><a onclick="search_from_history(${result[c]})" class="btn btn-link histories" id="localstorage${c}">検索:${s[0]} 除外:${s.slice(1).join(',')}</a>`)
        }
    }
}

function assign_to_form(SearchWord, exclusion) {
    get_search_word_form().value = SearchWord
    for (let c=0;c!==exclusion.length;c++){
        if (document.getElementsByClassName('exclusion')[c] === false){
            increase_exclusion_form()
        }
        document.getElementsByClassName('exclusion')[c].value = exclusion[c]
    }
}

function decrement_exclusion_form() {
    let target = document.getElementsByClassName('AddExclusion')
    target[target.length - 1].remove()
}

function search_from_history(number) {
    let word = localStorage.getItem(number).split(',')
    resetForm()
    assign_to_form(word[0], word.slice(1))
    pushSearch('history')
}

function decrement_all_exclusion_form(){
    let t = Array.from(document.getElementsByClassName('AddExclusion'))
    for(let c=0;c!==t.length;c++){
        t[c].remove()
    }
}

function on_center_theme(){
    document.getElementById('theme_on').insertAdjacentHTML('afterbegin',document.getElementById('theme').value)
}

function compare_search_result(Search_world) {
    let target_form_1 = document.getElementsByClassName('gsc-input')[5]
    let target_button1 = document.querySelector('#___gcse_1 > div > div > form > table > tbody > tr > td.gsc-search-button > button')

    target_form_1.value = Search_world
    target_button1.click()

    window.setTimeout(function () {

        for(let c = 1;c!==11;c++){
            let zero = document.querySelector(`#___gcse_0 > div > div > div > div.gsc-wrapper > div.gsc-resultsbox-visible > div > div > div.gsc-expansionArea > div:nth-child(${c}) > div.gs-webResult.gs-result > div.gsc-thumbnail-inside > div > a`).text
            let one = document.querySelector(`#___gcse_1 > div > div > div > div.gsc-wrapper > div.gsc-resultsbox-visible > div > div > div.gsc-expansionArea > div:nth-child(${c}) > div.gs-webResult.gs-result > div.gsc-thumbnail-inside > div > a`).text
            if (zero !== one){
                not_credit_alert(document.querySelector(`#___gcse_0 > div > div > div > div.gsc-wrapper > div.gsc-resultsbox-visible > div > div > div.gsc-expansionArea > div:nth-child(${c}) > div.gs-webResult.gs-result > div.gsc-thumbnail-inside > div`))
            }
        }}, 1000);
}

function not_credit_alert(place) {
    place.insertAdjacentHTML('beforeend','<h5 class="notcredit">このサイトは信用できません</h5>')
}


function countdown(time,text) {

    // Set the date we're counting down to
    let countDownDate = Date.now() + (time*60)*1000

// Update the count down every 1 second
    let x = setInterval(function() {
        let now = Date.now()

        // Find the distance between now and the count down date
        let distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        document.getElementById("demo").innerHTML = text + " 終了まで" + minutes + "分 " + seconds + "秒 ";

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("demo").innerHTML = "終了！";
            let timerStop = new Audio('timerstop.mp3')
            timerStop.play()
        }

    }, 1000);
}

function countdownStart() {
    let searchTime = document.getElementById('searchTime').value
    let Summarize = document.getElementById('Summarize').value
    let Share = document.getElementById('Share').value

    setTimeout(() => {
        countdown(Share,"話し合い");
    }, ((Summarize * 60 * 1000 + 1000) + (searchTime * 60 * 1000 + 1000)));

    setTimeout(() => {
        countdown(Summarize, "まとめ");
    }, searchTime * 60 * 1000 + 1000);

    countdown(searchTime, "調べる");
}