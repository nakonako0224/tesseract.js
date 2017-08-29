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
  
  var startTime = new Date();
  var starthms = startTime.getHours() + "h" + startTime.getMinutes() + "m" + startTime.getSeconds() + "s";
  document.getElementById("msg").textContent = "[処理開始" + starthms + "]\n";

  //画像認識
  Tesseract.recognize(
    document.getElementById("read_image").src,
    { 
      lang: selected_lang
    })
  .progress(progressUpdate)
  .catch(function(e) {
    document.getElementById("msg").textContent += "[ERROR: " + e + "]\n";
    console.log("ERROR: " + e);
  })
  .then(function(result) {
    txt_out.innerHTML = result.text;
  })
  .finally(function(r) {
    var endTime = new Date();
    var endhms = endTime.getHours() + "h" + endTime.getMinutes() + "m" + endTime.getSeconds() + "s";
    document.getElementById("msg").textContent += "[処理終了" + endhms + "]\n";
  });
}

//進捗管理
function progressUpdate(packet){
	var log = document.getElementById('log');

	if(log.firstChild && log.firstChild.status === packet.status){
		if('progress' in packet){
			var progress = log.firstChild.querySelector('progress')
			progress.value = packet.progress
		}
	}else{
		var line = document.createElement('div');
		line.status = packet.status;
		var status = document.createElement('div')
		status.className = 'status'
		status.appendChild(document.createTextNode(packet.status))
		line.appendChild(status)

		if('progress' in packet){
			var progress = document.createElement('progress')
			progress.value = packet.progress
			progress.max = 1
			line.appendChild(progress)
		}


		if(packet.status == 'done'){
			var pre = document.createElement('pre')
			pre.appendChild(document.createTextNode(packet.data.text))
			line.innerHTML = ''
			line.appendChild(pre)

		}

		log.insertBefore(line, log.firstChild)
	}
}