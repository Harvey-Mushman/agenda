<template>
  <div class="helloBody">
    <h2>{{ msg }}</h2>
	<p>
	This application was developed to help neighborhood councils manage and simplify the creation of Agenda's and recordation of Minutes. It is available to be used freely but if credit is to be given for its development, please reference James Murez, Venice, CA 90291.
	</p>
	<h2>Overview</h2>
	<p>	This browser based App is sometimes called a Single Page Application, suggesting that once loaded into local memory round trips to the online server are unnecessary.  The system is pre-designed to host templates that are used to format the output Agenda/Minutes.  This saves the user time tweaking tedious formatting attributes while insuring a consistent looking final production.
	</p>
	<p>	The App is also flexible in the sense that content entered by the user is completely editable at any stage along the creation and publication process.  The editor that is built into the editable templates offers many of the most comment features such as Bold, Italics, numbered lists and more.
	</p>
	<p>	All content is stored on the local machine in JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write.  This data format allows user the ability to import and export data from prior or future agendas or minutes in whole or in part.  With this flexibility, the App can import data directly from the online Venice Neighborhood Council, Agenda Request system or from the LA City Planning Department, Early Notification CNC Report publication.
	</p>
	<p>	The configuration and default data is stored online in the cloud so changes to Membership or Committee Participation can only be changed by an Administrator who has access to the online system.  The Introduction and Footer agenda items both fall into this category requiring Administrator access to modify them.  
	</p>
	<p>	Finely for you techie type nerds the application is written entirely in JavaScript (EMAS 2016) within the Vue.JS 3 framework.  Further reading is available at vue-cli documentation.
	</p>
	<h1 style="text-align:center; width:100vw">Getting Started</h1>
	<h2>Setup Meeting</h2>
	<ol>
		<li>From the home page click on "Setup Meeting". This is the first step to creating a new agenda.</li>
		<li>The class of the meeting appears at the top of the agenda, the default is General Meeting but if the meeting is only a presentation or a Special 24 Hour noticed meeting, select the correct button.</li>
		<li>Select the name of the committee.</li>
		<li>If scheduling a Joint committee meeting select one or more committees that it will be joined. (Tip: To multi-select, hold control key while selecting two or more committees.)</li>
		<li>Enter the meeting date and start time, click on calendar icon for popup dialog or enter text directly.</li>
		<li>The locationwhere the meeting will be conducted needs to be entered. This is done by clicking on the area to teh right of hte heading "Location". A editor menu will be displayed and a text area will become highlighted with a border. Now enter the meeting location, if it is a ZOOM online webinar, paste the link information.</li>
		<li>Finely click out of the location border if not already done. Now click on Save botton. This will downloadsa a configuration file to the local machine that contains all of hte header content for the agenda. Click on Home button to return to the next step. Note: any of the above steps can be modified while still on this page but once departing to home page, any changes in the header will require recreating the download file.</li>
	</ol>
	<h2>Create Agenda</h2>
	<p>	This selection is used to create the agenda. The items included on the agenda are added from predefined templates that each are associated to a presentation format. On the option menu at the top of the page the left two controls include an Add button and a drop down selection list. The selection list includes the format templates. Once a format is selected, pressing the Add button appends the template to the current agenda. 
	</p>
	<p>	All of the templates have an Item Number field, a Title field and near the right-hand margin an entry field for minutes.
	</p>
	<blockquote>
		Item Number: This field is use to order the agenda items in the publication.  An item number may be a decimal which allows        the system to resort the order of the items placing one item between other items with ease.  Example items numbered 1,2, 3 can easy be rearranged 1, 1.5, 2, moving item 3 to fall between 1 and 2 merely by renumbering it 1.5.
	</blockquote>
	<blockquote>
		Item Title: this field will always be bold and restricts the length of an item to the length of the page therby preventing long hard to read titles.
	</blockquote>
	<blockquote>
		Minutes: This entry field is use to estimate the time required to address the item from start to finish.  Every item has on the agenda has a time allotment and when the minutes are started the approximant ending time is displayed.  As items are concluded the clock time stamps each item and updated the total elapse ending time.
	</blockquote>
	<p>	The Sort button is used to reorder the items based on the Item numbers.  The resorting can occur as many times as needed.  At present there is not a renumber feature but being considered for future revisions.
	</p>
	<p>	The Import Items button offers one of he most powerful features of the system, it allows items to be imported into the active agenda, meaning if a prior agenda or minutes report included an item that needs to be carried forward to the current agenda, just import the desired file and delete any unwanted items.  This import function also allows Agenda Request items that have previously imported using the Import Agenda Request routine first to be entered here.  This is also true for CNC Report items, once the CSV file is imported using the Import CNC Report routing, the generated file can then be accessed to pull in the Land Use cases.
	</p>
	<p>	Finely the Save button, always press this button before returning to the home page or exiting the system.  The save files are very small even for the longest agendas so file space will never be a problem.
	</p>
	<h2>Format Templates</h2>
	<p>	All of the templates when in the Create Agenda include a Trash Can icon on the top right corner of the item.  Clicking on this button will remove the template and all of it data from the agenda.  Once clicked there is no redo or undo process.
	</p>
	<ol>
		<li><b>Introduction Heading:</b> This template is preconfigured with the meeting rules. The text can only be modified by the system administrator. The template should always be the top most item on the agenda.</li>
		<li><b>Call to Order:</b> This template opens the meeting. It is normally the second item on an agenda. It is not a mandatory template if the agenda does not include any action items (AKA Motions).</li>
		<li><b>Roll Call:</b> This template is used to to track attendance of members that are assigned to the Board or a Committee. The member names listed are imported from the system defaults that are preconfigured by the system administrator. This template must be present for any items that involve action (Motion). The checking off a member which indicates they are present, allows them to Make, Second and vote on action items.</li>
		<p>When a member is checked in the system records the arrival time and when the check is unchecked the system again times stamps the member keeping track of all entries and departures from the meeting.  Note: A member must be checked in to vote when the “Call for Vote” button is pressed in the Recordation of Minutes process, more on this later.</P>
		<li><b>Section Heading:</b> This template is used to define sections of the agenda. For example, the Consent Calendar is a section that is followed by one or more items that will all be passed as a group.</li>
		<li><b>Title/Description:</b> This template is used to append an item that is for information, typically a presentation that does not include the body taking any action on the information being presented.</li>
		<li><b>Title/Description/Motion:</b> This template is used for all action items except for items of Land Use. The template allows for one text area to describe the item and a separate text area for a Motion. As defined in Robert's Rules, there is a Maker and Second drop down list that reflects the Roll Call members that are shown in attendance. Both the Description and Motion text areas allow unlimited length writings and when the field is selected, a popup menu will be displayed that allows the user to Bold, Italicize, Highlight and apply other functionally to the entry.</li>
		<p>	The <b>"Call for Vote"</b> button when clicked displays a voting matrix of Members in attendance each with an associated drop down list of the five voting option (Yea/Nay/Abstain/Recuse/Ineligible) (Note: Ease of use feature, press the first letter (Y/N/A/R/I) of the voting choice to select an option and the Tab key to jump to the next Member in the voter roll call list.)</p>
		<p>The Call for Vote button populates the Voter Roll Call list when pressed and also exposes a Refresh Voters button. This button when clicked will update the list of voters if any Members arrived to the meeting after the initial Call for Vote button was pressed, so long as they are checked in on the Roll Call in template three above.</p>
		<p>The <b>"Alternate Motion"</b> button allows the system to track and maintain voter tallies on one or more revisions to the original motion. If a member was not present for the primary vote, they cannot vote in an alternate motion unless the Refresh Voter is selected on the primary motion.  A Copy Motion button is available that is used to copy the original motion into the text area of the alternate motion.</p>
		<li><b>LUPC Case/Motion:</b> All of the instructions for Title/Description/Motions above in template six above apply here. Additionally, the nature of Land Use cases has several special requirements that need to be formatted correctly on the agenda. Much of the opening data of these items is imported from the Planning Department, Early Notification CNC Report. There is an intermediate step to import this data described below. Because all of the possible information to track on a Land Use case might not apply to the project being added to the agenda, there is a checkbox to the right of the "LUPC" title that is used to expose or hide empty fields. (Note: Blank fields will not be presented on printed agendas no matter what the setting of the checkbox.)</li>
		<p>Supporting Documents, this section label has two icons below the label, one to Add and one to Subtract document listings. Each listing is expected to title the URL to the document. The URL should be fully qualified meaning it should look something like this "https://domain_name/file_path/filename".</p>
		<li><b>Closing Footer:</b> This is the meeting adjourned message, such as a hard stop time. The approximate meeting end time which is exposed on this template and is based on when the meeting was Called to Order and by adding the remaining incomplete item duration minutes.</li>
	</ol>
	<h2>Agenda Preview</h2>
	<p>	This option is used to print the Agenda. Whatever device is selected on the hosing computer will be used and assumes Portable Document Format (PDF) driver option is available for saving the final output to a file that needs to be on the VNC website Calendar and emailed to NCSupport@LACity.org.
	</p>
	<p>	Functionally the desired Agenda to print must first be loaded into view. The file will have been saved during the Create Agenda step above. The name of the file will be "Agenda_(dateStamp).json". Once loaded all of the agenda controls (buttons and data entry fields) will be hidden from view. Using the browsers built in Print function the Agenda can now be properly printed
	</p>
	<h2>Record Minutes</h2>

	<p>	The Agenda Load button is pressed to open and expose the desired Agenda. with a couple of exception, the system operates very similar to Create Agenda. The exceptions that do not exist here include options like being able to Delete and item.
	</p>
	<p>	Keeping track of the "Approximate Ending" time feature which is a calculated value, is updated based on two actions occurring. The start of an Agenda Item is registered by clicking the Clock icon in the upper right hand corner of each agenda item.  The clock which defaults in dark gray when the page is loaded will turn to Green after the first press.  At the end of the item the Green clock is pressed again at which time it will turn Red and the clock time will be recorded. For the estimated ending time to be kept accurate, all items must clock out as they are completed.  Any item can be reconsidered by re-clicking a Red clock back to Green thereby restarting the timer on the item.  
	</p>
	<p>	All of the time stamps are recorded in the final minutes file. Additionally, each time a clock is activated to Red, a copy of the Minutes are recorded into a time stamped file so should the power fail, no more than one items information will be lost.
	</p>
	<p>	Rearranging the order of Agenda Items is possible by changing the Item Number. Note, decimal values can be used for item numbers so 14.25 when the agenda is Sorted will come before 14.5 and after 14.1.
	</p>
	<p>	Always SAVE, this is a very important step to create a permenant record of the Minutes. Once the meeting is adjourned be sure to SAVE. Pressing the Print button will open the computer print dialog and will hide all of the system buttons from view. In some cases the hidden buttons will be replaced with time stamps when actions occured such as when a Call for Vote occurred. The printed file should be stored in PDF and uploaded to the VNC website.
	</p>
	<p>	The saved file which will be named "Minutes_(datestamp).json" contains all the final data used to generate the minutes of the meeting. When committees pass motions that must then be forwarded to the Administration Committee (AdCom), by forwarding this file to the Secretary, he/she can import the items into the AdCom Agenda without having to re-enter any information.
	</p>
	<h2>Import Agenda Requests</h2>  
	<p>	The VNC website backend portal allows users with access rights to control a feature to list and export Agenda Request items. The output from this feature is a JSON file that can be imported into this system. The items to import are controlled by selecting checkboxes on the webpage. 
	</p>
	<h2>Import Early Notifications (CNC Report)</h2>
	<p>	The LA City Planning Department publishes a report every two weeks that describes all new planning applications across the city.  By subscribing to the email publication the City sends out two versions of the report, a PDF (Portable Document Format) version and a CSV (Comma Separated Value) version which can be imported into a spreadsheet or this application.
	</p>
	<p>	To import a CNC report, the CSV file must be stored on the local machine.  Once the Import CNC Report feature is open, click on the Open CNC File button and select the CSV tile that was received by email and stored locally.  Then click Open and a dropdown list will appear on the screen.  This dropdown list includes all of the Neighborhood Councils that have new planning cases in the CSV file.  Select the NC of Choice and a list of cases will be presented.
	</p>
	<p>	Each case listing includes the street address and the Planning Department Case Number.  In addition, in the left most column of each row there is a checkbox that allow the row to be included (if checked) or ignored  (if not checked) when the importation occurs.  Press the Save button to complete the process followed by pressing the Home button.
	</p>
	<h2>Membership</h2>
	<p>	The system defaults including committee and board membership and member profiles are maintained and configured within this routine. The saved file is names "_default_dateStamp.json" and must be copied to the system server for any changes to take effect. Contact the system administrator for assistance with this feature.
	</p>
</div>


</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.helloBody{
	margin:25px;
}
.helloBody h3 {
  margin: 10px 0 0;
}
.helloBody ol{
    list-style-type:decimal !important;
}
.helloBody li {
  display:list-item;
  margin: 15px 10px 3px 40px;
}
.helloBody a {
  color: #42b983;
}
.helloBody p{
	margin:10px 0 10px 0;
}
.helloBody ol p{
	margin-left:40px !important;
}
</style>
