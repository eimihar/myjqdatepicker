//## Author Description :
//Name 	: Ahmad Rahimie
//Site 	: Rosengate
//github: http://github.com/eimihar

$.fn.mydatepicker	= function(type, options)
{
    if (options && typeof(moment) === 'undefined')
        throw new Error('momentjs is required');

    options = options ? options : {};

	var type		= !type?1:type;//1 you get datepicker only, 2, timepicker only, 3 date and timepicker.
	var input		= this;

	//label set.
	var monthR	= ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var weekDaysR	= ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

	//set event handling.
	this.keydown(function(e)
	{
		e.preventDefault();
	})

	this.focus(function(e){
		if(!$("#dp_holder").length)//if not exists yet only.
		{
			createDatepicker();
		}
	})

	//##preparing date.
	var cDate		= new Date();

	//configure year start and end.
	var yearStart	= cDate.getFullYear()+1;
	var yearEnd		= 1980;

	//date and time boolean check.
	var dateCheck	= type == 1 || type == 3;
	var timeCheck	= type == 2 || type == 3;

	var Y,m,d,H,mins;

	var zeronate		= function(num,total)
	{	var num		= num+"";
		var total	= total?total:2;
			total	= total-num.length;

		var the_num	= num;
		for(i=0;i<total;i++)
		{
			the_num	= "0"+the_num;
		}

		return the_num;
	}

	//main function
	var createDatepicker = function()
	{
		//prepare main value.
		var liveInput		= $(input);

        if ($(input).data('myjqdatepicker-value'))
            var datetime = liveInput.val() == ""?false:$(input).data('myjqdatepicker-value').split(" ");
        else 
            var datetime	= liveInput.val() == ""?false:liveInput.val().split(" ");

		Y			= datetime && dateCheck?Number(datetime[0].split("-")[0]):cDate.getFullYear();
		m			= datetime && dateCheck?Number(datetime[0].split("-")[1])-1:cDate.getMonth();
		d			= datetime && dateCheck?Number(datetime[0].split("-")[2]):cDate.getDate();

		H			= datetime && timeCheck?Number(datetime[type == 2?0:1].split(":")[0]):cDate.getHours();
		mins		= datetime && timeCheck?Number(datetime[type == 2?0:1].split(":")[1]):cDate.getMinutes();

		//wrap input with some wrapper.
		var holder		= $(input).wrap($("<span>").attr("id","dp_holder"));
		var dp_wrapper	= $("<div>").attr("id","dp_wrapper").appendTo($("#dp_holder"));
		var dp_body		= $("<div>").attr("id","dp_body").appendTo(dp_wrapper);

		//Date picker part.
		if(type == 1 || type == 3)
		{
			var dp_date			= $("<div>").attr("id","dp_date").appendTo(dp_body);
			var header			= $("<div>").attr("class","header").appendTo(dp_date);
			var dp_month		= $("<div>").attr("id","dp_date_month").appendTo(header);
			var dp_days			= $("<div>").attr("id","dp_date_days").appendTo(header);
			var dp_year			= $("<div>").attr("id","dp_date_year").appendTo(header);
			var middle			= $("<div>").attr("class","middle").appendTo(dp_date);

			prepareHeader();
			showMiddle("days");
		}

		if(type == 2 || type == 3)
		{
			//Time picker part.
			var dp_time		= $("<div>").attr("id","dp_time").appendTo(dp_body);
			var time_hour	= $("<div>").attr("id","dp_time_hour").appendTo(dp_time);
			var time_mins	= $("<div>").attr("id","dp_time_mins").appendTo(dp_time);
			var time_ampm	= $("<div>").attr("id","dp_time_ampm").appendTo(dp_time);

			prepareTimePicker();
		}

		//footer.
		var footer			= $("<div>").attr("id","dp_footer").appendTo(dp_wrapper);
		var footer_input 	= $("<input />").attr({"type":"button","value":"OK"}).appendTo(footer);

		//set close in footer_input click
		footer_input.click(closeDatepicker);

		//height and width equation.
		if(type == 1)
		{
			dp_wrapper.css("width",$("#dp_date").outerWidth());
		}

		if(type == 2)
		{
			dp_body.css("height",$("#dp_time").outerHeight());
			dp_wrapper.css("width",$("#dp_time").outerWidth());
		}

		if(type == 3)
		{
			$("#dp_body").css("height",$("#dp_date").outerHeight());
			if($("#dp_time").length)
			{
				$("#dp_time").css("height","100%");
			}
		}
	}

	var prepareTimePicker = function()
	{
		//hour.
		var ampmCheck	= H>=12?"PM":"AM";
		var nonrealH	= ampmCheck == "PM"?H-12:H;

		for(var i=0;i<12;i++)
		{
			var labelH	= i == 0?12:i;
			var div		= $("<div>").attr({"id":"dp_hour_"+i,"data-hour":i}).html(labelH).appendTo($("#dp_time_hour"));

			div.attr("class",nonrealH == i?"dp_time_selected":"dp_time_unselected");
			div.click(function()
			{
				selectTime("hour",$(this).attr("data-hour"));
			});
		}

		//mins.
		for(var i=0;i<60;i++)
		{
			var div		= $("<div>").attr({"id":"dp_mins_"+i,"data-mins":i}).html(i).appendTo($("#dp_time_mins"));

			div.attr("class",mins == i?"dp_time_selected":"dp_time_unselected");
			div.click(function()
			{
				selectTime("mins",$(this).attr("data-mins"));
			})
		}

		//ampm
		var ampmR	= ["AM","PM"];
		for(var i in ampmR)
		{
			var div		= $("<div>").attr({"id":"dp_ampm_"+i,"data-ampm":i}).html(ampmR[i]).appendTo($("#dp_time_ampm"));
			div.attr("class",ampmCheck == ampmR[i]?"dp_time_selected":"dp_time_unselected");
			div.click(function()
			{
				selectTime("ampm",$(this).attr("data-ampm"));
			})
		}
	}

	var prepareHeader = function()
	{
		$("#dp_date_month").html(monthR[m]).click(function(){showMiddle("month")}).attr("data-month",m);
		$("#dp_date_days").html(d).click(function(){showMiddle("days")}).attr("data-days",d);
		$("#dp_date_year").html(Y).click(function(){showMiddle("year")}).attr("data-year",Y);
	}

	

	var showMiddle		= function(middle_type)
	{
		var middle		= $("#dp_date > .middle");
		middle.html("");//reset.
		middle			= $("<div>").attr("id","dp_middle_"+middle_type).appendTo(middle);//create wrapper for different middle css selection.

		//color the header.
		$("#dp_date > .header > div").attr("class","header_unselected");
		$("#dp_date_"+middle_type).attr("class","header_selected");

		var month		= Number($("#dp_date_month").attr("data-month"));
		var day			= Number($("#dp_date_days").attr("data-days"));
		var year		= Number($("#dp_date_year").attr("data-year"));

		switch(middle_type)
		{
			case "month":
			//prepare month.

			for(var i in monthR)
			{
				var m	= $("<div>").attr("id","dp_month_"+i).appendTo(middle);
				m.html(monthR[i]);
				m.attr("data-month",i);
				m.attr("class",month == i?"dp_date_selected":"dp_date_unselected");
				m.attr("id","dp_middle_"+i);
				m.click(function(){selectDate("month",$(this).attr("data-month"))});
			}
			break;
			case "days":
			

			//create header first.
			var week	= $("<div>").html("W");
			middle.append(week);
			for(var i in weekDaysR)
			{
				var weekDay	= $("<div>").html(weekDaysR[i]);
				middle.append(weekDay);
			}

			//main date loop.
			//get first date of the calendar
			var dateFirst	= new Date(year,month,1);
			dateFirst.setDate(1-dateFirst.getDay());

			//get end date of the calendar.
			var lastDate	= new Date(year,month,32); //extra date of the next month.
			lastDate		= 32 - lastDate.getDate();
		
			var dateEnd		= new Date(year,month,lastDate);
			dateEnd.setDate(dateEnd.getDay() != 6?dateEnd.getDate()+(6-dateEnd.getDay()):lastDate);

			//equate dateCurrent with dateFirst for naming convention.
			var dateCurrent	= dateFirst;

			var currWeek	= 1;
			while(dateCurrent.getTime() <= dateEnd.getTime())
			{
				var currDay	= dateCurrent.getDate();

				if(dateCurrent.getDay() == 0)
				{
					middle.append($("<div>").html(currWeek));
					currWeek++;
				}

				var the_day	= $("<div>").html(currDay);				
				middle.append(the_day);

				if(dateCurrent.getMonth() == month)
				{
					the_day.click(function(){selectDate("days",this.innerHTML)});
					the_day.attr("id","dp_middle_"+currDay);
				}
				if(currDay == day && dateCurrent.getMonth() == month)
				{
					the_day.attr("class","dp_date_selected");
				}
				else if(dateCurrent.getMonth() == month)
				{
					the_day.attr("class","dp_date_unselected");
				}

				if(dateCurrent.getMonth() != month)
				{
					the_day.attr("class","dp_days_nonday");
				}

				//increment.
				dateCurrent.setDate(dateCurrent.getDate()+1);
			}

			break;
			case "year":
			for(var i=yearStart;i>=yearEnd;i--)//from next year to 1980
			{
				var div	= $("<div>").attr("id","dp_middle_"+i).html(i);;
				div.attr("class",year == i?"dp_date_selected":"dp_date_unselected");
				div.appendTo(middle);
				div.click(function()
				{
					selectDate("year",this.innerHTML);
				})
			}
			break;
		}

		//re-height dp_body
		$("#dp_body").css("height",$("#dp_date").outerHeight());
	}

	var selectDate		= function(type,val)
	{
		setHeader(type,val);
		$("#dp_date .dp_date_selected").attr("class","dp_date_unselected");
		$("#dp_middle_"+val).attr("class","dp_date_selected");

		setInput();
		//go back to middle = days.
		if(type == "month" || type == "year")
		{
			showMiddle("days");
		}
	}

	var setHeader		= function(h,v)
	{
		$("#dp_date_"+h).attr("data-"+h,Number(v));

		var month	= Number($("#dp_date_month").attr("data-month"));
		var day		= Number($("#dp_date_days").attr("data-days"));
		var year	= Number($("#dp_date_year").attr("data-year"));

		//rebuild to recorrect if got a wrong date.
		var the_date	= new Date(year,month,day);

		//month		= the_date.getMonth(); //recorrect only date and year.
		day			= the_date.getDate();
		year		= the_date.getFullYear();

		$("#dp_date_month").html(monthR[month]).attr("data-month",month);
		$("#dp_date_days").html(day).attr("data-days",day);
		$("#dp_date_year").html(year).attr("data-year",year);
		$("#dp_date_"+h).html(h == "month"?monthR[v]:v);
	}

	var selectTime		= function(h,v)
	{
		$("#dp_time_"+h+" > .dp_time_selected").attr("class","dp_time_unselected");
		$("#dp_"+h+"_"+v).attr("class","dp_time_selected");

		setInput();
	}

	var setInput		= function()
	{
		if(type == 1 || type == 3)
		{
			var Y		= $("#dp_date_year").attr("data-year");
			var m		= Number($("#dp_date_month").attr("data-month"))+1;
			var d		= $("#dp_date_days").attr("data-days");

			var dateVal	= Y+"-"+zeronate(m)+"-"+zeronate(d);
		}
		if(type == 2 || type == 3)
		{
			var AMPM	= $("#dp_time_ampm > .dp_time_selected").html();
			var H		= $("#dp_time_hour > .dp_time_selected").attr("data-hour");
				H		= AMPM == "PM"?Number(H)+12:H;
			var i		= $("#dp_time_mins > .dp_time_selected").attr("data-mins");

			var timeVal	= zeronate(H)+":"+zeronate(i);
		}

        var value = type == 1 ? dateVal : (type == 2 ? timeVal : dateVal + " " + timeVal);

        $(input).data('myjqdatepicker-value', value);

        var val = value;

        if (options.format) {
            if (type == 1)
                val = moment(value).format(options.format);
            else if (type == 2)
                val = moment(value, 'HH:mm').format(options.format);
            else if (type == 3)
                val = moment(value).format(options.format);
        }

		$(input).val(val);

        if (options.callback) {
            options.callback(value);
        }
	}

	var closeDatepicker = function()
	{
		setInput();
		$("#dp_wrapper").slideUp(function()
		{
			$(input).unwrap();
			$("#dp_wrapper").remove();
		});
	}
}