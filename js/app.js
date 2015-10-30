var fim = {
  phpData:null,
  fimData:{},
  scenarioInfo:{},
  utils:{
    commas:d3.format("0,000")
  },
  variables:{
    horizon:50,
    techDur:20
  },
  page:{},
  getPageComponents:function(){
    this.page.homeCont=document.getElementById('home-container');
    this.page.icons=document.getElementById('scenarioIcons');
    this.page.scenarioInfo=document.getElementById('scenarioInfo');
    this.page.userInput=document.getElementById('userInput');
    this.page.treatCont=document.getElementById('treatmentInput-container');
    this.page.treatInput=document.getElementById('treatmentInputs');
    this.page.finCont=document.getElementById('financialInput-container');
    this.page.finInput=document.getElementById('financialInputs');
    this.page.graphs=document.getElementById('graphs');
    this.page.buttonCont=document.getElementById('buttons');
    this.page.submitter=document.getElementById('submitter');
    this.page.buttons=document.getElementsByClassName('showButton');
    this.page.tooltip=null;
    //this.buildTooltip();
  },
  buildTooltip:function(){
    //function that builds tooltip and tooltip components using d3
    //creates elements like so: this.page.tooltip.whatever
  },
  getScenario:function(){
    //don't change styles inline but by adding classes
    //
    // this.page.homeCont.style.display = 'none';
    // this.page.homeCont.className = 'container';
    // this.page.treatCont.style.display = 'block';
    // this.page.treatCont.className = 'container showing';
    // this.page.buttonCont.style.display = 'block';
    //
    var scenario = this.page.userInput.value;
    this.scenarioInfo.SID = scenario;
    this.ajaxScenario(scenario);
  },
  ajaxScenario:function(thisScenario){
    var that = this;
    $.ajax({
        type: "GET",
        url: "http://www.cch2o.org/FinancialModel/financial1.php?id=" + thisScenario,
        dataType: "json",
        success: function (json) {
          that.phpData = json;
          that.parseScenario(that.phpData);
          that.getScenarioInfo();
        },
        //error:
    });
  },
  parseScenario:function(data){
    // this will reformat phpData, get numbers used in calculations, and add them to a fimData object
    // to keep track-- similar to old 'buildDataJson' function
    this.scenarioInfo.embayment = data.Splits.EMBAY_DISP;
    this.scenarioInfo.subembayment = data.Splits.SUBEM_DISP;

    var townInfo = this.getTownInfo(data);
    this.fimData.splits = townInfo[0];
    this.fimData.treatments = this.getTreatments(data);
    this.fimData.counts = { InEmbay: data.Embayment, InSub: data.Subembayment, TownsAll:townInfo[1] };
    this.fimData.payers = {
      //hardcode these to beign
      townsAll:null,
      towns:{},
      watershed:null,
      state:null,
      region:null,
      federal:null
    }
  },
  getTownInfo:function(data){
    var splits = data.Splits;
    //household counts hardcoded, should be in SQL
    var percentages = [
        [splits.Barnstable, "Barnstable", 27180],
        [splits.Bourne, "Bourne",11028],
        [splits.Brewster, "Brewster",7822],
        [splits.Chatham, "Chatham",7304],
        [splits.Dennis, "Dennis",15467],
        [splits.Eastham, "Eastham",5725],
        [splits.Falmouth, "Falmouth",22039],
        [splits.Harwich, "Harwich",9915],
        [splits.Mashpee, "Mashpee",9866],
        [splits.Orleans, "Orleans",5111],
        [splits.Provincetown, "Provincetown",4300],
        [splits.Sandwich, "Sandwich",9426],
        [splits.Truro, "Truro",3249],
        [splits.Wellfleet, "Wellfleet",4606],
        [splits.Yarmouth, "Yarmouth",17448]
    ];
    for (var i = percentages.length - 1; i >= 0; i--) {
        if (percentages[i][0] == 0) {
            percentages.splice(i, 1);
        }
    }
    var t = [];
    var townSum = 0;
    for (var i = 0; i < percentages.length; i++) {
        t[i] = { town: percentages[i][1], split: percentages[i][0], households: percentages[i][2] }
        townSum += percentages[i][2];
    }
    return [t,townSum];
  },
  getTreatments:function(data){
    var treats = [];
    for (var i = 0; i < data.Treatments.length; i++) {
        var units = (data.Treatments[i].Units !== null)?data.Treatments[i].Units:data.Treatments[i].Parcels;
        var capAdj = data.Treatments[i].Costs.capAdj;
        var omAdj = data.Treatments[i].Costs.OMAdj;
        var replace = data.Treatments[i].Costs.Replace;
        treats[i] = {
            NReduction: data.Treatments[i].NReduction,
            name: data.Treatments[i].tName,
            color: treatmentStyles[data.Treatments[i].tName].color ,
            units: units,
            capAdj:capAdj,
            omAdj:omAdj,
            replace:replace
        }
    }
    this.getIcons(treats);
    return treats;
  },
  getScenarioInfo:function(){
    var embayment = this.scenarioInfo.embayment;
    var subembayment = this.scenarioInfo.subembayment;
    var id = this.scenarioInfo.SID;
    this.page.scenarioInfo.innerHTML = "<b>Scenario " + id+"</b><br>" + "Embayment: " + embayment+"<br>" + "Subembayment: " + subembayment;
  },
  getIcons:function(treatments){
    var innerDiv = document.createElement('div');
    innerDiv.setAttribute('id','innerDiv');
    this.page.icons.innerHTML = "";
    var that = this;
    for (var i=0;i<treatments.length;i++){
      var iconDiv = document.createElement('div');
      iconDiv.className = 'scenarioIcon';
      iconDiv.setAttribute('treatIndex',i);
      // load icons to github, just makes a bunch of errors for me which are annoying
      //iconDiv.style.backgrounImage = 'url(TreatIcons/' + treatmentStyles[treatments[i].tName].icon + ')';
      iconDiv.addEventListener("click", function(){
        var treatIndex = this.getAttribute('treatIndex');
        that.buildSnapshot(treatIndex);
      });
      innerDiv.appendChild(iconDiv);
    }
    if (treatments.length > 5){
      //this.buildScroll();<--function not done yet
    }
    this.page.icons.appendChild(innerDiv);
  },
  buildScroll:function(){
    var down = document.createElement('div');
    down.className = 'scroll down';
    down.addEventListener('mousedown',this.scroll.scrollDown);
    var up = document.createElement('div');
    up.className = 'scroll up';
    // up.style.display = 'none';<---do this in css or class
    up.addEventListener('mousedown',this.scroll.scrollUp);
    this.page.icons.appendChild(down);
    this.page.icons.appendChild(up);
  },
  scroll:{
    scrollDown:function(){
      // Try to do all this in vanilla
      // get code snippet from previous version
    },
    scrollUp:function(){
      // Try to do all this in vanilla
      // get code snippet from previous version
    }
  },
  buildSnapshot:function(treatIndex){
    // this function will run when an icon is clicked--
    // update the contents of the treatment/financing containers
    // to show information about the clicked icon

    // might consider coding treatment inputs in html, and just
    // changing the values of the inputs based on what's clicked.
    // in the previous code, we created all those html elements
    // and set their values, but i dont think we need to do that
    // anymore. i think it's more straightforward this way.

    console.log(this.fimData.treatments[treatIndex]);
  },
  addEvents:function(){
    var that = this;
    this.page.submitter.addEventListener("click",function(){
      that.getScenario();
    });
    this.page.userInput.addEventListener("keyup", function(evt){
      if (evt.keyCode == 13){
        that.getScenario();
      }
    })
  }
}
fim.getPageComponents();
fim.addEvents();

