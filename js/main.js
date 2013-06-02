
var Traffic = {
	init: function(today) {
		this.cacheElements();
		this.getEvents(today);
		this.bindEvents();
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
	cacheElements: function() {
		this.score1 = 0;
		this.score2 = 0;
	},
	getEvents: function(today) {
		fenway();
		function fenway() {
			$.ajax({
				dataType: "json",
				url: 'http://api.seatgeek.com/2/events?venue.id=21&datetime_utc=' + today,
				success: function(data) {
					$("#date").html(moment().startOf("day").format("MM-DD-YYYY"));
					$(".hero-unit.front").append("<h2>Fenway Park</h2>");
					if (data.events.length > 0) {
						Traffic.score1 = data.events[0].score !== undefined ? data.events[0].score : 0;
						$(".hero-unit.front").append("<p>" + data.events[0].short_title + "<p>");
						$(".hero-unit.front").append("<p>" + moment(data.events[0].datetime_local).format('h:mm a') + "<p>");
						garden();
					}
					else {
						$(".hero-unit.front").append("<p>No events scheduled<p>");
						garden();
					}
				}
			});
		}
		function garden() {
			$.ajax({
				dataType: "json",
				url: 'http://api.seatgeek.com/2/events?venue.id=1544&datetime_utc=' + today,
				success: function(data) {
					$(".hero-unit.front").append("<h2>TD Bank North Garden</h2>");
					if (data.events.length > 0) {
						Traffic.score2 = data.events[0].score !== undefined ? data.events[0].score : 0;
						$(".hero-unit.front").append("<p>" + data.events[0].short_title + "<p>");
						$(".hero-unit.front").append("<p>" + moment(data.events[0].datetime_local).format('h:mm a') + "<p>");
						calculate();
					}
					else {
						$(".hero-unit.front").append("<p>No events scheduled<p>");
						calculate();
					}
				}
			});
		}
		function calculate() {
			var total = Traffic.score1 + Traffic.score2;
			if (total > 1) {
				$(".hero-unit.front .right").append("<img src='img/90.png' />");
			}
			if (total > .70 && total < .80) {
				$(".hero-unit.front .right").append("<img style='opacity: .5;' src='img/1.png' />");
			}
			if (total < .70) {
				$(".hero-unit.front .right").append("<img style='opacity: 1;' src='img/1.png' />");
			}
		}
	}
};
$(document).ready(function() {
	var today = moment().startOf('day').format("YYYY-MM-DD"); 
	Traffic.init(today);
});
