/*
* Contains all JS for the app
*/
var app = app || {};

app.datePickerOptions = {
	showOn: "both",
  	buttonImage: "images/Calender.png",
  	buttonImageOnly: true,
  	buttonText: "Click for Calender"
};
app.singleselectOptions = {
	width: 180,
	single: true,
	filter: true
};
app.multiselectOptions = {
	width: 180,
	selectAll: true
};

app.maxRowsMessage = "You have reached the maximum number of rows allowed for this field.";
app.rowCannotBeDeleted = "This row cannot be deleted.";

$(document).ready(function() {

	//To initialise datepicker, single select & multi select globally
	//EXCLUDING repeatable table, section
	$(".datepickerGlobal" ).datepicker(app.datePickerOptions);
    $(".singleselectGlobal").multipleSelect(app.singleselectOptions);
    $(".multiselectGlobal").multipleSelect(app.multiselectOptions);
	    
	app.updateAddDisabled = function(id, num) {
		if(num == 1) {
			//this is the first row
			$(id+'_btnDel_'+num).attr('disabled', true);
		} /*else {
			$(id+'_btnAdd_'+(num-1)).attr('disabled', true);
			$(id+'_btnDel_'+(num-1)).attr('disabled', true);

			$(id+'_btnDel_'+num).attr('disabled', false);
			$(id+'_btnAdd_'+num).attr('disabled', false);
		}*/
	};
	app.updateDelDisabled = function(id, num) {
		$(id+'_btnAdd_'+num).attr('disabled', false);
		if(num !== 1) {
			$(id+'_btnDel_'+num).attr('disabled', false);                		
		} else {
			$(id+'_btnDel_'+num).attr('disabled', true);
		}
	};

	app.btnAddClicked = function(gridName, maxRows) {
		var tableIdWithHash = ($.type(gridName)=="string") ? "#"+gridName : "#"+gridName.id;
		var tableId = ($.type(gridName)=="string") ? gridName : gridName.id;
		var num = $(tableIdWithHash).find("tr").length;
		        
        var newElem = $(tableIdWithHash+'_templateRow').clone(true)
        				.attr('id', tableId+'_row_' + num);

        try {
        	maxRows = parseInt(maxRows);
        } catch(e) {
        	maxRows = 10;
        }
        if (num == (maxRows+1)) {
        	alert(app.maxRowsMessage);
        	return false;	
        }
        
        newElem.find("[id]").each(function() {
        	this.id = this.id.substr(0, this.id.lastIndexOf('_'));
			this.id += "_"+num;
		});
        
        newElem.find("[name]").each(function() {
            this.name = this.name.substr(0, this.name.lastIndexOf('_'));
            this.name += "_"+num;
        });

        $(tableIdWithHash).append(newElem);
         
    	app.updateAddDisabled(tableIdWithHash,num);
        
        //to remove the hidden style of the template row
        $(newElem).removeAttr('style');
        $(newElem).find(".novalidate").removeClass("novalidate");

        $(newElem).find(".datepicker").datepicker(app.datePickerOptions);
        $(newElem).find("select.singleselect").multipleSelect(app.singleselectOptions);
        $(newElem).find("select.multiselect").multipleSelect(app.multiselectOptions);
	};

	$("table").on('click', '.btnDel', function(event) {

    	var event = event ? event : window.event;
    	var el = (event.target != null) ? event.target : event.srcElement;
    	var thisRowId = $(el).parent().parent().attr('id');
		var thisRowNumber = thisRowId.substr(thisRowId.lastIndexOf("_")+1);
		thisRowNumber = parseInt(thisRowNumber);

		var minRows = $(el).parent().parent().parent().attr('data-minRows');
		//console.log(minRows);
		if(minRows == null) {
			minRows = 1;
		} else {
			try {
				minRows = parseInt(minRows);
			} catch(e) {
				minRows = 1;
			}
		}

		var tableId = thisRowId.substr(0, thisRowId.indexOf("_row"));
		var tableIdWithHash = "#"+tableId;
		var num = $(tableIdWithHash).find("tr").length - 1;
		if(num <= minRows) {
			alert(app.rowCannotBeDeleted);
			return;
		}

		$(tableIdWithHash+'_row_' + thisRowNumber).remove();
		//app.updateDelDisabled(tableIdWithHash, num - 1);

		for(var iCnt=thisRowNumber; iCnt<num; iCnt++) {
			var prevRow = $(tableIdWithHash+"_row_"+iCnt);
			var thisRow = $(tableIdWithHash+"_row_"+(iCnt+1));
			
			if(thisRow != null) {
				$(thisRow).attr('id', $(thisRow).attr('id').substr(0, $(thisRow).attr('id').lastIndexOf('_')));
				$(thisRow).attr('id', $(thisRow).attr('id')+"_"+iCnt);

				thisRow.find("[id]").each(function() {
					this.id = this.id.substr(0, this.id.lastIndexOf('_'));
					this.id += "_"+iCnt;
				});
				thisRow.find("[name]").each(function() {
					this.name = this.name.substr(0, this.name.lastIndexOf('_'));
					this.name += "_"+iCnt;
				});
			}
		}
	});
});