var numberOfDaysPerMonthHashTable = {'9,2007' :30, '10,2007' :31, '11,2007' :30, '12,2007' :31, '1,2008' :31, '2,2008' :29, '3,2008' :31, '4,2008' :30, '5,2008' :31, '6,2008' :30, '7,2008' :31, '8,2008' :31, '9,2008' :30}
var ControlID       = "ctl00_SSearchBox_";
var ErrorAjax       = "Your webbrowser does not seem to be AJAX capable. Please reload the page to try again or upgrade your webbrowser";
var ErrorCallBack   = "There is a problem retrieving the City or Hotel list from the server. Please reload the page, use an AJAX compatible webbrowser or report this problem with the feedback form link on the bottom of this page.";
var ErrorPast       = "Check-in Date is in the past.\nPlease select a new date.";
var ErrorLater      = "Check-out Date must be later than Check-in Date.";
var ErrorDays       = "Number of Nights must be between 1 and 120. Maximum Number of Nights allowed is 120.\nFor stays of longer than 120 days, please contact our Customer Service Agents.";
var ErrorCountry    = "Please Select a Country.";
var ErrorCity       = "Please Select a City.";
var More3Rooms      = "If you wish to book more than 3 rooms please contact an Online Agent.";
var AdultChildMax   = "The number of adults and children selected must not exceed a total of 4 per room.";
var RoomsMoreGuest  = "Searching for rooms that hold 4 guests can reduce the search results. You can now: click OK to continue this search. Click cancel to change your search or contact a customer service agent.";
var ErrorNoArrival  = "Please select Arrival date or no dates at all!";
var ErrorNoDepart   = "Please select Departure date or no dates at all!";
var WaitText        = "Loading"+"...";
var WaitHotel       = "Select City first";
var WaitCity        = "Select Country first";
var ErrorDate       = "Please select a date";
var txtDay          = "Day";
var txtMonth         = "Month";
var IsSmartSearchResult='False';
var DateDiff = 1;
var DateShift = 1;
var dNow = new Date()
TimeShift();
function TimeShift(){
	var dNow = new Date();
	if((((dNow.getUTCHours()*60)+dNow.getUTCMinutes())  >= ((10*60)+5))  &&  ((dNow.getUTCHours()*60)  < (17*60))){
		DateShift = 0;
	}
	else{
		DateShift = 0;
	}
}
var jsLang =
{	
txtGoCurrentMonth : "Go To Current Month",
txtTodayIs : "Today is",
txtWeek : "Wk",
txtScrollLeftMessage : "Click to scroll to previous month. Hold mouse button to scroll automatically.",
txtDayDisabled : "Can not book this day",
txtSelectYear : "Click to select a year.",
txtSelectMonth : "Click to select a month.",
txtSelectDay: "Click to select this day.",
txtNextYear : "Next Year",
txtNextMonth : "Next Month",
txtPrevYear : "Previous Year",
txtPrevMonth : "Previos Month",
txtClose : "Close Window",

//Messages
txtMsgInvalidDate :"Invalid date!! \n\nUse following format:mm/dd/yyyy",
txtMsgInvalidRange : "Selected date out of valid range!!\n Must be within a year range.",
txtMsgMaxNumerOfNights : "Number of Nights must be between 1 and 120. Maximum Number of Nights allowed is 120.\nFor stays of longer than 120 days, please contact our Customer Service Agents.",
txtMsgCheckindayInPast : "Check-in Date is in the past.\nPlease select a new date."
};

var cal_monthNames = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
var cal_shortDays = new Array("Sun","Mon","Tue","Wed","Thu","Fri","Sat");
var cal_monthOutput = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
var cal_cmbMonthFormat = "mmm, yyyy";
var cal_dsplMonthFormat = "mmmm yyyy";
var cal_dsplComboFormat = "month";

