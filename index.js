//ページ読み込み時
function load_check() {
	var browse = platform.name;
	if(browse == "IE") {
		document.getElementById("plat_form").textContent = "IEは非対応です！他のブラウザで利用してください！" ;
	}
}

//ファイルの読み込み、画像認識の関数呼び出し
function read_in() {	
	var reader = new FileReader();
	reader.onload = function (e) {
		//選択された画像をimg要素として表示
		read_image.src = reader.result
		//画像認識関数
		recognize_image();
	}
	// 画像ファイルをdata URLとして読み込むように指示
	reader.readAsDataURL(document.getElementById("input_image_file").files[0]);
}

//画像認識
function recognize_image() {
	//結果出力先の要素を取得
	var txt_out = document.getElementById("text_of_read_image");
	//複数回、連続して実行するときのために、最初に中身を捨てる
	txt_out.innerHTML = "";
	msg.innerHTML = "";
	//指定された言語のコードを取得
	var lang_list = document.getElementById("lang_options");
	var selected_lang = lang_list.options[lang_list.selectedIndex].value;
	console.log(selected_lang + "が選択されました。");

	var startTime = new Date();
	var starthms = startTime.getHours() + ":" + startTime.getMinutes() + "." + startTime.getSeconds();
	document.getElementById("msg").textContent = "[処理開始" + starthms + "]\n";

	//画像認識
	Tesseract.recognize(document.getElementById("read_image").src, { 
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
			var endhms = endTime.getHours() + ":" + endTime.getMinutes() + "." + endTime.getSeconds();
			document.getElementById("msg").textContent += "[処理終了" + endhms + "]\n";
		});
}

//進捗管理
function progressUpdate(packet){
	var log = document.getElementById("log");

	if(log.firstChild && log.firstChild.status === packet.status){
		if("progress" in packet){
			var progress = log.firstChild.querySelector("progress")
			progress.value = packet.progress
		}
	}else{
		var line = document.createElement("div");
		line.status = packet.status;
		var status = document.createElement("div")
		status.className = "status"
		status.appendChild(document.createTextNode(packet.status))
		line.appendChild(status)

		if("progress" in packet){
			var progress = document.createElement("progress")
			progress.value = packet.progress
			progress.max = 1
			line.appendChild(progress)
		}


		if(packet.status == "done"){
			var pre = document.createElement("pre")
			pre.appendChild(document.createTextNode(packet.data.text))
			line.innerHTML = ""
			line.appendChild(pre)

		}

		log.insertBefore(line, log.firstChild)
	}
}