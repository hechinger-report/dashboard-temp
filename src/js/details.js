import $ from 'jquery';
import * as d3 from 'd3';

import './furniture';

import grad from './grad';
import retention from './retention';
import demographics from './demographics';
import aid from './aid';
import price from './sticker-price';
import priceEmbed from './sticker-price-embed';

let data;
let selectedPriceYear;
let livingArr;
let residency;

let selectedNetPrice;

let searchBoxData;

let selectedIncomeYear,totalNumFamilies, numFamilies030K, numFamilies3048K, numFamilies4875K, numFamilies75110K, numFamilies110K, avgTuition030K, avgTuition3048K, avgTuition4875K, avgTuition75110K, avgTuition110K;

const addCommas = d3.format(',');
// Find page URL
const pageUrl = window.location;

let pageUnitid = pageUrl.href.split('=')[1];

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

if (getCookie('income')) {

} else {
  setCookie('income', '1', 1)
}

if (pageUnitid) {
  $.getJSON(`./data/school-data-09042019/${pageUnitid}.json`, (data) => {
  // SIDEBAR SCHOOL INFO
  var site = "http://" + data.website;

  selectedIncomeYear = 0;
    let pctFamilies030K,
      pctFamilies3048K,
      pctFamilies4875K,
      pctFamilies75110K,
      pctFamilies110K;
    const incomeObj = data.yearly_data[selectedIncomeYear];

      if (incomeObj.avg_net_price_0_30000_titleiv_privateforprofit === 0 || incomeObj.avg_net_price_0_30000_titleiv_privateforprofit === 'NAN' || incomeObj.avg_net_price_0_30000_titleiv_privateforprofit === null){
        avgTuition030K = 'N/A';
      } else {
        avgTuition030K = '$' + addCommas(Math.round(incomeObj.avg_net_price_0_30000_titleiv_privateforprofit,0));
      }

      if (incomeObj.avg_net_price_30001_48000_titleiv_privateforprofit === 0 || incomeObj.avg_net_price_30001_48000_titleiv_privateforprofit === 'NAN' || incomeObj.avg_net_price_30001_48000_titleiv_privateforprofit === null){
        avgTuition3048K = 'N/A';
      } else {
        avgTuition3048K = '$' + addCommas(Math.round(incomeObj.avg_net_price_30001_48000_titleiv_privateforprofit,0));
      }

      if (incomeObj.avg_net_price_48001_75000_titleiv_privateforprofit === 0 || incomeObj.avg_net_price_48001_75000_titleiv_privateforprofit === 'NAN' || incomeObj.avg_net_price_48001_75000_titleiv_privateforprofit === null){
        avgTuition4875K = 'N/A';
      } else {
        avgTuition4875K = '$' + addCommas(Math.round(incomeObj.avg_net_price_48001_75000_titleiv_privateforprofit,0));
      }

      if (incomeObj.avg_net_price_75001_110000_titleiv_privateforprofit === 0 || incomeObj.avg_net_price_75001_110000_titleiv_privateforprofit === 'NAN' || incomeObj.avg_net_price_75001_110000_titleiv_privateforprofit === null){
        avgTuition75110K = 'N/A';
      } else {
        avgTuition75110K = '$' + addCommas(Math.round(incomeObj.avg_net_price_75001_110000_titleiv_privateforprofit,2));
      }

      if (incomeObj.avg_net_price_110001_titleiv_privateforprofit === 0 || incomeObj.avg_net_price_110001_titleiv_privateforprofit === 'NAN' || incomeObj.avg_net_price_110001_titleiv_privateforprofit === null){
        avgTuition110K = 'N/A';
      } else {
        avgTuition110K = '$' + addCommas(Math.round(incomeObj.avg_net_price_110001_titleiv_privateforprofit,2));
      }

       numFamilies030K = incomeObj.number_income_privateforprofit_0_30000;
       numFamilies3048K = incomeObj.number_income_privateforprofit_30001_48000;
       numFamilies4875K = incomeObj.number_income_privateforprofit_48001_75000;
       numFamilies75110K = incomeObj.number_income_privateforprofit_75001_100000;
       numFamilies110K = incomeObj.number_income_privateforprofit_110001;

       totalNumFamilies = numFamilies030K + numFamilies3048K + numFamilies4875K + numFamilies75110K + numFamilies110K;
       numFamilies030K = +incomeObj.number_income_privateforprofit_0_30000 || '0';
       numFamilies3048K = +incomeObj.number_income_privateforprofit_30001_48000 || '0';
       numFamilies4875K = +incomeObj.number_income_privateforprofit_48001_75000 || '0';
       numFamilies75110K = +incomeObj.number_income_privateforprofit_75001_100000 || '0';
       numFamilies110K = +incomeObj.number_income_privateforprofit_110001 || '0';



    const pctFamilies = numFamilies030K + numFamilies3048K + numFamilies4875K + numFamilies75110K + numFamilies110K;
    if (totalNumFamilies && totalNumFamilies > 0) {
      pctFamilies030K = Math.round((numFamilies030K/totalNumFamilies)*100) + '%';
      pctFamilies3048K = Math.round((numFamilies3048K/totalNumFamilies)*100) + '%';
      pctFamilies4875K = Math.round((numFamilies4875K/totalNumFamilies)*100) + '%';
      pctFamilies75110K = Math.round((numFamilies75110K/totalNumFamilies)*100) + '%';
      pctFamilies110K = Math.round((numFamilies110K/totalNumFamilies)*100) + '%';
    } else {
      pctFamilies030K = 'N/A';
      pctFamilies3048K = 'N/A';
      pctFamilies4875K = 'N/A';
      pctFamilies75110K = 'N/A';
      pctFamilies110K = 'N/A';
    }

    if (getCookie('income') === '1') {
      $('#calculated-net-price').text(avgTuition030K);
      $('#net-number').html(numFamilies030K);
      $('#bracket').html('$0&ndash;$30,000');

    } else if (getCookie('income') === '2') {
      $('#calculated-net-price').text(avgTuition3048K);
      $('#net-number').html(numFamilies3048K);
      $('#bracket').html('$30,000&ndash;$48,000');

    } else if (getCookie('income') === '3') {
      $('#calculated-net-price').text(avgTuition4875K);
      $('#net-number').html(numFamilies4875K);
      $('#bracket').html('$48,000&ndash;$75,000');

    } else if (getCookie('income') === '4') {
      $('#calculated-net-price').text(avgTuition75110K);
      $('#net-number').html(numFamilies75110K);
      $('#bracket').html('$75,000&ndash;$110,000');

    } else if (getCookie('income') === '5') {
      $('#calculated-net-price').text(avgTuition110K);
      $('#net-number').html(numFamilies110K);
      $('#bracket').html('$110,000 and above');
    }

    $('#net-school').html(data.institution);

    const returnedNetPrice = $('#calculated-net-price').text();

    if (returnedNetPrice === 'N/A' || returnedNetPrice === 'NaN'){
      $('#calculated-net-price').text('No data')
    }



  $('#stats-url a, #mobile-stats-url a').attr("href", site);

  if (data.control === 1){
    $('#stats-type, #mobile-stats-type span').html("public");
  } else if (data.control === 2){
      $('#stats-type, #mobile-stats-type span').html("private");
    } else {
      $('#stats-type, #mobile-stats-type span').html("for-profit");
    }

  if (data.level < 4){
      $('#stats-degree span strong, #mobile-stats-degree span strong').html("4");
    } else {
      $('#stats-degree span strong, #mobile-stats-degree span strong').html("2");
    }

  if (data.hbcu === 1){
    $('#stats-hbcu, #mobile-stats-hbcu').show();
    } else {
      $('#stats-hbcu, #mobile-stats-hbcu').hide();
    }

    if (data.tribal_college === 1){
      $('#stats-tribal, #mobile-stats-tribal').show();
      } else {
        $('#stats-tribal, #mobile-stats-tribal').hide();
      }

  if (data.enrollment.perc_admitted === null || data.enrollment.perc_admitted == 1){
    $('#stats-acc-rate span, #mobile-stats-acc-rate span').html('N/A');
    } else {
      $('#stats-acc-rate span, #mobile-stats-acc-rate span').html(data.enrollment.perc_admitted+'%');
  }

  if (data.enrollment.perc_sticker === null || data.enrollment.perc_sticker == 1){
    $('#stats-sticker span, #mobile-stats-sticker span').html('N/A');
    } else {
      $('#stats-acc-sticker span, #mobile-stats-sticker span').html(data.enrollment.perc_sticker+'%');
  }

  $('.city-state-label').html(data.city + ', ' + (data.abbreviation || ''));

  $('.school-name').html(data.institution);

  $(window).on('scroll', ()=>{
    if (window.pageYOffset > 88) {
      $('#school-name-nav-bar').addClass("fixed")
      // $('.school-details-categories').addClass("fixed")
      $('.locator-map').addClass("fixed")
    } else {
      $('#school-name-nav-bar').removeClass("fixed")
      // $('.school-details-categories').removeClass("fixed")
      $('.locator-map').removeClass("fixed")
    }
  })
  var twitterLink = "https://twitter.com/intent/tweet?text=How much will " + data.institution + " actually cost in 2020? Find out with Tuition Tracker&url=http://tuitiontracker.org/school.html?unitid=" + pageUnitid; 
  $('#twitter-link').attr("href", twitterLink);
  var facebookLink = "https://www.facebook.com/sharer/sharer.php?u=http://tuitiontracker.org/school.html?unitid=" + pageUnitid;
  $('#facebook-link').attr("href", facebookLink);

  // STICKER PRICE
  let priceStickerHeadline = price.findData(data, 1);
  let stickerPrice;

  if (priceStickerHeadline[10].stickerPrice === null || priceStickerHeadline[10].stickerPrice === 0) {
    stickerPrice = `$${addCommas(Math.round(data.yearly_data[0].price_instate_offcampus_nofamily))}`;
    $('#sticker-living').text('off campus without family');
  } else {
      if (priceStickerHeadline[10].stickerPriceType === "price_instate_offcampus_nofamily") {
      stickerPrice = `$${addCommas(Math.round(priceStickerHeadline[10].stickerPrice))}`;
      $('#sticker-living').text('off campus without family');
      } else {
      stickerPrice = `$${addCommas(Math.round(priceStickerHeadline[10].stickerPrice))}`;
      $('#sticker-living').text('on campus');
      $('#sticker-living-fine').text(', on-campus room and board');
    }
  }


  $('#sticker-price').html(stickerPrice);

  $('#sticker-school').html(data.institution);

  $('#who-pays').html(`${100 - data.yearly_data[2].perc_first_time_full_time_undergrad_other_grant_aid}`);

  const returnedStickerValue = $('#sticker-price').text();

  if (returnedStickerValue === '$0' || returnedStickerValue === '$NaN'){
    $('#sticker-price').text('No data')
  }


  // DEMOGRAPHICS

  // Fill and build gender bars

  const malePct = Math.round((data.enrollment.total_men/data.enrollment.total_enrollment)*100);

  const femalePct = Math.round((data.enrollment.total_women/data.enrollment.total_enrollment)*100);


  $('#gender-pct-female').attr('data-pct',femalePct);
  $('#gender-pct-male').attr('data-pct',malePct);

  $("#gender-pct-female").css('width',femalePct+'%');
  $("#gender-pct-male").css('width',malePct+'%');

  const genderBarMale = parseInt($("#gender-pct-male").attr("data-pct"));
  const genderBarFemale = parseInt($("#gender-pct-female").attr("data-pct"));

  if (genderBarMale < 5){
    $("#gender-pct-male").addClass("small-num");
  } else if (genderBarFemale < 5){
    $("#gender-pct-female").addClass("small-num");
  }
  if (genderBarMale > 96){
    $("#gender-pct-male").addClass("high-pct");
    $("#gender-pct-female").removeClass("small-num"); 
    $("#gender-pct-female").addClass("no-num"); 
  }
  // Fill in enrollment by race bars

  $('.enrollment-stat span').html(addCommas(data.enrollment.total_enrollment));




  // Build enrollment bar chart - race breakdown

    // $(".race-bar, .grad-bar").each(function() {
    //   const pct = $(this).attr("data-pct");
    //   $(this).css('width',pct+'%');
    // });

    // $(".bar-data").each(function() {
    //   const left = $(this).attr("data-left");
    //   $(this).css('left',left+'%');
    //   $(this).html(left+"%")
    // });

  // $('.embed-code').click(function(){
  //   $('.embed-code').addClass('markup')
  //   $('#embed-code').text(`<iframe style="overflow:hidden;height:375px;width:420px" height="375" width="420" scrolling="no" src="https://www.tuitiontracker.org/embed.html?unitid=${pageUnitid}"></iframe>`);
  // })

  // NET PRICE

  // Family income sortable chart

  // let selectedIncomeYear,totalNumFamilies, numFamilies030K, numFamilies3048K, numFamilies4875K, numFamilies75110K, numFamilies110K, avgTuition030K, avgTuition3048K, avgTuition4875K, avgTuition75110K, avgTuition110K;

  $('#choose-year-family-income').change(function() {
    
    


    $("tbody").html(`<tr><td data-label='income' class='income'>$0-$30,000</td><td data-label='net-price' class='net-price'>${avgTuition030K}</td><td data-label='num-students' class='num-students'>${numFamilies030K}</td></tr>

    <tr><td data-label='income' class='income'>$30,0001-$48,000</td><td data-label='net-price' class='net-price'>${avgTuition3048K}</td><td data-label='num-students' class='num-students'>${numFamilies3048K}</td></tr>

    <tr><td data-label='income' class='income'>$48,0001-$75,000</td><td data-label='net-price' class='net-price'>${avgTuition4875K}</td><td data-label='num-students' class='num-students'>${numFamilies4875K}</td></tr>

    <tr><td data-label='income' class='income'>$75,0001-$110,000</td><td data-label='net-price' class='net-price'>${avgTuition75110K}</td><td data-label='num-students' class='num-students'>${numFamilies75110K}</td></tr>

    <tr><td data-label='income' class='income'>$110,000+</td><td data-label='net-price' class='net-price'>${avgTuition110K}</td><td data-label='num-families' class='num-students'>${numFamilies110K}</td></tr>`);

  });

  // Select 2015-16 data onload
  $('#choose-year-family-income option:selected').val('0').trigger('change');

  // Family income picker

  $('#choose-family-income-bracket').change(function() {

    selectedNetPrice = parseInt($('#choose-family-income-bracket option:selected').val());
    const pctFamilies = numFamilies030K + numFamilies3048K + numFamilies4875K + numFamilies75110K + numFamilies110K;

    const pctFamilies030K = Math.round((numFamilies030K/totalNumFamilies)*100);
    const pctFamilies3048K = Math.round((numFamilies3048K/totalNumFamilies)*100);
    const pctFamilies4875K = Math.round((numFamilies4875K/totalNumFamilies)*100);
    const pctFamilies75110K = Math.round((numFamilies75110K/totalNumFamilies)*100);
    const pctFamilies110K = Math.round((numFamilies110K/totalNumFamilies)*100);

    if (selectedNetPrice === 1) {
      $('#calculated-net-price').text(avgTuition030K);
      $('#net-number').html(numFamilies030K);
      $('#bracket').html('$0&ndash;$30,000');

    } else if (selectedNetPrice === 2) {
      $('#calculated-net-price').text(avgTuition3048K);
      $('#net-number').html(numFamilies3048K);
      $('#bracket').html('$30,000&ndash;$48,000');

    } else if (selectedNetPrice === 3) {
      $('#calculated-net-price').text(avgTuition4875K);
      $('#net-number').html(numFamilies4875K);
      $('#bracket').html('$48,000&ndash;$75,000');

    } else if (selectedNetPrice === 4) {
      $('#calculated-net-price').text(avgTuition75110K);
      $('#net-number').html(numFamilies75110K);
      $('#bracket').html('$75,000&ndash;$110,000');

    } else if (selectedNetPrice === 5) {
      $('#calculated-net-price').text(avgTuition110K);
      $('#net-number').html(numFamilies110K);
      $('#bracket').html('$110,000 and above');
    }

    $('#net-school').html(data.institution);

    const returnedNetPrice = $('#calculated-net-price').text();

    if (returnedNetPrice === 'N/A' || returnedNetPrice === 'NaN'){
      $('#calculated-net-price').text('No data')
    }

  });

   $('#price-bracket').change(function() {

    selectedNetPrice = parseInt($('#price-bracket option:selected').val());
    const pctFamilies = numFamilies030K + numFamilies3048K + numFamilies4875K + numFamilies75110K + numFamilies110K;

    const pctFamilies030K = Math.round((numFamilies030K/totalNumFamilies)*100);
    const pctFamilies3048K = Math.round((numFamilies3048K/totalNumFamilies)*100);
    const pctFamilies4875K = Math.round((numFamilies4875K/totalNumFamilies)*100);
    const pctFamilies75110K = Math.round((numFamilies75110K/totalNumFamilies)*100);
    const pctFamilies110K = Math.round((numFamilies110K/totalNumFamilies)*100);


    if (selectedNetPrice === 2) {
      // $('#calculated-net-price').text(avgTuition3048K);
      // $('#net-number').html(numFamilies3048K);
      // $('#bracket').html('$30,000&ndash;$48,000');

    } else if (selectedNetPrice === 3) {
      // $('#calculated-net-price').text(avgTuition4875K);
      // $('#net-number').html(numFamilies4875K);
      // $('#bracket').html('$48,000&ndash;$75,000');

    } else if (selectedNetPrice === 4) {
      // $('#calculated-net-price').text(avgTuition75110K);
      // $('#net-number').html(numFamilies75110K);
      // $('#bracket').html('$75,000&ndash;$110,000');

    } else if (selectedNetPrice === 5) {
      // $('#calculated-net-price').text(avgTuition110K);
      // $('#net-number').html(numFamilies110K);
      // $('#bracket').html('$110,000 and above');
    }

    $('#net-school').html(data.institution);

    const returnedNetPrice = $('.calculated-net-price span').text();

    if (returnedNetPrice === '$0' || returnedNetPrice === '$NaN'){
      $('.calculated-net-price span').text('No data')
    }

  });

    // Select $0-$30K income bracket data onload
    // $('#choose-family-income-bracket option:selected').val('1').trigger('change');


    $('#family-income-table').hide();

    $('.show-table').click(function(){

      const thisTable = $(this);
      $('#family-income-table').slideToggle('slow', function() {
          if ($(this).is(':visible')) {
               $('#show-hide').text('hide');
               // $('#table-arrow').text('&uarr;');
          } else {
               $('#show-hide').text('show');
               // $('#table-arrow').text('&darr;');
          }
      });
    });


  // AUTOCOMPLETE
    const submitIcon = $('.searchbox-icon');
    const closeIcon = $('#results-close');
    const inputBox = $('.searchbox-input');
    const searchBox = $('.searchbox');
    let isOpen = false;

    $('#tracker-pullout').on('click', function() {
      $('#tracker-pullout-container').removeClass('disappear')
      if ($('.searchbox').hasClass('searchbox-open')) {
        //
      }

      searchBox.removeClass('searchbox-open');
      inputBox.focusout();
      isOpen = false;
      $('.searchbox-icon').css('display','inline-block');
      $('.new-searchbox-icon').hide();
      $('#tracker-pullout-container').toggleClass('slide-in') 
      $(this).toggleClass('tracker-open') 
    })

    closeIcon.click(function(){
        if(isOpen == true){
          $('#tracker-pullout-container').toggleClass('disappear')
            searchBox.removeClass('searchbox-open');
            inputBox.focusout();
            isOpen = false;
            $('.searchbox-icon').css('display','inline-block');
            $('.new-searchbox-icon').hide();
        } else {
            searchBox.addClass('searchbox-open');
            inputBox.focus();
            isOpen = true;
            $('.new-searchbox-icon').show();
        }
    });
    submitIcon.click(function(){
        if(isOpen == false){
          $('#tracker-pullout-container').toggleClass('disappear')
            if ($('#tracker-pullout-container').hasClass('slide-in')) {
              $('#tracker-pullout-container').toggleClass('slide-in') 
              $(this).toggleClass('tracker-open') 
            }
            searchBox.addClass('searchbox-open');
            inputBox.focus();
            isOpen = true;
            $(this).css('display','none');
            $('.new-searchbox-icon').show();
        } else {
            searchBox.removeClass('searchbox-open');
            inputBox.focusout();
            isOpen = false;
            $('.new-searchbox-icon').hide();
        }
    });

  // DRAW CHARTS

  /* FINANCIAL AID */

  let aidRadio = 'aid_amt';
  let aidDatafile = aid.findData(data, aidRadio);
    aid.runData(aidDatafile, aidRadio);

    $(".switch-field input[name='switch-btn-aid']").click(function() {
      aidRadio = this.value;
      aidDatafile = aid.findData(data, aidRadio);
      $('#aid-chart').empty();
      aid.runData(aidDatafile, aidRadio);
    });


    /* PRICE */



    let priceDatafile = price.findData(data, 1);
      price.runData(priceDatafile);
      priceEmbed.runData(priceDatafile);

    $('#choose-family-income-bracket').change(function() {
      let selectedVal = parseInt(this.value, 10);
      let selectedBracket = $('#choose-family-income-bracket option:selected').text();
      let priceDatafile = price.findData(data, selectedVal);
      $('#sticker-price-chart').empty();
      $('#sticker-price-chart-embed').empty();
      price.runData(priceDatafile);
      priceEmbed.runData(priceDatafile);
      $('#price-bracket').val(this.value)
    });

    $('#price-bracket').change(function() {
      let selectedVal = parseInt(this.value, 10);
      let selectedBracket = $('#price-bracket option:selected').text();
      let priceDatafile = price.findData(data, selectedVal);
      $('#sticker-price-chart').empty();
      $('#sticker-price-chart-embed').empty();
      price.runData(priceDatafile);
      priceEmbed.runData(priceDatafile);
      $('#choose-family-income-bracket').val(this.value)
    });

    /* GRADUATION */
    $(window).on('scroll', function() {
        if(window.pageYOffset > document.getElementById("grad-rates-container").offsetTop - 400) {
            let gradDatafile = grad.findData(data);
            grad.runData(gradDatafile);
        }
        if(window.pageYOffset > document.getElementById("retention-rates-container").offsetTop - 500) {
            let retentionDatafile = retention.findData(data);
            retention.runData(retentionDatafile);
        }
        if(window.pageYOffset > document.getElementById("demographics-container").offsetTop - 600) {
            let demographicsDatafile = data.enrollment;
            demographics.runData(demographicsDatafile);
        }

    });

    /* RETENTION */

    // let retentionDatafile = retention.findData(data);
    //   retention.runData(retentionDatafile);


  // LOCATOR MAPS

    const latitude = data.lat;
    const longitude = data.lon;

    const schoolMarker = {
      lat: latitude,
      lng: longitude
    };

    const map = new google.maps.Map(
        document.getElementById('locator-map'), {
          zoom: 10,
          center: schoolMarker,
          mapTypeId: google.maps.MapTypeId.ROAD,
          disableDefaultUI: true,
          scrollwheel: false,
          styles: [
              {"featureType":"water","elementType":"geometry","stylers":[{"color":"#c9d9de"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#e6e6e6"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#d4d4d4"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#d4e2d4"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
        });

    
  }); // end getJSON
}

$('#add-school').click(()=>{
  let schoolCookies = getCookie('schools');
  let thisSchool = window.location.href.split("=")[1];

  let cookies; 

  if (schoolCookies.length > 1) {
    cookies = schoolCookies.split(",");
  } else {
    cookies = [];
  }

  if (cookies.indexOf(thisSchool) === -1) cookies.push(thisSchool);

  cookies.join(',')

  setCookie('schools', cookies, 1)

})

$('#choose-family-income-bracket-topnav').change(function() {
  setCookie('income', $(this).val(), 1);
  window.location.reload();
});
// QUICK FACTS EXPANDER

$('.expander-trigger').click(function(){
  $(this).toggleClass("expander-hidden");
});

$('.how-we-know-close').click(function(){
  $('.how-we-know-text').removeClass("how-we-know-visible");
});
$('.how-we-know').click(function(){
  $('.how-we-know-text').addClass("how-we-know-visible");
})