var cal_fixedX = -1;            // x position (-1 if to appear below control)
var cal_fixedY = -1;            // y position (-1 if to appear below control)
var cal_startAt = 0;            // 0 - sunday ; 1 - monday
var cal_showWeekNumber = 1;	    // 0 - don't show; 1 - show
var cal_showToday = 1;		    // 0 - don't show; 1 - show
var cal_imgDir = "/images/";	// directory for images ... e.g. var cal_imgDir="/img/"
var cal_enablehistory=false;
var cal_gotoString = jsLang.txtGoCurrentMonth;
var cal_todayString = jsLang.txtTodayIs;
var cal_weekString = jsLang.txtWeek;
var cal_scrollLeftMessage = jsLang.txtPrevMonth;
var cal_scrollRightMessage = jsLang.txtNextMonth;
var cal_selectMonthMessage = jsLang.txtSelectMonth;
var cal_selectYearMessage = jsLang.txtSelectYear;
var	cal_crossObj, cal_crossMonthObj, cal_crossYearObj, cal_monthSelected, cal_yearSelected, cal_dateSelected, ocal_monthSelected, ocal_yearSelected, ocal_dateSelected, cal_monthConstructed, cal_yearConstructed, cal_intervalID1, cal_intervalID2
var cal_timeoutID1, cal_timeoutID2, cal_ctlToPlaceValue, cal_ctlNow, cal_dateFormat, cal_nStartingYear;

//Browser checks
var	cal_bPageLoaded=false;
var	ie=document.all;
var	dom=document.getElementById;
var	ns4=document.layers;
var	cal_today =	new	Date();
var	cal_dateNow	 = cal_today.getDate();
var	cal_monthNow = cal_today.getMonth();
var	cal_yearNow	 = cal_today.getYear();
var oFunctions;
var bShow = false;
if (dom) {
	var calwidth=200;
	calwidth=425;
	document.write("<div style='z-index:1 position:relative' onclick='bShow=true' id='calendar' class='div-style'><table width="+((cal_showWeekNumber==1)?calwidth:(calwidth-25))+" class='table-style' border='0' cellpadding='0' cellspacing='0'><tr class='title-background-style'><td><table width='100%' border='0'><tr><td class='title-style'><B><span id='caption'></span></B></td></tr></table></td></tr><tr><td class='body-style'><span id='strContent'></span></td></tr>");
	if (cal_showToday==1) {
		document.write("<tr class='today-style'><td><span id='lblToday'></span></td></tr>");
	}		
	document.write("</table></div><div id='selectMonth' class='div-style'></div><div id='selectYear' class='div-style'></div>");
}
var	cal_monthName =	cal_monthNames;
if (cal_startAt==0) {
	cal_dayName = cal_shortDays; 
} 
else {
	cal_dayName = new Array(cal_shortDays[1],cal_shortDays[2],cal_shortDays[3],cal_shortDays[4],cal_shortDays[5],cal_shortDays[6],cal_shortDays[0]);
}
/* hides <select> and <applet> objects (for IE only) */
function hideElement( elmID, overDiv ) {
	if (ie) {
		for( i = 0; i < document.all.tags( elmID ).length; i++ ) {
			obj = document.all.tags( elmID )[i];
			if (!obj || !obj.offsetParent) {
				continue;
			}

			// Find the element's offsetTop and offsetLeft relative to the BODY tag.
			objLeft   = obj.offsetLeft;
			objTop    = obj.offsetTop;
			objParent = obj.offsetParent;

			// Add HTML check solved problem using calendar within box_search
			while( objParent.tagName.toUpperCase() != "BODY" && objParent.tagName.toUpperCase() != "HTML") {
				objLeft  += objParent.offsetLeft;
				objTop   += objParent.offsetTop;
				objParent = objParent.offsetParent;
			}

			objLeft = chkLeftPos(objLeft);
			objHeight = obj.offsetHeight;
			objWidth = obj.offsetWidth;

			// condition to check if there is no need to hide obj
			if ((overDiv.offsetLeft+overDiv.offsetWidth ) <= objLeft);
			else if((overDiv.offsetTop+overDiv.offsetHeight) <= objTop);
			else if(overDiv.offsetTop >= (objTop+objHeight));
			else if(overDiv.offsetLeft >= (objLeft+objWidth));
			else {
				obj.style.visibility = "hidden";
			}
		}
	}
}