//----LATER------
    // $("#rightBtn").on('click', function () {
    //     var showing = $('.container.showing');
    //     var next = showing.next('.container');
    //     var following = showing.nextAll('.container').length;
    //
    //     if (next.length > 0) {
    //         next.addClass('showing').css('display','block')
    //         showing.removeClass('showing').css('display', 'none')
    //         $('#leftBtn').css('display', 'block');
    //         $('#scenarioIcons').css('display','block');
    //         $('#scenarioInfo').css('display','block');
    //     }
    //     if (following == 1) {
    //         $(this).css('display', 'none');
    //         $('#scenarioIcons').css('display','none');
    //         $('#scenarioInfo').css('display','none');
    //     }
    // })
    //
    // $("#leftBtn").on('click', function () {
    //     var showing = $('.container.showing');
    //     var prev = showing.prev('.container');
    //     var preceeding = showing.prevAll('.container').length
    //
    //     if (prev.length > 0) {
    //         prev.addClass('showing').css('display', 'block')
    //         showing.removeClass('showing').css('display', 'none')
    //         $('#rightBtn').css('display', 'block');
    //         $('#scenarioIcons').css('display','block');
    //         $('#scenarioInfo').css('display','block');
    //     }
    //     if (preceeding == 1) {
    //         $(this).css('display', 'none') ;
    //         $('#scenarioIcons').css('display','none');
    //         $('#scenarioInfo').css('display','none');
    //     }
    // })
    // ----DONE------
    // function getScenarioInfo(json,thisScenario) {
    //     var embayment = json.Splits.EMBAY_DISP;
    //     var subembayment = json.Splits.SUBEM_DISP;
    //     var div = document.getElementById('scenarioInfo');
    //     div.innerHTML = "<strong>Scenario " + thisScenario+"</strong><br>" + "Embayment: " + embayment+"<br>" + "Subembayment: " + subembayment;
    // }
    //----DONE------
    // function getIcons(treatments) {
    //     var scenarioIcons = document.getElementById('scenarioIcons');
    //     var innerDiv = document.createElement('div')
    //     innerDiv.setAttribute("id", "innerDiv");
    //
    //     scenarioIcons.innerHTML = '';
    //     for (var i = 0; i < treatments.length; i++) {
    //         var div = document.createElement('div');
    //         div.className = 'scenarioIcon';
    //         div.style.backgroundImage = 'url(TreatIcons/' + treatmentStyles[treatments[i].tName].icon + ')';
    //         div.onclick = iconClick;
    //         innerDiv.appendChild(div);
    //     }

    //     if (treatments.length > 5) {
    //         buildScroll();
    //     }
    //     scenarioIcons.appendChild(innerDiv);
    // }
    //----LAST------
    // function buildCharts(length,townnumber) {
    //     document.getElementById('graphs').innerHTML = '';
    //     var graphSVG = d3.select('#graphs').append('svg').attr('width', '350px').attr('height', '250px')
    //     chart = graphSVG.append('g').attr('width', chartW).attr('height', chartH);
    //     rectangles = chart.selectAll('.treatment').data(d3.range(length)).enter().append('rect').attr('class', 'treatment').style('stroke', 'none');
    //
    //     lineGraph = graphSVG.append('g').attr('width', chartW).attr('height', chartH).style('border', '1px solid orange')
    //         .attr('transform','translate(0,'+chartH+')');
    //     line = lineGraph.append('svg:path').attr('class', 'mainline line');
    //
    //     for (i = 0; i < townnumber; i++) {
    //         townlines[i] = lineGraph.append('svg:path').attr('class', 'townline line').style('display', 'none')
    //     }
    //
    //     affordline = lineGraph.append('svg:path').attr('class', 'affordline').style('stroke', 'red');
    //     yAxis = d3.svg.axis().orient("left").tickFormat(d3.format("s")).ticks(3);
    //     lineGraph.append('svg:g').attr('transform', 'translate(' + margins.left + ',0)').attr('class', 'yaxis')
    //
    //     T5replaceline = lineGraph.append('svg:path').attr('class', 'T5replaceline').style('stroke', 'blue');
    //     yAxis = d3.svg.axis().orient("left").tickFormat(d3.format("s")).ticks(3);
    //     lineGraph.append('svg:g').attr('transform', 'translate(' + margins.left + ',0)').attr('class', 'yaxis')
    //
    //     xAxis = d3.svg.axis().orient("top").tickFormat(d3.format("g")).ticks(6)
    //
    //     ticks = graphSVG.append('g').attr('class', 'ticks')
    //
    //     var range = d3.range(0, horizon, 5)
    //     range.shift();
    //     ticks.selectAll('.tick').data(range).enter().append('line').attr('class', 'tick').style('stroke', 'black').style('stroke-width', 0.2)
    //     ticks.append('svg:g').attr('transform', 'translate(0,' + (margins.top + chartH) + ')').attr('class', 'xaxis')
    //
    //     var graphDiv = document.getElementById('graphs');
    //     var table = document.createElement('table');
    //     table.className = 'graphTable';
    //     var row1 = table.insertRow();
    //     var title1 = row1.insertCell();
    //     title1.className = 'cellT';
    //     title1.innerHTML = "Who Pays";
    //     var value1 = row1.insertCell();
    //     value1.className = 'cellV';
    //
    //     var select = document.createElement('select');
    //     select.className = 'graphSelect';
    //     var option0 = document.createElement('option');
    //     option0.text = "Everybody";
    //     option0.value =5;
    //     select.add(option0);
    //     var option1 = document.createElement('option');
    //     option1.text = "All Towns";
    //     option1.value = 0;
    //     select.add(option1);
    //     var option3 = document.createElement('option');
    //     option3.text = "Watershed";
    //     option3.value = 1;
    //     select.add(option3);
    //     var option5 = document.createElement('option');
    //     option5.text = "Regional";
    //     option5.value = 2;
    //     select.add(option5);
    //     var option6 = document.createElement('option');
    //     option6.text = "State Grant";
    //     option6.value = 3;
    //     select.add(option6);
    //     var option7 = document.createElement('option');
    //     option7.text = "Federal Grant";
    //     option7.value = 4;
    //     select.add(option7);
    //     select.onchange =updateWhoPaysGraph;
    //     value1.appendChild(select);
    //
    //     var row2 = table.insertRow();
    //     var title2 = row2.insertCell();
    //     title2.innerHTML = "Ann. Affordability";
    //     title2.className = 'cellT';
    //     var value2 = row2.insertCell();
    //     value2.className = 'cellV';
    //     var input = document.createElement('input');
    //     input.type = "number";
    //     input.value = 1210;
    //     input.onchange = updateWhoPaysGraph;
    //     input.className = 'afford';
    //     value2.appendChild(input);
    //
    //     var row3 = table.insertRow();
    //     var title3 = row3.insertCell();
    //     title3.innerHTML = "Ann. T5 Replacement Cost";
    //     title3.className = 'cellT';
    //     var value3 = row3.insertCell();
    //     value3.className = 'cellV';
    //     var input = document.createElement('input');
    //     input.type = "number";
    //     input.value = 1250;
    //     input.onchange = updateWhoPaysGraph;
    //     input.className = 'T5';
    //     value3.appendChild(input);
    //
    //     graphDiv.appendChild(table);
    //
    // }
    //
    // function buildScroll() {
    //     var scenarioIcons = document.getElementById('scenarioIcons');
    //     var down = document.createElement('div');
    //     down.className = 'scroll down';
    //     down.onmousedown = scrollDown;
    //     scenarioIcons.appendChild(down);
    //     var up = document.createElement('div');
    //     up.className = 'scroll up';
    //     up.style.display = 'none';
    //     up.onmousedown = scrollUp;
    //     scenarioIcons.appendChild(up);
    // }
    //
    // function scrollDown() {
    //     var iconSetH = $('#scenarioIcons').height();
    //     var innerDivH = $('#innerDiv').height();
    //     var curr = parseInt($('#innerDiv').css('margin-top'));
    //     var scroll = (curr - iconSetH + 5);
    //     $('#innerDiv').animate({ marginTop: scroll + 'px' })
    //     var nextScroll = (scroll - iconSetH + 5)*(-1);
    //     if (nextScroll >= innerDivH) {
    //         $('.scroll.down').css('display', 'none');
    //     }
    //     $('.scroll.up').css('display', 'block');
    // }
    // function scrollUp() {
    //     var iconSetH = $('#scenarioIcons').height();
    //     var innerDivH = $('#innerDiv').height();
    //     var curr = parseInt($('#innerDiv').css('margin-top'));
    //     var scroll = (curr + iconSetH - 5);
    //     $('#innerDiv').animate({ marginTop: scroll+'px' })
    //     var nextScroll = (scroll + iconSetH - 5) * (-1);
    //     if (nextScroll < 0) {
    //         $('.scroll.up').css('display', 'none');
    //     }
    //     $('.scroll.down').css('display', 'block');
    // }
    //
    // function iconClick() {
    //     var index = $(this).index();
    //     $('.scenarioIcon').removeClass('active');
    //     $(this).addClass('active')
    //     document.getElementById('treatmentInputs').innerHTML = '';
    //     document.getElementById('financialInputs').innerHTML = '';
    //     var tableContents = generateInputs(index);
    //     document.getElementById('treatmentInputs').appendChild(tableContents[0]);
    //     document.getElementById('financialInputs').appendChild(tableContents[1]);
    // }

    // function simIconClick(index) {
    //     $('.scenarioIcon').removeClass('active');
    //     $('.scenarioIcon:eq('+index+')').addClass('active')
    //     document.getElementById('treatmentInputs').innerHTML = '';
    //     document.getElementById('financialInputs').innerHTML = '';
    //     var tableContents = generateInputs(index);
    //     document.getElementById('treatmentInputs').appendChild(tableContents[0]);
    //     document.getElementById('financialInputs').appendChild(tableContents[1]);
    // }
    //
    // function generateInputs(index) {
    //     var row = document.getElementsByClassName('treatRow')[index];
    //
    //     var name = $(row).children('td')[0].innerHTML;
    //     var initialCap = $(row).children('.CapCost').children('input').val();
    //     var startY = parseInt($(row).children('.Years').children('input.start').val());
    //     var endY = parseInt($(row).children('.Years').children('input.end').val());
    //     var years = [startY, endY];
    //     var monitoring = $(row).children('.Monitoring').children('input').val();
    //     var OM = $(row).children('.OMCost').children('input').val();
    //     var replacement = $(row).children('.Rep').children('input').val()//*techDur;
    //     var totalCost = $(row).children('.TotalTech').children('input').val();
    //     var financeable = $(row).children('.financeable').children('input').val();
    //     var whoPays = $(row).children('.WhoPays').children('select')[0].selectedIndex;
    //     var units = $(row).children('.units').children('input').val();
    //     var financeOpts = $(row).children('.financeOpts').children('.optionset');//.html();
    //     var finOptsList = [];
    //     for (var i =0; i<financeOpts.length;i++){
    //         var sindex = $(financeOpts[i]).children('select')[0].selectedIndex;
    //         var amt = $(financeOpts[i]).children('input').val();
    //         finOptsList.push([sindex,amt]);
    //     }
    //
    //     var items = [name, initialCap,replacement,OM,monitoring,totalCost,years,whoPays,units,financeable,finOptsList];
    //
    //     return buildSnapshot(items, index);
    // }
    //
    // function buildSnapshot(items, index) {
    //
    //     var quickTable = document.createElement('div');
    //     quickTable.className = 'quickTable row'+index;
    //
    //     var finTable  = document.createElement('div');
    //     finTable.className = 'quickTable row'+index;
    //
    //     var name = document.createElement('p');
    //     name.innerHTML = items[0];
    //     name.className = 'name';
    //     quickTable.appendChild(name);
    //
    //     var name2 = document.createElement('p');
    //     name2.innerHTML = items[0];
    //     name2.className = 'name';
    //     finTable.appendChild(name2);
    //
    //     var innerTable = document.createElement('table');
    //     innerTable.className = 'innerTable';
    //
    //     var innerTable2 = document.createElement('table');
    //     innerTable2.className = 'innerTable';
    //
    //     var head = innerTable.createTHead();
    //     var hRow = head.insertRow();
    //     var empty = hRow.insertCell(0)
    //     var totalCol = hRow.insertCell(1);
    //     totalCol.innerHTML = 'Total';
    //     var annualCol = hRow.insertCell(2);
    //     annualCol.innerHTML = 'Annual';

        // var initCapR = innerTable.insertRow();
        // var initCapT = initCapR.insertCell();
        // initCapT.className = 'cellT'
        // initCapT.innerHTML = 'Capital Cost:';
        // var initCapV = initCapR.insertCell();
        // initCapV.className = 'cellV'
        // initCapV.innerHTML = '$' + ((items[1] == 'null') ? 0 : commas(d3.round(items[1])));
        //
        // var annCapV = initCapR.insertCell();
        // annCapV.className = 'cellV'
        // annCapV.innerHTML = '$' + ((items[1] == 'null') ? 0 : commas(d3.round(items[1]/techDur)));
        //
        // var initRepR = innerTable.insertRow();
        // var initRepT = initRepR.insertCell();
        // initRepT.className = 'cellT'
        // initRepT.innerHTML = 'Replacement:';
        // var initRepV = initRepR.insertCell();
        // initRepV.className = 'cellV'
        // initRepV.innerHTML = '$' + ((items[2] == 'null') ? 0 : commas(d3.round(items[2])));
        //
        // var annRepV = initRepR.insertCell();
        // annRepV.className = 'cellV'
        // annRepV.innerHTML = '$' + ((items[2] == 'null') ? 0 : commas(d3.round(items[2]/techDur)));
        //
        // var totalOMR = innerTable.insertRow();
        // var totalOMT = totalOMR.insertCell();
        // totalOMT.className = 'cellT';
        // totalOMT.innerHTML = 'OM Cost';
        // var totalOMV = totalOMR.insertCell();
        // totalOMV.className = 'cellV';
        // totalOMV.innerHTML = '$' + ((items[3] == 'null') ? 0 : commas(d3.round(items[3])));
        //
        // var annOMV = totalOMR.insertCell();
        // annOMV.className = 'cellV';
        // annOMV.innerHTML = '$' + ((items[3] == 'null') ? 0 : commas(d3.round(items[3]/techDur)));
        //
        // var monitoringR = innerTable.insertRow();
        // var monitoringT = monitoringR.insertCell();
        // monitoringT.className = 'cellT';
        // monitoringT.innerHTML = 'Monitoring Cost/unit:';
        // var monitoringV = monitoringR.insertCell();
        // monitoringV.colSpan = '2';
        // monitoringV.className = 'cellV';
        // monitoringV.innerHTML = '$';
        // var monitoringInput = document.createElement('input');
        // monitoringInput.className = 'mon';
        // monitoringInput.value = items[4];
        // monitoringInput.type = "number";
        // monitoringInput.onchange = userChangeMonitoring;
        // monitoringV.appendChild(monitoringInput);
        //
        // var totalMonR = innerTable.insertRow();
        // var totalMonT = totalMonR.insertCell();
        // totalMonT.className = 'cellT';
        // totalMonT.innerHTML = 'Mon Cost:';
        // var totalMonV = totalMonR.insertCell();
        // totalMonV.className = 'cellV';
        // totalMonV.innerHTML = '$' + ((items[4] == 'null') ? 0 : commas(d3.round(items[4]*techDur*items[8])));
        //
        // var annMonV = totalMonR.insertCell();
        // annMonV.className = 'cellV';
        // annMonV.innerHTML = '$' + ((items[4] == 'null') ? 0 : commas(d3.round(items[4]*items[8])));
        //
        // var totalTechR = innerTable.insertRow();
        // var totalTechT = totalTechR.insertCell();
        // totalTechT.className = 'cellT';
        // totalTechT.innerHTML = 'Tech Cost:';
        // var totalTechV = totalTechR.insertCell();
        // totalTechV.className = 'cellV';
        // totalTechV.innerHTML = '$' + ((items[5] == 'null') ? 0 : commas(d3.round(items[5])));
        //
        // var annTechV = totalTechR.insertCell();
        // annTechV.className = 'cellV';
        // annTechV.innerHTML = '$' + ((items[5] == 'null') ? 0 : commas(d3.round(items[5]/techDur)));
        //
        // var yearsR = innerTable.insertRow();
        // var yearsT = yearsR.insertCell();
        // yearsT.className = 'cellT';
        // yearsT.innerHTML = 'Years Implemented:';
        // var yearsV = yearsR.insertCell();
        // yearsV.colSpan = '2';
        // yearsV.className = 'cellV';
        // var yearsInput = buildYearsSlider();
        // $(yearsInput).slider("option", "values", items[6]);
        // $(yearsInput).slider("option", "stop", userChangeSlider);
        // $(yearsInput).children(".ui-slider-handle")[0].innerHTML = items[6][0];
        // $(yearsInput).children(".ui-slider-handle")[1].innerHTML = items[6][1];
        // yearsV.appendChild(yearsInput);
        //
        // var whoPaysR = innerTable.insertRow();
        // var whoPaysT = whoPaysR.insertCell();
        // whoPaysT.className = 'cellT';
        // whoPaysT.innerHTML = 'Who Pays:';
        // var whoPaysV = whoPaysR.insertCell();
        // whoPaysV.colSpan = '2';
    //     whoPaysV.className = 'cellV';
    //     var whoPaysOptions = buildWhoPays();
    //     whoPaysOptions.selectedIndex = items[7];
    //     whoPaysOptions.onchange = userChangeWhoPays;
    //     whoPaysV.appendChild(whoPaysOptions);
    //
    //     var finCapR = innerTable2.insertRow();
    //     var finCapT = finCapR.insertCell();
    //     finCapT.className = 'cellT';
    //     finCapT.innerHTML = 'Financeable Capital';
    //     var finCapV = finCapR.insertCell();
    //     finCapV.className = 'cellV';
    //     finCapV.innerHTML = '$' + ((items[9] == 'null') ? 0 : commas(d3.round(items[9])));
    //
    //     var finOpts = items[10];
    //     var addFinButton = document.createElement('button');
    //     addFinButton.innerHTML = '+';
    //     addFinButton.onclick = addFinancingOptions;
    //
    //     createFinancingOptions(finOpts, innerTable2);
    //
    //     quickTable.appendChild(innerTable);
    //     finTable.appendChild(innerTable2);
    //     finTable.appendChild(addFinButton);
    //
    //     return [quickTable,finTable];
    // }
    //
    // function addFinancingOptions(e){
    //     var table  = $(this).parent('div').children('.innerTable')[0];
    //     var rowNum = $(this).parent('div')[0].classList[1].split('row')[1];
    //
    //     var row = $(".treatRow")[parseInt(rowNum)];
    //     var cell = $(row).children('.financeOpts')[0];
    //     var newOpts = buildFinanceOptionset();
    //     cell.appendChild(newOpts);
    //
    //     var table  = $(this).parent('div').children('.innerTable')[0];
    //
    //     var capFinR = table.insertRow();
    //     var capFinT = capFinR.insertCell();
    //     capFinT.className = 'cellT';
    //     capFinT.innerHTML = 'Capital Financing:';
    //     var capFinV = capFinR.insertCell();
    //     capFinV.className = 'cellV';
    //     var financeOptions = buildFinancing();
    //     financeOptions.onchange = userChangeFinance;
    //     capFinV.appendChild(financeOptions);
    //     var amountR = table.insertRow();
    //     var amountT = amountR.insertCell();
    //     amountT.className = 'cellT';
    //     amountT.innerHTML = 'Amount:';
    //     var amountV = amountR.insertCell();
    //     amountV.className = 'cellV';
    //     amountInput = document.createElement('input');
    //     amountInput.value = 0;
    //     amountInput.type = "number";
    //     amountInput.className = 'amount';
    //     amountInput.onchange = userChangeFinance;
    //     amountV.appendChild(amountInput);
    //
    // }
    //
    // function createFinancingOptions(finOpts, table){
    //     for (var i=0;i<finOpts.length;i++){
    //         var finOpt = finOpts[i];
    //
    //         var capFinR = table.insertRow();
    //         var capFinT = capFinR.insertCell();
    //         capFinT.className = 'cellT';
    //         capFinT.innerHTML = 'Capital Financing:';
    //         var capFinV = capFinR.insertCell();
    //         capFinV.className = 'cellV';
    //         var financeOptions = buildFinancing();
    //         financeOptions.selectedIndex = finOpt[0];
    //         financeOptions.onchange = userChangeFinance;
    //         capFinV.appendChild(financeOptions);
    //
    //         var amountR = table.insertRow();
    //         var amountT = amountR.insertCell();
    //         amountT.className = 'cellT';
    //         amountT.innerHTML = 'Amount:';
    //         var amountV = amountR.insertCell();
    //         amountV.className = 'cellV';
    //         amountInput = document.createElement('input');
    //         amountInput.value = finOpt[1];
    //         amountInput.type = "number";
    //         amountInput.className = 'amount';
    //         amountInput.onchange = userChangeFinance;
    //         amountV.appendChild(amountInput);
    //     }
    // }
    //
    // function userChangeFinance(e) {
    //     var rowIndex = parseInt($(this).closest('.quickTable')[0].classList[1].split("row")[1]);
    //     var row = document.getElementsByClassName('treatRow')[rowIndex];
    //
    //     var finSelects = $(this).closest('.quickTable').children('.innerTable').find('select');
    //     var amounts = $(this).closest('.quickTable').children('.innerTable').find('input');
    //
    //     var financeOptions = [];
    //     for (var i=0;i<amounts.length;i++){
    //         var selIndex = $(finSelects[i])[0].selectedIndex;
    //         var amt = parseFloat($(amounts[i]).val());
    //         financeOptions.push([selIndex,amt]);
    //     }
    //     var optsets = $(row).children('.financeOpts').children('.optionset');
    //     for (var i=0;i<optsets.length;i++){
    //         var set = optsets[i];
    //         var finSel = $(set).children('select')[0];
    //         finSel.selectedIndex = financeOptions[i][0];
    //         $(set).children('input').val(financeOptions[i][1]);
    //     }
    // }
    // function userChangeWhoPays(e) {
    //     var rowIndex = parseInt($(this).closest('.quickTable')[0].classList[1].split("row")[1]);
    //     var selIndex = $(this)[0].selectedIndex;
    //     var row = document.getElementsByClassName('treatRow')[rowIndex];
    //     $(row).children('.WhoPays').children('select')[0].selectedIndex = selIndex;
    //     calculateCostSplits();
    // }
    // function userChangeSlider(e, ui) {
    //     var rowIndex = parseInt($(this).closest('.quickTable')[0].classList[1].split("row")[1]);
    //     var values = ui.values;
    //     var row = document.getElementsByClassName('treatRow')[rowIndex];
    //     $(row).children('.Years').children('input.start').val(values[0]);
    //     $(row).children('.Years').children('input.end').val(values[1]);
    //     $row = $(row);
    //     updateTotalOMCost2($row, rowIndex);
    // }
    // function userChangeMonitoring(e) {
    //     var rowIndex = parseInt($(this).closest('.quickTable')[0].classList[1].split("row")[1]);
    //     var value = $(this).val();
    //     var row = document.getElementsByClassName('treatRow')[rowIndex];
    //     $(row).children('.Monitoring').children('input').val(value);
    //     $row = $(row);
    //     updateTotalOMCost2($row,rowIndex);
    // }
    //
    // function buildDataJson(json) {
    //     var splits = json.Splits;
    //     //HARDCODED HOUSEHOLD COUNTS HERE, INDEX2
    //     var percentages = [
    //         [splits.Barnstable, "Barnstable", 27180],
    //         [splits.Bourne, "Bourne",11028],
    //         [splits.Brewster, "Brewster",7822],
    //         [splits.Chatham, "Chatham",7304],
    //         [splits.Dennis, "Dennis",15467],
    //         [splits.Eastham, "Eastham",5725],
    //         [splits.Falmouth, "Falmouth",22039],
    //         [splits.Harwich, "Harwich",9915],
    //         [splits.Mashpee, "Mashpee",9866],
    //         [splits.Orleans, "Orleans",5111],
    //         [splits.Provincetown, "Provincetown",4300],
    //         [splits.Sandwich, "Sandwich",9426],
    //         [splits.Truro, "Truro",3249],
    //         [splits.Wellfleet, "Wellfleet",4606],
    //         [splits.Yarmouth, "Yarmouth",17448]
    //     ];
    //
    //     for (var i = percentages.length - 1; i >= 0; i--) {
    //         if (percentages[i][0] == 0) {
    //             percentages.splice(i, 1);
    //         }
    //     }
    //     var t = [];
    //     var townSum = 0;
    //     for (var i = 0; i < percentages.length; i++) {
    //         t[i] = { town: percentages[i][1], split: percentages[i][0], households: percentages[i][2] }
    //         townSum += percentages[i][2];
    //     }
    //
    //     var treats = [];
    //     for (var i = 0; i < json.Treatments.length; i++) {
    //         var units = (json.Treatments[i].Units !== null)?json.Treatments[i].Units:json.Treatments[i].Parcels;
    //         var capAdj = json.Treatments[i].Costs.capAdj;
    //         var omAdj = json.Treatments[i].Costs.OMAdj;
    //         var replace = json.Treatments[i].Costs.Replace;
    //         treats[i] = {
    //             NReduction: json.Treatments[i].NReduction,
    //             name: json.Treatments[i].tName,
    //             color: treatmentStyles[json.Treatments[i].tName].color ,
    //             units: units,
    //             capAdj:capAdj,
    //             omAdj:omAdj,
    //             replace:replace
    //         }
    //     }
    //
    //     data = {};
    //     data.Treatments = treats;//json.Treatments;
    //     data.Towns = t;
    //     data.Payers = Array(5);
    //     data.Counts = { InEmbay: json.Embayment, InSub: json.Subembayment, TownsAll:townSum };
    //
    //     return data;
    // }//buildDataJson
    //
    // function buildTreatmentTable(treatments) {
    //     var headers = "<tr><th>Treatment</th><th>CapCost</th><th>ReplacementCost</th><th>OMCost</th><th>Monitoring Cost per unit</th><th>TotalCost</th><th>Years</th><th>Who Pays</th><th>units</th><th>financeable</th><th>finance Opts</th></tr>"
    //     document.getElementById('mainTable').innerHTML = headers;
    //
    //     for (var i = 0; i < treatments.length; i++) {
    //         buildTreatmentRow(treatments[i]);
    //     };
    //     calculateCostSplits();
    // }//build treatment table
    //
    // function buildTreatmentRow(treatment) {
    //     var row = document.getElementById('mainTable').insertRow();
    //     row.className = 'treatRow';
    //     var name = row.insertCell(0);
    //     name.innerHTML = treatmentStyles[treatment.name].name;
    //
    //     var CapCost = row.insertCell(1);
    //     CapCost.className = "CapCost";
    //     var CapCostInput = document.createElement('input');
    //     var capVal = treatment.units*((treatment.capAdj === null)?0:treatment.capAdj);
    //     CapCostInput.setAttribute('value', capVal);
    //     CapCostInput.style.display = 'none';
    //     CapCost.appendChild(CapCostInput);
    //     var CapCostDisplay = document.createElement('span');
    //     CapCostDisplay.innerHTML = commas(d3.round(capVal, 2));
    //     CapCost.appendChild(CapCostDisplay);
    //
    //     var Replacement = row.insertCell(2);
    //     Replacement.className = 'Rep';
    //     var ReplacementInput = document.createElement('input');
    //     var repVal = treatment.units*((treatment.replace === null)?0:treatment.replace);
    //     ReplacementInput.setAttribute('value', repVal);
    //     ReplacementInput.style.display = 'none';
    //     Replacement.appendChild(ReplacementInput);
    //     var ReplacementDisplay = document.createElement('span');
    //     ReplacementDisplay.innerHTML = commas(d3.round(repVal, 2));
    //     Replacement.appendChild(ReplacementDisplay);
    //
    //     var OM = row.insertCell(3);
    //     OM.className = 'OMCost';
    //     var OMInput = document.createElement('input');
    //     var omVal = treatment.units*((treatment.omAdj === null)?0:treatment.omAdj)*techDur;
    //     OMInput.setAttribute('value', omVal);
    //     OMInput.style.display = 'none';
    //     OM.appendChild(OMInput);
    //     var OMDisplay = document.createElement('span');
    //     OMDisplay.innerHTML = commas(d3.round(omVal, 2));
    //     OM.appendChild(OMDisplay);
    //
    //     var Monitoring = row.insertCell(4);
    //     Monitoring.className = 'Monitoring';
    //     var MonitoringInput = document.createElement('input');
    //     MonitoringInput.value = 0;
    //     Monitoring.appendChild(MonitoringInput);
    //     MonitoringInput.onchange = updateTotalOMCost;
    //
    //     var TotalTechCost = row.insertCell(5);
    //     TotalTechCost.className = 'TotalTech';
    //     var TotalTechInput = document.createElement('input');
    //     TotalTechInput.style.display = 'none';
    //     TotalTechCost.appendChild(TotalTechInput);
    //     var TotalTechDisplay = document.createElement('span');
    //     TotalTechCost.appendChild(TotalTechDisplay);
    //
    //     var Years = row.insertCell(6);
    //     Years.className = 'Years';
    //     var startYInput = document.createElement('input');
    //     startYInput.className = 'start';
    //     startYInput.value = 0;
    //     startYInput.onchange = updateTotalOMCost;
    //     Years.appendChild(startYInput);
    //     var endYInput = document.createElement('input');
    //     endYInput.className = 'end';
    //     endYInput.value = techDur;
    //     endYInput.onchange = updateTotalOMCost;
    //     Years.appendChild(endYInput);
    //
    //     var WhoPays = row.insertCell(7);
    //     WhoPays.className = 'WhoPays';
    //     var whoPaysOptions = buildWhoPays();
    //     whoPaysOptions.onchange = calculateCostSplits;
    //     WhoPays.appendChild(whoPaysOptions);
    //
    //     var units = row.insertCell(8);
    //     units.className = 'units';
    //     var unitsInput = document.createElement('input');
    //     var unitsVal = treatment.units;
    //     unitsInput.setAttribute('value', unitsVal);
    //     unitsInput.style.display = 'none';
    //     units.appendChild(unitsInput);
    //     var unitsDisplay = document.createElement('span');
    //     unitsDisplay.innerHTML = commas(d3.round(unitsVal, 2));
    //     units.appendChild(unitsDisplay);
    //
    //     var financeable = row.insertCell(9);
    //     financeable.className = 'financeable';
    //     var finInput = document.createElement('input');
    //     var finVal = repVal + capVal;
    //     finInput.setAttribute('value', finVal);
    //     finInput.style.display = 'none';
    //     financeable.appendChild(finInput);
    //     var finDisplay = document.createElement('span');
    //     finDisplay.innerHTML = commas(d3.round(finVal, 2));
    //     financeable.appendChild(finDisplay);
    //
    //     var financeOpts = row.insertCell(10);
    //     financeOpts.className = 'financeOpts';
    //     var options = buildFinanceOptionset();
    //     financeOpts.appendChild(options);
    //
    //     calculateTotalTechCost(row);
    //
    // }//build treatment row
    //
    // function buildFinanceOptionset(){
    //     var div = document.createElement('div');
    //     div.className = 'optionset';
    //     var loanOption = buildFinancing();
    //     var loanAmount = document.createElement('input');
    //     loanAmount.className = 'amount';
    //     loanAmount.value = 0;
    //     loanAmount.type = "number";
    //     div.appendChild(loanOption);
    //     div.appendChild(loanAmount);
    //     return div;
    // }
    //
    // function buildFinancing(){
    //     var select = document.createElement('select');
    //     select.className = 'FinSelect';
    //     var option1 = document.createElement('option');
    //     option1.text = "SRF: 0% for 30 yrs";
    //     option1.value = 1;
    //     select.add(option1);
    //     var option2 = document.createElement('option');
    //     option2.text = "SRF: 2% for 30 yrs";
    //     option2.value = 1.02;
    //     select.add(option2);
    //     var option3 = document.createElement('option');
    //     option3.text = "USDA";
    //     option3.value = 1.05;
    //     select.add(option3);
    //     var option4 = document.createElement('option');
    //     option4.text = "Conventional Financing";
    //     option4.value = 1.05;
    //     select.add(option4);
    //     var option5 = document.createElement('option');
    //     option5.text = "No Financing";
    //     option5.value = 1;
    //     select.add(option5);
    //
    //     return select;
    //
    // }//build financing option dropdown
    //
    // function buildYearsSlider() {
    //     var range = document.createElement('div')
    //     range.className = 'slider';
    //     $(range).slider({
    //         max:horizon,
    //         min: 0,
    //         range: true,
    //         step: 1,
    //         slide: function (e, ui) {
    //             //this function prevents start and end year from being the same, enables dragging of
    //             //range when threshold is met
    //
    //             if (ui.value < ui.values[1] && ui.value <= horizon-techDur) {//left handle is pulled/pushed
    //                 var values = [ui.value, (ui.value + techDur)];
    //                 ui.values[1] = ui.value + techDur;
    //                 $(this).slider('option', 'values', values);
    //             }
    //             if (ui.value > ui.values[0] && ui.value >= techDur) {//right handle pulled/pushed
    //                 var values = [(ui.value - techDur), ui.value];
    //                 ui.values[0] = ui.value - techDur;
    //                 $(this).slider('option', 'values', values);
    //             }
    //             if (ui.values[1]-ui.values[0]<techDur){
    //                 return false;
    //             }
    //
    //             $(".ui-slider-handle")[0].innerHTML = ui.values[0];
    //             $(".ui-slider-handle")[1].innerHTML = ui.values[1];
    //         }
    //     });
    //     return range;
    // }
    //
    // function buildWhoPays(){
    //     var select = document.createElement('select');
    //     var option1 = document.createElement('option');
    //     option1.text = "Town User: Fee";
    //     option1.value = 0;
    //     select.add(option1);
    //     var option2 = document.createElement('option');
    //     option2.text = "Town User: Property Tax";
    //     option2.value = 0;
    //     select.add(option2);
    //     var option3 = document.createElement('option');
    //     option3.text = "Watershed User: Betterment";
    //     option3.value = 1;
    //     select.add(option3);
    //     var option4 = document.createElement('option');
    //     option4.text = "Watershed User: Fee";
    //     option4.value = 1;
    //     select.add(option4);
    //     var option5 = document.createElement('option');
    //     option5.text = "Regional User: Fee";
    //     option5.value = 2;
    //     select.add(option5);
    //     var option6 = document.createElement('option');
    //     option6.text = "State Grant";
    //     option6.value = 3;
    //     select.add(option6);
    //     var option7 = document.createElement('option');
    //     option7.text = "Federal Grant";
    //     option7.value = 4;
    //     select.add(option7);
    //
    //     return select;
    //
    // }//build who pays dropdown
    //
    // function buildWhoPaysTable() {
    //     document.getElementById('totalCosts').innerHTML = '';
    //     var who = [['Total Annual Cost to All Towns', 'allTowns'],
    //                 ['Total Annual Cost to Watershed', 'watershed'],
    //                 ['Total Annual Cost to Region', 'region'],
    //                 ['State Grants', 'state'],
    //                 ['Federal Grants', 'federal']];
    //
    //     for (var i = 0; i < who.length; i++) {
    //         var row = document.getElementById('totalCosts').insertRow();
    //         row.className = 'costRow';
    //
    //         var name = row.insertCell(0);
    //         name.innerHTML = who[i][0];
    //
    //         var cost = row.insertCell(1);
    //         cost.className = 'cost ' + who[i][1];
    //         var costInput = document.createElement('input');
    //         costInput.style.display = 'none';
    //         cost.appendChild(costInput);
    //         var costDisp = document.createElement('span');
    //         cost.appendChild(costDisp);
    //     }
    // }//build WhoPays table
    //
    // function buildSplitsTable(splits) {
    //     document.getElementById('townCosts').innerHTML = '';
    //     for (var i = 0; i < splits.length; i++) {
    //         buildSplitsRow(splits[i])
    //     }
    // }//build town splits table
    //
    // function buildSplitsRow(town) {
    //     var pct = town.split;
    //     var name = town.town;
    //
    //     var townTable = document.getElementById('townCosts');
    //     var row = townTable.insertRow();
    //     row.className = 'townRow';
    //     var tName = row.insertCell(0);
    //     tName.className = 'tName';
    //     tName.innerHTML = name;
    //
    //     var tPct = row.insertCell(1);
    //     tPct.className = 'townPct';
    //     var pctInput = document.createElement('input');
    //     pctInput.setAttribute('value', pct);
    //     pctInput.style.display = 'none';
    //     tPct.appendChild(pctInput);
    //     var pctDisp = document.createElement('span');
    //     pctDisp.innerHTML = parseInt(pct * 100);
    //     tPct.appendChild(pctDisp);
    //
    //     var tCost = row.insertCell(2);
    //     tCost.className = 'townValue';
    // }//build town splits rows
    //
    // function calculateTotalCapCost(row) {
    //     var InitCapCost = $(row).children('.CapCost').children('input').val();
    //     var CapFinance = $(row).children('.CapFinance').children('select').val();
    //     var TotalCapCostValue = (InitCapCost !== 'null') ? InitCapCost * CapFinance : 0;
    //     $(row).children('.TotalCapCost').children('input').val(TotalCapCostValue);
    //     $(row).children('.TotalCapCost').children('span').html(commas(d3.round(TotalCapCostValue)));
    // }//calculate total capital cost per row
    //
    // function calculateTotalOMCost(row) {
    //     var MonitoringCost = parseFloat($(row).children('.Monitoring').children('input').val());
    //     var startY = parseFloat($(row).children('.Years').children('input.start').val());
    //     var endY = parseFloat($(row).children('.Years').children('input.end').val());
    //     var Years = endY - startY;
    //     var OMCost = $(row).children('.TotalOM').children('input').attr('om');
    //     OMCost = (OMCost == 'null') ? 0 : parseFloat(OMCost);
    //     //var TotalOMCostValue = MonitoringCost + OMCost;
    //     var TotalOMCostValue = (MonitoringCost * Years) + OMCost;
    //     $(row).children('.TotalOM').children('input').val(TotalOMCostValue);
    //     $(row).children('.TotalOM').children('span').html(commas(d3.round(TotalOMCostValue)));
    // }//calculate total OM cost per row
    //
    // function calculateTotalTechCost(row) {
    //     var TotalCap = parseFloat($(row).children('.CapCost').children('input').val());
    //     var TotalOM = parseFloat($(row).children('.OMCost').children('input').val());
    //     var TotalRep = parseFloat($(row).children('.Rep').children('input').val());
    //     var TotalMon = parseFloat($(row).children('.Monitoring').children('input').val());
    //     var units = parseFloat($(row).children('.units').children('input').val());
    //     var TotalTech = TotalCap + TotalOM +TotalRep + (TotalMon*techDur*units);
    //     var TotalFin = TotalCap + TotalRep;
    //     $(row).children('.TotalTech').children('input').val(TotalTech);
    //     $(row).children('.TotalTech').children('span').html(commas(d3.round(TotalTech)));
    //     $(row).children('.financeable').children('input').val(TotalFin);
    //     $(row).children('.financeable').children('span').html(commas(d3.round(TotalFin)));
    // }//calculate total technology cost per row
    //
    // function updateTotalTechCost(row) {
    //     var TotalCap = parseFloat($(row).children('.CapCost').children('input').val());
    //     var TotalOM = parseFloat($(row).children('.OMCost').children('input').val());
    //     var TotalRep = parseFloat($(row).children('.Rep').children('input').val());
    //     var TotalMon = parseFloat($(row).children('.Monitoring').children('input').val());
    //     var units = parseFloat($(row).children('.units').children('input').val());
    //     var TotalTech = TotalCap + TotalOM +TotalRep + (TotalMon*techDur*units);
    //     var TotalFin = TotalCap + TotalRep;
    //     row.children('.TotalTech').children('input').val(TotalTech);
    //     row.children('.TotalTech').children('span').html(commas(d3.round(TotalTech)));
    //     $(row).children('.financeable').children('input').val(TotalFin);
    //     $(row).children('.financeable').children('span').html(commas(d3.round(TotalFin)));
    // }//update total technology cost for row

    // function updateTotalCapCost(e) {
    //     var row = $(this).closest('tr');
    //     var InitCapCost = row.children('.CapCost').children('input').val();
    //     var CapFinance = $(this).val();
    //     var TotalCapCostValue = (InitCapCost !== 'null') ? InitCapCost * CapFinance : 0;
    //     row.children('.TotalCapCost').children('input').val(TotalCapCostValue);
    //     row.children('.TotalCapCost').children('span').html(commas(d3.round(TotalCapCostValue)));
    //     updateTotalTechCost(row);
    //     calculateCostSplits();
    // }//update total capital cost for row
    //
    // function updateTotalCapCost2(row, index) {
    //     var InitCapCost = row.children('.CapCost').children('input').val();
    //     var CapFinance = row.children('.CapFinance').children('select').val();
    //     var TotalCapCostValue = (InitCapCost !== 'null') ? InitCapCost * CapFinance : 0;
    //     row.children('.TotalCapCost').children('input').val(TotalCapCostValue);
    //     row.children('.TotalCapCost').children('span').html(commas(d3.round(TotalCapCostValue)));
    //     updateTotalTechCost(row);
    //     calculateCostSplits();
    //     simIconClick(index);
    // }//update total capital cost for row given user input
    //
    // function updateTotalOMCost(e) {
    //     var row = $(this).closest('tr');
    //     var MonitoringCost = parseFloat(row.children('.Monitoring').children('input').val());
    //     var startY = parseFloat(row.children('.Years').children('input.start').val());
    //     var endY = parseFloat(row.children('.Years').children('input.end').val());
    //     var Years = endY - startY;//
    //     var OMCost = row.children('.OMCost').children('input').val()//.attr('om');
    //     OMCost = (OMCost == 'null') ? 0 : parseFloat(OMCost);
    //     //var TotalOMCostValue = MonitoringCost + OMCost;
    //     //var TotalOMCostValue = (MonitoringCost * Years) + OMCost;
    //     row.children('.TotalOM').children('input').val(OMCost);
    //     row.children('.TotalOM').children('span').html(commas(d3.round(OMCost)));
    //     calculateTotalTechCost(row);
    //     calculateCostSplits();
    // }//update total OM cost for row
    //
    // function updateTotalOMCost2(row,index) {
    //     var MonitoringCost = parseFloat(row.children('.Monitoring').children('input').val());
    //     var startY = parseFloat(row.children('.Years').children('input.start').val());
    //     var endY = parseFloat(row.children('.Years').children('input.end').val());
    //     var Years = endY - startY;//
    //     var OMCost = row.children('.TotalOM').children('input').attr('om');
    //     OMCost = (OMCost == 'null') ? 0 : parseFloat(OMCost);
    //     //var TotalOMCostValue = MonitoringCost + OMCost;
    //     var TotalOMCostValue = (MonitoringCost * Years) + OMCost;
    //     row.children('.TotalOM').children('input').val(TotalOMCostValue);
    //     row.children('.TotalOM').children('span').html(commas(d3.round(TotalOMCostValue)));
    //     updateTotalTechCost(row);
    //     calculateCostSplits();
    //     simIconClick(index);
    // }//update total OM cost for row given user input
    //
    // function calculateCostSplits() {
    //     var mainTable = document.getElementById('mainTable');
    //     var rows = mainTable.getElementsByClassName('treatRow');
    //     var sums = [0, 0, 0, 0, 0];
    //     for (var i = 0; i < rows.length; i++) {
    //         var row = rows[i];
    //         var totalCost = parseFloat($(row).children('.TotalTech').children('input').val());
    //         data.Treatments[i].Cost = totalCost;
    //         var whoPays = parseInt($(row).children('.WhoPays').children('select').val());
    //         sums[whoPays] += totalCost;
    //         var startY = parseFloat($(row).children('.Years').children('input.start').val());
    //         var endY = parseFloat($(row).children('.Years').children('input.end').val());
    //         data.Treatments[i].y1 = startY;
    //         data.Treatments[i].y2 = endY;
    //         data.Treatments[i].WhoPays = whoPays;
    //     }
    //     var costTable = document.getElementById('totalCosts');
    //     var costRows = costTable.getElementsByClassName('costRow');
    //     for (var i = 0; i < costRows.length; i++) {
    //         var thisCost = costRows[i];
    //         $(thisCost).children('.cost').children('span').html(commas(d3.round(sums[i], 2)));
    //         $(thisCost).children('.cost').children('input').val(sums[i]);
    //
    //         data.Payers[i] = {
    //             Payer: $(thisCost).children('.cost')[0].classList[1],
    //             Cost: sums[i]
    //         };
    //     }
    //     calculateTownSplits();
    //
    //     updateCharts(data);
    //
    // }//calculate who pays cost splits
    //
    // function updateWhoPaysGraph() {
    //
    //     var index = $('#graphs').find('select').val();
    //     var affordabilityvalue = $('#graphs').find('input.afford').val();
    //     var T5replacevalue = $('#graphs').find('input.T5').val();
    //
    //     var affordsegments = new Array(horizon + 1);
    //     for (var i = 0; i < affordsegments.length; i++) {
    //         affordsegments[i] = affordabilityvalue;
    //     }
    //
    //     var T5replacesegments = new Array(horizon + 1);
    //     for (var i = 0; i < T5replacesegments.length; i++) {
    //         T5replacesegments[i] = T5replacevalue;
    //     }
    //
    //     var timeSegments = [new Array(horizon + 1), new Array(horizon + 1), new Array(horizon + 1), new Array(horizon + 1), new Array(horizon + 1), new Array(horizon + 1)];
        //
        // for (var i = 0; i < timeSegments.length; i++) {
        //     for (var b = 0; b < timeSegments[i].length; b++) {
        //         timeSegments[i][b] = 0;
        //     };
        // };
        // for (var i = 0; i < data.Treatments.length; i++) {
        //     var ds = data.Treatments[i];
        //     var totalY = ds.y2 - ds.y1;
        //     var yrCost = ds.Cost / totalY;
        //    // console.log(ds);
        //     var whoPays = ds.WhoPays;
        //
        //     for (var y = ds.y1; y < ds.y2 + 1; y++) {
        //         timeSegments[whoPays][y] += yrCost;
        //         timeSegments[5][y] += yrCost;
        //     }
        // }
        //
        // var amongWhom = (index == 0) ? data.Counts.TownsAll : (index == 1) ? data.Counts.InEmbay.TotalParcelsInEmbayment : 1;
        //
        // var segMax = d3.max(timeSegments[index]) / amongWhom
        // var range = [d3.min(timeSegments[index]) / amongWhom, d3.max([segMax, affordabilityvalue, T5replacevalue]) * 1.25];
        //
        // var x = d3.scale.linear().range([margins.left, chartW - margins.right]).domain([0, horizon])
        // var y = d3.scale.linear().range([chartH - margins.top, margins.bottom]).domain(range)
        // var chartx = d3.scale.linear().domain([margins.left, chartW - margins.right]).range([0, horizon])
        //
        // var lineFx = d3.svg.line()
        //     .x(function (d, i) { return x(i) })
        //     .y(function (d) { return y(d/amongWhom) })
        //     .interpolate('linear');
        //
        // var affordlineFx = d3.svg.line()
        //     .x(function (d, i) { return x(i) })
        //     .y(function (d) { return y(d) })
        //     .interpolate('linear');
        //
        // var T5replacelineFx = d3.svg.line()
        //     .x(function (d, i) { return x(i) })
        //     .y(function (d) { return y(d) })
        //     .interpolate('linear');
        //
        // ticks.select(".xaxis")
        //     .call(xAxis.scale(x));
        //
        // ticks.selectAll('.tick').attr('x1', function (d) { return x(d) }).attr('x2', function (d) { return x(d) })
        // .attr('y1', margins.top).attr('y2',(250-(margins.top)))
        //
        // line.data(timeSegments[index])
      //       .transition().duration(200).ease('linear')
      //       .attr('d', lineFx(timeSegments[index])).attr('hh', amongWhom)
      //       .style('stroke', 'black').style('fill', 'none')
       //
      //   if (index == 0) {
      //       d3.selectAll(".townline").style('display', 'block')
      //       d3.selectAll(".mainline").style('display', 'none')
      //       var maxHH = data.Towns.sort(function (a, b) { return b.households - a.households })[0].households;
      //       var segMax = d3.max(timeSegments[index]) / maxHH;
      //       var range = [d3.min(timeSegments[index]) / amongWhom, d3.max([segMax, affordabilityvalue, T5replacevalue]) * 1.25];
       //
      //       y.domain(range);
       //
      //       for (var i = 0; i < townlines.length; i++) {
      //           var percent = data.Towns[i].split;
      //           var amongWhom = data.Towns[i].households;
      //           var Town = data.Towns[i].town;
      //           lineFx.y(function (d) { return y(d * percent/amongWhom) })
       //
      //           townlines[i].data(timeSegments[0])
      //           .transition().duration(200).ease('linear')
      //           .attr('d', lineFx(timeSegments[0])).attr('split',percent).attr('hh',amongWhom).attr('who',Town)
      //           .style('stroke', 'black').style('fill', 'none')
      //       }
      //   } else {
      //       d3.selectAll(".townline").style('display','none')
      //       d3.selectAll(".mainline").style('display','block')
      //   }
       //
      //   affordline
      //       .transition().duration(200).ease('linear')
      //       .attr('d', affordlineFx(affordsegments))
       //
      //   T5replaceline
      //           .transition().duration(200).ease('linear')
      //           .attr('d', T5replacelineFx(T5replacesegments))
       //
      //       lineGraph.select(".yaxis")
      //       .call(yAxis.scale(y));
       //
      //       d3.selectAll(".line").on('mouseover', hover).on('mousemove', hover).on('mouseout', unhover)
       //
      //  function hover(d) {
      //      var toolL = (d3.event.offsetX > 350 / 2) ? 'auto' : (d3.event.offsetX + 10) + 'px';
      //      var toolR = (d3.event.offsetX > 350 / 2) ? (350 - (d3.event.offsetX)) + 'px' : 'auto';
      //      var toolT = (d3.event.offsetY > 300 / 2) ? 'auto' : (d3.event.offsetY + 10) + 'px';
      //      var toolB = (d3.event.offsetY > 300 / 2) ? (300 - (d3.event.offsetY)) + 'px' : 'auto';
      //      tooltip.style('top', toolT).style('bottom', toolB).style('left', toolL).style('right', toolR).style('visibility', 'visible');
      //       var cx = d3.round(chartx(d3.event.offsetX), 0);
      //       d3.selectAll(".line").style('opacity', 0.2)
      //       d3.select(this).style('opacity',1)
      //       if (index == 0) {
    //             var who = d3.select(this).attr('who');
    //             var split = d3.select(this).attr('split');
    //             var hh = d3.select(this).attr('hh');
    //             var value = timeSegments[index][cx] * split / hh;
    //         }
    //         else {
    //             var hh = d3.select(this).attr('hh');
    //             var value = timeSegments[index][cx] / hh;
    //             var who = "";
    //         }
    //         toolText.text(who + ' year ' + cx + ': $' + commas(d3.round(value, 0)));
    //         toolIcon.style('display', 'none');
    //    }
    //
    //    function unhover() {
    //        tooltip.style('visibility', 'hidden');
    //        d3.selectAll(".line").style('opacity', 1)
    //    }
    //
    // }
    //
    // function calculateTownSplits() {
    //     var townRows = document.getElementsByClassName('townRow');
    //     var townCostCell = document.getElementsByClassName('allTowns')[0];
    //     var townsCost = parseFloat($(townCostCell).children('input').val());
    //     for (var i = 0; i < townRows.length; i++) {
    //         var townRow = townRows[i];
    //         var name = $(townRow).children('.tName').html();
    //         var pct = parseFloat($(townRow).children('.townPct').children('input').val());
    //         var split = townsCost * pct;
    //         $(townRow).children('.townValue').html(commas(d3.round(split, 2)));
    //         data.Towns[i].Cost = split;
    //     }
    // }//calculate town splits values
    //
    // //////----chart init
    // var chartW = 350, chartH = 125;
    // var chart;
    // var margins = { top: 25, bottom: 25, left: 50, right: 50 }
    // var rectangles, lineGraph, line, yAxis, xAxis, townlines = [], affordline, ticks, T5replaceline;
    //
    // function updateCharts(data) {
    //    // console.log(data);
    //     rectangles.data(data.Treatments).attr('height', function () {
    //         return (chartH-margins.top) / data.Treatments.length *0.8;
    //     })
    //     .attr('width', function (d) {
    //         var width = (d.y2 - d.y1) / horizon * (chartW-margins.left-margins.right);
    //         return width
    //     })
    //     .attr('transform', function (d,i) {
    //         var y = ((chartH - margins.top) / data.Treatments.length * i) + margins.top;
    //         var x = d.y1 / horizon * (chartW - margins.left - margins.right)+margins.left;
    //         return 'translate(' + x + ',' + y + ')';
    //     })
    //     .style('fill', function (d) { return d.color })
    //
    //     rectangles.on('mouseover', recthover).on('mouseout', rectunhover).on('mousemove', recthover)
    //
    //     function rectunhover(d) {
    //         tooltip.style('visibility', 'hidden');
    //         d3.selectAll(".treatment").style("opacity", 1)
    //     }
    //
    //     function recthover(d) {
    //         toolIcon.attr('src', 'TreatIcons/' + treatmentStyles[d.name].icon).style('display','block')
    //         var toolL = (d3.event.offsetX > 350 / 2) ? 'auto' : (d3.event.offsetX + 10) + 'px';
    //         var toolR = (d3.event.offsetX > 350 / 2) ? (350 - (d3.event.offsetX)) + 'px' : 'auto';
    //         var toolT = (d3.event.offsetY > 300 / 2) ? 'auto' : (d3.event.offsetY + 10) + 'px';
    //         var toolB = (d3.event.offsetY > 300 / 2) ? (300 - (d3.event.offsetY)) + 'px' : 'auto';
    //         tooltip.style('top', toolT).style('bottom', toolB).style('left', toolL).style('right', toolR).style('visibility', 'visible');
    //         toolText.text(treatmentStyles[d.name].name);
    //     }
    //
    //
    //     updateWhoPaysGraph();
    // }


// });//doc on ready
