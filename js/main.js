
var Traffic = {
	init: function(days) {
		this.cacheElements(days);
		this.bindEvents();
		this.renderDates();
		this.getData(days);
	},
	bindEvents: function() {
		$(".toggle").click(function() {
			if ($(".hero-unit.front").is(":visible")) {
				$(".hero-unit.front").addClass("hide");
				$(".hero-unit.back").removeClass("hide");
			}
			else {
				$(".hero-unit.front").removeClass("hide");
				$(".hero-unit.back").addClass("hide");
			}
		});
	},
	cacheElements: function(days) {
		this.score1 = 0;
		this.score2 = 0;
		this.dates = days;
		this.bnData = [];
		this.fData = [];
		this.weatherData;
	},
	getTraffic: function() {
		$.ajax({
			dataType: "json", 
			cache: false,
			url: "http://pipes.yahoo.com/pipes/pipe.run?_id=5633c71870cc573d2fc38f57661f3b63&_render=json",
			success: function(data) {
				console.log(data.value.items[0].Speed);
				$('body').append(data.value.items[0].Speed);
			},
			error: function() {
				consle.log("error");
			}
		})
	},
	getData: function() {
		this.fenwayData();
		this.bankNorthData();
		//this.holidayData();
		//this.weatherData();
	},
	holidayData: function() {
		var sd, ed, url;
		console.log(Traffic.dates[0]);
		sd = moment(Traffic.dates[0], 'YYYY-MM-DD').format('DD-MM-YYYY');
		ed = moment(Traffic.dates[4], 'YYYY-MM-DD').format('DD-MM-YYYY');
		console.log(ed);
		console.log(sd);
		url = 'http://kayaposoft.com/enrico/json/v1.0/?action=getPublicHolidaysForDateRange&fromDate=' + sd + '&toDate=' + ed + '&country=usa&region=New+Hampshire';
		console.log(url);
		$.ajax({
			dataType: "json",
			async: false,
			url: url,
			success: function(data) {
				console.log(data);
				
			}
		});
	},
	weatherData: function() {
		$.ajax({
			dataType: "xml",
			async: false,
			url: 'http://weather.yahooapis.com/forecastrss?w=2367105',
			success: function(data) {
				console.log(data);
				console.log($(data).find('yweather:forecast'));
			}
		});
	},

	fenwayData: function() {
		var l = this.dates.length;
		for (var i = 0; i < l; i++) {
			$.ajax({
				dataType: "json",
				async: false,
				url: 'http://api.seatgeek.com/2/events?venue.id=21&datetime_utc=' + this.dates[i],
				success: function(data) {
					if (data.events.length > 0) {
						Traffic.fData.push(data.events[0]);
					}
					else {
						Traffic.fData.push(null);
					}
				}
			});
		}
		this.renderFenwayData();
	},
	bankNorthData: function() {
		var l = this.dates.length;
		for (var i = 0; i < l; i++) {
			$.ajax({
				dataType: "json",
				async: false,
				url: 'http://api.seatgeek.com/2/events?venue.id=1544&datetime_utc=' + this.dates[i],
				success: function(data) {
					if (data.events.length > 0) {
						Traffic.bnData.push(data.events[0]);
					}
					else {
						Traffic.bnData.push(null);
					}
				}
			});
		}
		this.renderBankNorthData();
	},
	renderFenwayData: function() {
		$(".hero-unit.front").append("<h2>Fenway Park</h2>");
		if (Traffic.fData[0] === null) {
			$(".hero-unit.front").append("<p>No events scheduled<p>");
		}
		else {
			$(".hero-unit.front").append("<p>" + Traffic.fData[0].short_title + " @ " + moment(Traffic.fData[0].datetime_local).format('h:mm a') + " <p>");
		}
		for (var i = 1; i < Traffic.fData.length; i++) {
			if (Traffic.fData[i] === null) {
				$("#container" + i + " .event.fenway").append("<li>No Event</li>");
			}
			else {
				$("#container" + i + " .event.fenway").append("<li>" + Traffic.fData[i].short_title + " @ " + moment(Traffic.fData[i].datetime_local).format('h:mm a') + "</li>");
			}
		}

	},
	renderBankNorthData: function() {
		$(".hero-unit.front").append("<h2>TD Bank North Garden</h2>");
		if (Traffic.bnData[0] === null) {
			$(".hero-unit.front").append("<p>No events scheduled<p>");
		}
		else {
			$(".hero-unit.front").append("<p>" + Traffic.bnData[0].short_title + " @ " + moment(Traffic.bnData[0].datetime_local).format('h:mm a') + " <p>");
			//Traffic.score2 = Traffic.bnData[0].events[0].score !== undefined ? Traffic.bnData[0].events[0].score : 0;

		}
		for (var i = 1; i < Traffic.fData.length; i++) {
			if (Traffic.bnData[i] === null) {
				$("#container" + i + " .event.tdbanknorth").append("<li>No Event</li>");
			}
			else {
				$("#container" + i + " .event.tdbanknorth").append("<li>" +Traffic.bnData[i].short_title + " @ " + moment(Traffic.bnData[i].datetime_local).format('h:mm a')+ "</li>");
			}
		}
	},
	renderDates: function() {
		$("#date").html(moment(Traffic.dates[0]).startOf("day").format("dddd,  MM-DD-YYYY"));
		$("#container1 .date").html(moment(Traffic.dates[1]).startOf("day").format("dddd,  MM/DD"));
		$("#container2 .date").html(moment(Traffic.dates[2]).startOf("day").format("dddd,  MM/DD"));
		$("#container3 .date").html(moment(Traffic.dates[3]).startOf("day").format("dddd,  MM/DD"));
		$("#container4 .date").html(moment(Traffic.dates[4]).startOf("day").format("dddd,  MM/DD"));
		$("#container5 .date").html(moment(Traffic.dates[5]).startOf("day").format("dddd,  MM/DD"));
	}
};
$(document).ready(function() {
	var today = moment().startOf('day').format("YYYY-MM-DD"); 
	var dayOftheWeek = moment().startOf('day').format("dddd");
	var datesToGet = [];
	switch (dayOftheWeek) {
		case 'Sunday' : 
			datesToGet = [
				moment().startOf('day').add('days', 1).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 2).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 3).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 4).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 5).format("YYYY-MM-DD"),
			];
			break;
		case 'Monday' :
			datesToGet = [
				moment().startOf('day').add('days', 0).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 1).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 2).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 3).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 4).format("YYYY-MM-DD"),
			];
			break;
		case 'Tuesday' :
			datesToGet = [
				moment().startOf('day').add('days', 0).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 1).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 2).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 3).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 6).format("YYYY-MM-DD"),
			];
			break;
		case 'Wednesday' :
			datesToGet = [
				moment().startOf('day').add('days', 0).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 1).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 2).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 5).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 6).format("YYYY-MM-DD"),
			];
			break;
		case 'Thursday' :
			datesToGet = [
				moment().startOf('day').add('days', 0).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 1).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 4).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 5).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 6).format("YYYY-MM-DD"),
			];
			break;
		case 'Friday' :
			datesToGet = [
				moment().startOf('day').add('days', 0).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 3).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 4).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 5).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 6).format("YYYY-MM-DD"),
			];
			break;
		case 'Saturday' :
			datesToGet = [
				moment().startOf('day').add('days', 2).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 3).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 4).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 5).format("YYYY-MM-DD"),
				moment().startOf('day').add('days', 6).format("YYYY-MM-DD"),
			];
			break;
	}
	Traffic.init(datesToGet);
});