/* unhides <select> and <applet> objects (for IE only)   */
function showElement(elmID) {
	if (ie) {
		for(i=0; i<document.all.tags(elmID).length;i++) {
			obj = document.all.tags(elmID)[i];
			if (!obj || !obj.offsetParent) {
				continue;
			}
			obj.style.visibility = "";
		}
	}
}

function swapImage(srcImg, destImg){
	if (ie)	{ 
		document.getElementById(srcImg).setAttribute("src",cal_imgDir + destImg); 
	}
}

function init_calendar() {
	if (!ns4) {
		// correction for browsers as Opera
		if (cal_yearNow<1900) { 
			cal_yearNow+=1900;	
		}
		cal_crossObj=(dom)?document.getElementById("calendar").style : ie? document.all.calendar : document.calendar;
		hideCalendar();
		cal_crossMonthObj=(dom)?document.getElementById("selectMonth").style : ie? document.all.selectMonth	: document.selectMonth;
		cal_crossYearObj=(dom)?document.getElementById("selectYear").style : ie? document.all.selectYear : document.selectYear;
		cal_monthConstructed=false;
		cal_yearConstructed=false;
		if (cal_showToday==1) {
			document.getElementById("lblToday").innerHTML=cal_todayString+" <a class='today-style' title='"+cal_gotoString+"' href='javascript:cal_monthSelected=cal_monthNow;cal_yearSelected=cal_yearNow;constructCalendar();'>"+cal_dayName[(cal_today.getDay()-cal_startAt==-1)?6:(cal_today.getDay()-cal_startAt)]+", "+cal_dateNow+" "+cal_monthName[cal_monthNow].substring(0,3)+" "+cal_yearNow+"</a>";
		}
		document.getElementById("lblToday").innerHTML="<a href='javascript:hideCalendar()' class='closecal' title='"+jsLang.txtClose+"'>"+jsLang.txtClose+"</a>";
		sHTML1="<table width='100%' cellspacing='0' cellpadding='0' border='0'><tr height='20'>";
		sHTML1+="<td width='25' class'titles' style='width:15px'><span id='spanLeft' title='"+cal_scrollLeftMessage+"' class='title-control-normal-style' onmouseover='this.className=\"title-control-select-style\";' onclick='javascript:decMonth()' onmouseout='clearInterval(cal_intervalID1);this.className=\"title-control-normal-style\";' onmousedown='clearTimeout(cal_timeoutID1);cal_timeoutID1=setTimeout(\"StartDecMonth()\",500)' onmouseup='clearTimeout(cal_timeoutID1);clearInterval(cal_intervalID1)'>< </span></td>";
		sHTML1+="<td width='44%' class'titles' align='center'><span id='spanMonth' class='title-control-style'></span></td>";
		sHTML1+="<td width='44%' class'titles' align='center'><span id='spanMonth2' class='title-control-style'></span></td>";
		sHTML1+="<td width='25' class'titles' style='width:15px' align='right'><span id='spanRight' title='"+cal_scrollRightMessage+"' style='width:18px; text-align:right' class='title-control-normal-style' onmouseover='this.className=\"title-control-select-style\";' onmouseout='clearInterval(cal_intervalID1);this.className=\"title-control-normal-style\";' onclick='incMonth()' onmousedown='clearTimeout(cal_timeoutID1);cal_timeoutID1=setTimeout(\"StartIncMonth()\",500)' onmouseup='clearTimeout(cal_timeoutID1);clearInterval(cal_intervalID1)'> ></span></td>";
		sHTML1+="</tr></table>";
		document.getElementById("caption").innerHTML=sHTML1;
		cal_bPageLoaded=true;
	} 
	else {
		alert("Your browser does not support this feature!");
	}
}

function hideCalendar()	{
	if(cal_crossObj){
		cal_crossObj.visibility="hidden";
		if (cal_crossMonthObj != null){cal_crossMonthObj.visibility="hidden";}
		if (cal_crossYearObj !=	null){cal_crossYearObj.visibility="hidden";}
		if (document.getElementById("spanLeft")) { document.getElementById("spanLeft").style.visibility = "hidden";}
		if (document.getElementById("spanRight")) { document.getElementById("spanRight").style.visibility = "hidden";}
		showElement( 'SELECT' );
		showElement( 'APPLET' );
	}
}

