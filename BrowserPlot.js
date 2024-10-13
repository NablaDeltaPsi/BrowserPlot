    var chart; // globale Variable, um auf das Chart-Objekt zuzugreifen
	var datasets; // globale Variable, um auf die Daten zuzugreifen
	var files;
	
	var modus_xy = 0
	var bool_logx = 0
	var bool_logy = 0
	var bool_zero = 0
	var bool_norm = 0
	
	var color_active = '#999999'
	var color_inactive = '#FFFFFF'
	document.getElementById("btn_xy").style.background=color_inactive;
	document.getElementById("btn_logx").style.background=color_inactive;
	document.getElementById("btn_logy").style.background=color_inactive;
	document.getElementById("btn_zero").style.background=color_inactive;
	document.getElementById("btn_norm").style.background=color_inactive;

	function toggle_xy() {
		modus_xy = (modus_xy + 1) % 3
		console.log("modus_xy=" + modus_xy)
		if (modus_xy==0) {
			document.getElementById("btn_xy").textContent = 'xy';
		} else if (modus_xy==1) {
			document.getElementById("btn_xy").textContent = 'xyxy';
		} else {
			document.getElementById("btn_xy").textContent = 'xyyy';
		}
		clearFiles()
	}
	
	function toggle_logx() {
		bool_logx = bool_logx ? 0 : 1
		console.log("bool_logx=" + bool_logx)
		if (bool_logx) {
			document.getElementById("btn_logx").style.background=color_active;
		} else {
			document.getElementById("btn_logx").style.background=color_inactive;
		}
		updateChart()
	}

	function toggle_logy() {
		bool_logy = bool_logy ? 0 : 1
		console.log("bool_logy=" + bool_logy)
		if (bool_logy) {
			document.getElementById("btn_logy").style.background=color_active;
		} else {
			document.getElementById("btn_logy").style.background=color_inactive;
		}
		updateChart()
	}

	function toggle_zero() {
		bool_zero = bool_zero ? 0 : 1
		console.log("bool_zero=" + bool_zero)
		if (bool_zero) {
			document.getElementById("btn_zero").style.background=color_active;
		} else {
			document.getElementById("btn_zero").style.background=color_inactive;
		}
		updateChart()
	}

	function toggle_norm(replot) {
		bool_norm = bool_norm ? 0 : 1
			console.log("bool_norm=" + bool_norm)
		if (bool_norm) {
			document.getElementById("btn_norm").style.background=color_active;
		} else {
			document.getElementById("btn_norm").style.background=color_inactive;
		}
		updateChart()
	}
	
	function clearFiles() {
		files = []
		datasets = []
		document.getElementById('fileLabel').innerHTML = "---"
		updateChart()
	}
	
	function loadFiles() {
	  console.log("#############################")
	  console.log("loadFiles")
	  files = document.getElementById('hiddenFileButton').files;
	  datasets = [];
	  var counter = 0; // Zählervariable
		  
	  console.log(files.length + ' files:')
	  console.log(files)

	  if (modus_xy == 0) {
		  for (var i = 0; i < files.length; i++) {
			console.log('File ' + (i+1))
			var reader = new FileReader();
			(function(reader, file) {
			  reader.onloadend = function() {
				var lines = reader.result.split(/[\r\n]+/);
				var data = [];

				for (var j = 0; j < lines.length; j++) {
				  if (lines[j] !== '') {
					var parts = lines[j].split(/[\s,]+/);
					if (parts.length > 1 && parts[0].trim() !== '' && parts[1].trim() !== '' && !isNaN(parts[0]) && !isNaN(parts[1])) {
					  data.push({x: parseFloat(parts[0]), y: parseFloat(parts[1])});
					}
				  }
				}

				if (data.length > 0) {
				  datasets.push({
					label: file.name,
					data: data,
					borderColor: getColor(datasets.length),
					fill: false
				  });
				}

				counter++; // Inkrementiere Zähler

				if (counter === files.length) {
				  document.getElementById('fileLabel').innerHTML = counter + " files"
				  updateChart();
				}
		      }
		    })(reader, files[i]);
		  reader.readAsText(files[i]);
	      }
	  }
	}

	function updateChart() {
	  if (chart) {
		chart.destroy();
	  }

	  var datasets_ = structuredClone(datasets);

	  if (bool_zero) {
		for (var i = 0; i < datasets_.length; i++) {
		  var minY = getMinY(datasets_[i].data);
		  for (var j = 0; j < datasets_[i].data.length; j++) {
			datasets_[i].data[j].y -= minY;
		  }
		}
	  }

	  if (bool_norm) {
		for (var i = 0; i < datasets_.length; i++) {
		  var maxY = getMaxY(datasets_[i].data);
		  for (var j = 0; j < datasets_[i].data.length; j++) {
			datasets_[i].data[j].y = datasets_[i].data[j].y / maxY;
		  }
		}
	  }

	  var ctx = document.getElementById('myChart').getContext('2d');
	  chart = new Chart(ctx, {
		type: 'line',
		data: {
		  datasets: datasets_
		},
		options: {
		  scales: {
			x: {
			  type: bool_logx ? 'logarithmic' : 'linear',
			  position: 'bottom'
			},
			y: {
			  type: bool_logy ? 'logarithmic' : 'linear',
			  ticks: {
				callback: function(value, index, values) {
				  if (value <= 0) return '';
				  return value;
				}
			  }
			}
		  }
		}
	  });
	}

	function getMinY(data) {
	  var minY = data[0].y;
	  for (var i = 1; i < data.length; i++) {
		if (data[i].y < minY) {
		  minY = data[i].y;
		}
	  }
	  return minY;
	}

	function getMaxY(data) {
	  var maxY = data[0].y;
	  for (var i = 1; i < data.length; i++) {
		if (data[i].y > maxY) {
		  maxY = data[i].y;
		}
	  }
	  return maxY;
	}

	function getColor(index) {
	  var colors = ['red', 'black', 'blue', 'orange', 'green', 'purple'];
	  return colors[index % colors.length];
	}