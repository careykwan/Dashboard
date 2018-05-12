google.charts.load('current', {'packages':['corechart', 'controls']});
google.charts.setOnLoadCallback(drawDashboard);

function drawDashboard(){

	$.ajax({
		url: 'js/twoData.json',
		dataType: 'json',
		success: function(dataFromJSON){
			console.log(dataFromJSON);
			var data = new google.visualization.DataTable();
			data.addColumn('string', 'Name');
			data.addColumn('number', 'Age');
			data.addColumn('number', 'Income');
			data.addColumn('string', 'Gender');
			data.addColumn('string','country')

			for (var i = 0; i < dataFromJSON.length; i++) {
				data.addRow([
					dataFromJSON[i].first_name + " " + dataFromJSON[i].last_name,
					dataFromJSON[i].age,
					dataFromJSON[i].annual_income,
					dataFromJSON[i].gender, 
					dataFromJSON[i].country, 
			]);

		}

		var dashboard = new google.visualization.Dashboard(
			document.getElementById('dashboard'));

		var scatterChart = new google.visualization.ChartWrapper({
			chartType: 'ScatterChart',
			containerId: 'chart1',
			options: {
				width: '100%',
				height: '100%',
				legend: 'none',
				title: 'Age vs Annual Income',
				colors: ['white'],
				pointShape: 'star',
				backgroundColor: {
					fill: 'transparent'
				},
				ui: {
					labelStacking: 'vertical'
				},
			animation: {
			      duration: 200,
			      easing: 'inAndOut',
			    }
			},
			view: {
				columns: [1,2]
			}
		});

		var geo = new google.visualization.ChartWrapper({
			chartType: "GeoChart",
			containerId: "chart2",
			options: {
				height: '100%',
				width: '100%'
			},
			view: {
				columns: [4]
			}
			
		});

		var table = new google.visualization.ChartWrapper({
			chartType: "Table",
			containerId: "chart2",
			options: {
				colors: ['black'],
				width: '100%'
			}
		});

		var incomeRangeSlider = new google.visualization.ControlWrapper({
			controlType: 'NumberRangeFilter',
			containerId: 'control1',
			options: {
				filterColumnLabel: 'Income'
			} 
		});

		var optionPicker = new google.visualization.ControlWrapper({
			controlType: 'CategoryFilter',
			containerId: 'control2',
			options: {
				filterColumnLabel: 'Gender',
				ui: {
					allowMultiple: false,
					allowTyping: false,
					labelStacking: 'vertical'
				}
			}
		});

		dashboard.bind([incomeRangeSlider, optionPicker], [scatterChart, geo]);
		// dashboard.bind(optionPicker, scatterChart);
		dashboard.draw(data);
		drawPie(dataFromJSON);
		
		google.visualization.events.addListener(incomeRangeSlider, 'statechange', function(){
			var range = incomeRangeSlider.getState();

			var view = new google.visualization.DataView(data);

			view.setRows(data.getFilteredRows([
				{
					column: 2,
					minValue: range.lowValue,
					maxValue: range.highValue
				}
			]));

			var filteredRows = view.ol;
			var newData = [];
			for (var i = 0; i < filteredRows.length; i++) {
				newData.push(dataFromJSON[filteredRows[i]]);
			};
			drawPie(newData);


		});

		},
		error: function(errorFromJson){
			console.log(errorFromJson);
			alert("error");
		}

		});
	};

//code for pie chart, created a loop through the data to pick up female and male count and then show it through graph.
	function drawPie(data){
		var dataGender = new google.visualization.DataTable();
		dataGender.addColumn('string', 'Gender');
		dataGender.addColumn('number', 'Count');
		var male = 0, female = 0;
		for (var i = 0; i < data.length; i++) {
			if(data[i].gender == "Male"){
				male++;
			} else if (data[i].gender == "Female"){
				female++;
			}
		}
		dataGender.addRow(["Male", male]);
		dataGender.addRow(["Female", female]);

		var options = {
			title: "Male and Female Split",
			backgroundColor: {
				fill: 'transparent'
			}
		};

		var Pie = new google.visualization.PieChart(document.getElementById('chart3'));
		Pie.draw(dataGender, options);


	}