function padZero(num) {
	return (num	< 10)? '0' + num : num ;
}

function cal_constructDate(d,m,y) {
	var sTmp = cal_dateFormat;
	sTmp = sTmp.replace("dd",padZero(d));
	sTmp = sTmp.replace("d",d);
	sTmp = sTmp.replace("mmm",cal_monthName[m]);
	sTmp = sTmp.replace("mm",padZero(m+1));
	return sTmp.replace("yyyy",y);
}

function frmtDate(frmt,d,m,y) {
	var sTmp = frmt;
	sTmp = sTmp.replace("dd",padZero(d));
	sTmp = sTmp.replace("d",d);
	sTmp = sTmp.replace("mmmm",cal_monthNames[m]);
	sTmp = sTmp.replace("MMMM",cal_monthNames[m]);
	sTmp = sTmp.replace("mmm",cal_monthOutput[m]);
	sTmp = sTmp.replace("MMM",cal_monthOutput[m]);
	sTmp = sTmp.replace("mm",padZero(m+1));
	sTmp = sTmp.replace("MM",m+1);
	return sTmp.replace("yyyy",y);
}

function closeCalendar() {
	hideCalendar();
	cal_ctlToPlaceValue.value =	cal_constructDate(cal_dateSelected,cal_monthSelected,cal_yearSelected);
	if(typeof(oFunctions)== "function"){
		oFunctions(cal_ctlToPlaceValue,cal_dateSelected,cal_monthSelected,cal_yearSelected);
	}
}

/*** Month Pulldown	***/
function StartDecMonth() {
	cal_intervalID1=setInterval("decMonth()",80);
}

function StartIncMonth() {
	cal_intervalID1=setInterval("incMonth()",80);
}

function incMonth () {
	cal_monthSelected++;
	if (cal_monthSelected>11) {
		cal_monthSelected=0;
		cal_yearSelected++;
	}
	constructCalendar();
}

function decMonth () {
	cal_monthSelected--;
	if (cal_monthSelected<0) {
		cal_monthSelected=11;
		cal_yearSelected--;
	}
	constructCalendar();
}

function getLeftPos(obj) {
	// Find the element's offsetLeft relative to the BODY tag.
	var objLeft   = obj.offsetLeft;
	var objParent = obj.offsetParent;
	while( objParent.tagName.toUpperCase() != "BODY" ) {
		objLeft  += objParent.offsetLeft;
		objParent = objParent.offsetParent;
	}
	return objLeft;
}

/*** Year Pulldown ***/
function incYear() {
	for	(i=0; i<7; i++){
		newYear	= (i+cal_nStartingYear)+1;
		if (newYear==cal_yearSelected) { 
			txtYear="&nbsp;<B>"+newYear+"</B>&nbsp;";
		} else { 
			txtYear="&nbsp;"+newYear+"&nbsp;"; 
		}
		document.getElementById("y"+i).innerHTML = txtYear;
	}
	cal_nStartingYear++;
	bShow=true;
}

function decYear() {
	for	(i=0; i<7; i++){
		newYear	= (i+cal_nStartingYear)-1;
		if (newYear==cal_yearSelected) { 
			txtYear="&nbsp;<B>"+newYear+"</B>&nbsp;";
		}
		else { 
			txtYear =	"&nbsp;" + newYear + "&nbsp;";
		}
		document.getElementById("y"+i).innerHTML = txtYear;
	}
	cal_nStartingYear--;
	bShow=true;
}

/*** calendar ***/
function WeekNbr(today) {
	Year = takeYear(today);
	Month = today.getMonth();
	Day = today.getDate();
	now = Date.UTC(Year,Month,Day+1,0,0,0);
	var Firstday = new Date();
	Firstday.setYear(Year);
	Firstday.setMonth(0);
	Firstday.setDate(1);
	then = Date.UTC(Year,0,1,0,0,0);
	var Compensation = Firstday.getDay();
	if (Compensation > 3) Compensation -= 4;
	else Compensation += 3;
	NumberOfWeek =  Math.round((((now-then)/86400000)+Compensation)/7);
	return NumberOfWeek;
}

function takeYear(theDate) {
	x=theDate.getYear();
	var y=x%100;
	y += (y < 38) ? 2000 : 1900;
	return y;
}

