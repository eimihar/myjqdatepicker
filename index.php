<script type="text/javascript" src='http://code.jquery.com/jquery-1.10.2.min.js'></script>
<script type="text/javascript" src='https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.25.3/moment.min.js'></script>
<script type="text/javascript" src='myjqdatepicker.js'></script>
<link rel="stylesheet" type="text/css" href="myjqdatepicker.css">
<style type="text/css">
	
.example *
{
	font-family: "Lucida Console";
}

.example
{
	padding-bottom:10px;
}

.example span
{
	display: block;
}


</style>
<script type="text/javascript">
	
$(document).ready(function()
{
	$("#date1").mydatepicker(1);
	$("#date2").mydatepicker(2);
	$("#date3").mydatepicker(3);
	$("#date4").mydatepicker(2, {format: 'hh:mm A'});
	$("#date5").mydatepicker(3, {format: 'LLLL'});
})

</script>
<body>
	<div class='example'>
		<span>Type 1 : Date picker only</span>
		<div><input type='text' id='date1' /></div>
	</div>
	<div class='example'>
		<span>Type 2 : Time picker only</span>
		<div><input type='text' id='date2' /></div>
	</div>
	<div class='example'>
		<span>Type 3 : Date and Time picker</span>
		<div><input type='text' id='date3' /></div>
	</div>
	<div class='example'>
		<span>Type 4 : With moment.js formatting</span>
		<div><input type='text' id='date4' /></div>
		<div><input type='text' id='date5' /></div>
	</div>
</body>