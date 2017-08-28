Tesseract.recognize("./test.png",{lang:"jpn"}).then(function(result){
    const a = document.querySelector("#test");
    a.innerHTML = result.html;
})
Tesseract.recognize("./test2.png").then(function(result){
    const a = document.querySelector("#test2");
    a.innerHTML = result.html;
})