function cal_seletion(nDay,nMonth,nYear) {
	cal_dateSelected=nDay;
	cal_monthSelected=nMonth;
	cal_yearSelected=parseInt(nYear);
	closeCalendar();
}

function getMonthTable(selYear,selMonth) {
	// correction for doublemonths
	if (selMonth==12) {
		selMonth=0;
		selYear+=1;
	}
	var dateMessage;
	var	startDate =	new	Date (selYear,selMonth,1);
	var	endDate	= new Date (selYear,selMonth+1,1);
	endDate	= new Date (endDate	- (24*60*60*1000));
	numDaysInMonth = endDate.getDate();
	datePointer	= 0;
	dayPointer = startDate.getDay() - cal_startAt;
	if (dayPointer<0) {
		dayPointer = 6;
	}
	var sHTML =	"<table	border='0' class='body-style' cellpadding='0' cellspacing='0' width='100%'><tr class='dayofweeks'>";
	if (cal_showWeekNumber==1) {
		sHTML += "<td width='25' align='center'><b>" + cal_weekString + "</b></td><td width='1' rowspan='7' class='weeknumber-div-style'><img src='"+cal_imgDir+"divider.gif' width='1'></td>";
	}
	for	(i=0; i<7; i++)	{
		if((i==0)||(i==6)){
			sHTML += "<td width='25' align='right' style='padding-right:2px' bgcolor='#DFDFDF'><span style='color:#FF0000;'>"+ cal_dayName[i]+"</span></td>";
		}
		else{
			sHTML += "<td width='25' align='right' style='padding-right:2px' bgcolor='#DFDFDF'>"+ cal_dayName[i]+"</td>";
		}
	}
	sHTML +="</tr><tr>";
	if (cal_showWeekNumber==1) {
		sHTML += "<td align=right>" + WeekNbr(startDate) + "&nbsp;</td>";
	}
	for	( var i=1; i<=dayPointer;i++ ) {
		sHTML += "<td>&nbsp;</td>";
	}
	var bDayEnabled;
	var sDisabled="";
	for	( datePointer=1; datePointer<=numDaysInMonth; datePointer++ ) {
		dayPointer++;
		bDayEnabled=true;
		//Check if day should be enabled or disabled for selection
		if (typeof(chkEnableDay)=="function") {
			bDayEnabled=chkEnableDay(datePointer,selMonth,selYear);
		}
		sHTML += "<td align='right' class='cal_day'>";
		var sStyle="normal-day-style"; //regular day
		if ((datePointer==cal_dateNow)&&(selMonth==cal_monthNow)&&(selYear==cal_yearNow)) { //today
			sStyle = "current-day-style"; 
		} 
		else if	((dayPointer % 7 == (cal_startAt * -1) +1)||(dayPointer % 7 == (cal_startAt * -1) )) { //end-of-the-week day
			sStyle = "end-of-weekday-style"; 
		}
		//selected day
		if ((datePointer==ocal_dateSelected) &&	(selMonth==ocal_monthSelected)	&& (selYear==ocal_yearSelected)) {
			sStyle += " selected-day-style"; 
		}
		sDisabled="";
		sHint = jsLang.txtSelectDay;
		if (bDayEnabled==false) {
			sStyle="disabled-"+sStyle;
			sDisabled=" disabled";
			sHint=jsLang.txtDayDisabled;
		}
		var regexp= /\"/g;
		sHint=sHint.replace(regexp,"&quot;");
		dateMessage = ""; 
		if (bDayEnabled)
			sHTML += "<a class='"+sStyle+"' "+dateMessage+" title=\"" + sHint + "\" href='javascript:cal_seletion("+datePointer+","+selMonth+","+selYear+");'>&nbsp;" + datePointer + "&nbsp;</a>"
		else
			sHTML += "<label class='"+sStyle+"' "+sDisabled+" title=\"" + sHint + "\" >&nbsp;" + datePointer + "&nbsp;</label>"
		sHTML += "";
		if ((dayPointer+cal_startAt) % 7 == cal_startAt) { 
			sHTML += "</tr><tr>";
			if ((cal_showWeekNumber==1)&&(datePointer<numDaysInMonth)) {
				sHTML += "<td align=right>" + (WeekNbr(new Date(selYear,selMonth,datePointer+1))) + "&nbsp;</td>";
			}
		}
	}
	sHTML+="</tr></table>"
	return sHTML;
}

