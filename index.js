// ユーザ指定のファイルを読み込み、画像認識の関数を呼び出す。
function read_in() {
	var reader = new FileReader();
	reader.onload = function (e) {
		//選択された画像をimg要素として表示する。
		//document.getElementById("read_image").src = e.target.result;
		read_image.src = reader.result
		//画像認識を行う
		recognize_image();
	}
	// 画像ファイルをdata URLとして読み込むように指示しておく。
	reader.readAsDataURL(document.getElementById("input_image_file").files[0]);
}


// 画像認識を行う。
function recognize_image() {

  //結果出力先の要素を取得する。
  var txt_out = document.getElementById("text_of_read_image");
  //複数回、連続して実行するときのために、最初に中身を捨てる。
  txt_out.innerHTML = "";
  //指定された言語のコードを取得する。
  var lang_list = document.getElementById("lang_options");
  var selected_lang = lang_list.options[lang_list.selectedIndex].value;
  console.log(selected_lang + "が選択されました。");
  
  document.getElementById("msg").textContent = "[処理を開始しました。]";

  //画像認識
  Tesseract.recognize(
    document.getElementById("read_image").src,
    { 
      lang: selected_lang
    })
  .progress(function(m) {
    document.getElementById("msg").textContent += ">> ";
    //console.log("途中経過: " + m + "\n");
  })
  .catch(function(e) {
    document.getElementById("msg").textContent += "[エラーです: " + e + "]";
    console.log("エラーです: " + e);
  })
  .then(function(result) {
    txt_out.innerHTML = result.text;
  })
  .finally(function(r) {
    document.getElementById("msg").textContent += "[処理が終わりました]\n";
  });
}