function constructCalendar () {
	var dateMessage;
	var	startDate =	new	Date (cal_yearSelected,cal_monthSelected,1);
	var	endDate	= new Date (cal_yearSelected,cal_monthSelected+1,1);
	endDate	= new Date (endDate	- (24*60*60*1000));
	numDaysInMonth = endDate.getDate();
	datePointer	= 0;
	dayPointer = startDate.getDay() - cal_startAt;
	if (dayPointer<0) {
		dayPointer = 6;
	}
	//Check if day should be enabled or disabled for selection
	var bPrevEnabled=true;
	var bNextEnabled=true;
	//if (cal_monthSelected<=cal_monthNow && cal_yearSelected==cal_yearNow && cal_enablehistory==false) {
		//bPrevEnabled=false;
	//}
	if (bPrevEnabled) 
		bPrevEnabled=chkEnableDay(1,cal_monthSelected,cal_yearSelected);
	if (typeof(chkEnableDay)=="function") {
		bNextEnabled=chkEnableDay(1,cal_monthSelected+2,cal_yearSelected);
	}
	if (bPrevEnabled) {
		document.getElementById("spanLeft").style.visibility = (dom||ie)? "visible" : "show";
		document.getElementById("spanLeft").disabled=false;
	} else {
		document.getElementById("spanLeft").style.visibility = "hidden";
		document.getElementById("spanLeft").disabled=true;
	}    
	if (bNextEnabled) {
		document.getElementById("spanRight").style.visibility = (dom||ie)? "visible" : "show";
		document.getElementById("spanRight").disabled=false;
	} else {
		document.getElementById("spanRight").style.visibility = "hidden";
		document.getElementById("spanRight").disabled=true;
	}    
	// script for month table
	var mnt1Html = getMonthTable(cal_yearSelected,cal_monthSelected);
	var mnt2Html = "";
	mnt2Html = getMonthTable(cal_yearSelected,cal_monthSelected+1);
	sHTML = "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td valign='top' align='left'>"+mnt1Html+"</td><td></td><td bgcolor='#909090' width='2'></td><td></td><td valign='top' align='right'>"+mnt2Html+"</td></tr></table>"
	document.getElementById("strContent").innerHTML = sHTML;
	document.getElementById("spanMonth").innerHTML=frmtDate(cal_dsplMonthFormat,cal_dateSelected,cal_monthSelected,cal_yearSelected);
	var calMonth2=cal_monthSelected+1;
	var calYear2=cal_yearSelected;
	if (calMonth2==12) {
		calMonth2=0;
		calYear2+=1;
	}
	document.getElementById("spanMonth2").innerHTML=frmtDate(cal_dsplMonthFormat,cal_dateSelected,calMonth2,calYear2);
}

function popUpCalendar(ctl,	ctl2, format, OtherFunctions) {
	var	leftpos = 240;var toppos = 100;
	oFunctions = OtherFunctions;
	if (cal_bPageLoaded) {
		if (cal_crossObj.visibility=="hidden") {
			cal_ctlToPlaceValue	= ctl2;
			cal_dateFormat=format;
			formatChar = " ";
			aFormat	= cal_dateFormat.split(formatChar);
			if (aFormat.length<3) {
				formatChar = "/";
				aFormat	= cal_dateFormat.split(formatChar);
				if (aFormat.length<3) {
					formatChar = ".";
					aFormat	= cal_dateFormat.split(formatChar);
					if (aFormat.length<3) {
						formatChar = "-";
						aFormat	= cal_dateFormat.split(formatChar);
						if (aFormat.length<3)
						{
							// invalid date	format
							formatChar="";
						}
					}
				}
			}
			tokensChanged =	0;
			if ( formatChar	!= "" ) {
				// use user's date
				aData =	ctl2.value.split(formatChar);
				for	(i=0;i<3;i++) {
					if ((aFormat[i]=="d") || (aFormat[i]=="dd")) {
						cal_dateSelected = parseInt(aData[i], 10);
						tokensChanged++;
					}
					else if	((aFormat[i]=="m") || (aFormat[i]=="mm")) {
						cal_monthSelected =	parseInt(aData[i], 10) - 1;
						tokensChanged++;
					}
					else if	(aFormat[i]=="yyyy") {
						cal_yearSelected = parseInt(aData[i], 10);
						tokensChanged++;
					}
					else if	(aFormat[i]=="mmm") {
						for	(j=0; j<12;	j++) {
							if (aData[i]==cal_monthName[j]) {
								cal_monthSelected=j;
								tokensChanged++;
							}
						}
					}
				}
			}
			if ((tokensChanged!=3)||isNaN(cal_dateSelected)||isNaN(cal_monthSelected)||isNaN(cal_yearSelected)) {
				cal_dateSelected    = cal_dateNow;
				cal_monthSelected   = cal_monthNow;
				cal_yearSelected    = cal_yearNow;
			}
			ocal_dateSelected   = cal_dateSelected;
			ocal_monthSelected  = cal_monthSelected;
			ocal_yearSelected   = cal_yearSelected;
			aTag = ctl;
			//leftpos	+= aTag.offsetLeft;
			//toppos += aTag.offsetTop;
			/*do {
				aTag = aTag.offsetParent;
				leftpos	+= aTag.offsetLeft;
				toppos += aTag.offsetTop;
			} while(aTag.tagName!="BODY" && aTag.tagName!="HTML");*/
			// Add HTML check solved problem using calendar within box_search
			//Need to convert to string for firefox
			var posleft = ctl.offsetLeft + leftpos + ctl.offsetWidth;
			var cr_height = screen_height / 2;
			// Check leftpos to document.body.offsetWidth
			posleft = chkLeftPos(posleft);
			var strLeft = new String(posleft+"px");
			var postop = cr_height - toppos;
			//if(postop<80){
				//postop = postop + 80;
			//}
			var strTop = new String(postop+"px");
			cal_crossObj.left =	cal_fixedX==-1 ? strLeft :	cal_fixedX;
			cal_crossObj.top = cal_fixedY==-1 ?	strTop : cal_fixedY;
			constructCalendar(1, cal_monthSelected, cal_yearSelected);
			cal_crossObj.visibility=(dom||ie)? "visible" : "show";
			hideElement( 'SELECT', document.getElementById("calendar") );
			hideElement( 'APPLET', document.getElementById("calendar") );			
			bShow = true;
		}
	}
	else {
		init_calendar();
		popUpCalendar(ctl,	ctl2, format, OtherFunctions);
	}
}

function chkLeftPos(lefpos) {
	var retval = lefpos;
	var rightpos = lefpos+document.getElementById("calendar").offsetWidth;
	var winWidth = document.body.offsetWidth;
	var offset=0;
	if (rightpos>winWidth) {
		offset=rightpos-winWidth+1;
		retval -= offset;
		if (retval<0) 
			retval=0;
	}
	return  retval
}

document.onkeypress = function hidecal1 () { 
	if (event.keyCode==27) {
		hideCalendar();
	}
}
document.onclick = function hidecal2 () { 		
	if (!bShow) {
		hideCalendar();
	}
	bShow=false;
}

function y2k(d) { 
    return (d < 1000) ? d + 1900 : d;
}

function daysElapsed(date1, date2) {//date1=Out , date2 = In
	var TempDate1 = new Array();
	var TempDate2 = new Array();
	TempDate1 = date1.split('/');
	TempDate2 = date2.split('/');	
    var difference = Date.UTC(y2k(TempDate1[2]),TempDate1[1],TempDate1[0],0,0,0) - Date.UTC(y2k(TempDate2[2]),TempDate2[1],TempDate2[0],0,0,0);
	//alert(date1+ ' , ' + date2 + ' , ' + difference/1000/60/60/24);
	return difference/1000/60/60/24;
}

//End added more code 26/01/2007
function chkEnableDay(chkday,chkmonth,chkyear) {
    //correction when roll over into next year
    if (chkmonth>=12) {
        chkmonth-=12;
        chkyear+=1;
    }
    var retval=true;
    var date = new Date();
    var dateNow	 = date.getDate();
    var monthNow = date.getMonth();
    var yearNow	 = date.getFullYear();
	if (yearNow<1900) { 
	    yearNow+=1900;	
	}
	var nDaMo=new Array(31,28,31,30,31,30,31,31,30,31,30,31);
	if(yearNow%4==0){ nDaMo[1]=29;}
	if(monthNow == 11){
		if((dateNow + DateShift) > nDaMo[monthNow]){
			dateNow = 1;
			monthNow = 0;
			yearNow = yearNow+1;
		}
		else{
			dateNow = dateNow + DateShift;
		}
	}
	else{
		if((dateNow + DateShift) > nDaMo[monthNow]){
			dateNow = 1;
			monthNow = monthNow+1;
		}
		else{
			dateNow = dateNow + DateShift;
		}
	}
	
	// Check past
	//if ((chkyear-yearNow) <= 0 && (chkmonth<monthNow || (chkmonth==monthNow && chkday<dateNow))) {
	    //retval=false;
	//}
	// Check more then 1 year
	//if (chkyear>yearNow && ((chkmonth>=monthNow && chkday>dateNow) || chkmonth>monthNow)) {
	    //retval=false;
	//}
	//if (chkyear<yearNow || (chkyear-yearNow>1))
	    //retval=false;
    return retval;
}

function fnSetDate(obj,nDay,nMonth,nYear){
	nMonth++;
	if (obj.id=="dchkin"){
		var nDaMo=new Array(0,31,28,31,30,31,30,31,31,30,31,30,31);
		if(nYear%4==0){ nDaMo[2]=29;}
		if(nMonth == 12){
			if((nDay + DateDiff) > nDaMo[nMonth]){
				nDay = 1;
				nMonth = 1;
				nYear = nYear+1;
			}
			else{
				nDay = nDay + DateDiff;
			}
		}
		else{
			if((nDay + DateDiff) > nDaMo[nMonth]){
				nDay = 1;
				nMonth = nMonth+1;
			}
			else{
				nDay = nDay + DateDiff;
			}
		}
		
		if((nDay.toString().length)==1){nDay='0'+nDay.toString()}
		if((nMonth.toString().length)==1){nMonth='0'+nMonth.toString()}
		document.getElementById('dchkout').value = nDay+'/'+nMonth+'/'+nYear;
	}
	else{
		if(document.getElementById('dchkin') != 'dd/mm/yyyy'){
			var checkInDate = document.getElementById('dchkin').value;
			var checkOutDate = document.getElementById('dchkout').value;
			var now = new Date();
			var nDayNow = now.getDate();
			var nMonthNow = now.getMonth()+1;
			var nYearNow = now.getYear();
			
			if((nDayNow.toString().length)==1){nDayNow='0'+nDayNow.toString()}
			if((nMonthNow.toString().length)==1){nMonthNow='0'+nMonthNow.toString()}
			var strNow = nDayNow+'/'+nMonthNow+'/'+nYearNow;
			
			if (daysElapsed(checkInDate, strNow) < 0) {	
				document.getElementById('dchkout').value = 'dd/mm/yyyy';
				alert(ErrorPast);		
			}
			else if(daysElapsed(checkOutDate, checkInDate) < 1 ) {	
				document.getElementById('dchkout').value = 'dd/mm/yyyy';
				alert(ErrorLater);
			}
			else if (daysElapsed(checkOutDate, checkInDate) > 120){
				document.getElementById('dchkout').value = 'dd/mm/yyyy';
				alert(ErrorDays);
			}
			else{
				if((nDay.toString().length)==1){nDay='0'+nDay.toString()}
				if((nMonth.toString().length)==1){nMonth='0'+nMonth.toString()}
				document.getElementById('dchkout').value = nDay+'/'+nMonth+'/'+nYear;
			}
		}
		else{
			if((nDay.toString().length)==1){nDay='0'+nDay.toString()}
			if((nMonth.toString().length)==1){nMonth='0'+nMonth.toString()}
			document.getElementById('dchkout').value = nDay+'/'+nMonth+'/'+nYear;
		}
	}
}