'use strict';
$(document).ready(function () {
    dashboard();

    /*Counter Js Starts*/
    $('.counter').counterUp({
        delay: 10,
        time: 400
    });
    var projectChart = c3.generate({
        bindto: '#project-chart',
        data: {
            // iris data from R
            columns: [
                ['Dự án đang thực hiện', 20],
                ['Dự án kết thúc đầu tư, bàn giao đưa vào sử dụng trong kỳ', 50],
                ['Dự án bị thu hồi trong kỳ', 20],
            ],
            type: 'pie'
        },
        legend: {
            show: true
        },
        color: {
            pattern: ['#536dfe', '#f0ad4e','#ff5252']
        }
    });
    var statusChart = c3.generate({
        bindto: '#status-chart',
        data: {
            // iris data from R
            columns: [
                ['Số lượng dự án đúng tiến độ', 74],
                ['Số lượng dự án chậm tiến độ', 16],
            ],
            type: 'pie'
        },
        legend: {
            show: true
        },
        color: {
            pattern: [ '#11c15b','#ff5252']
        }
    });
    var loaiduanchart = c3.generate({
        bindto: '#loaiduanchart',
        data: {
            // iris data from R
            columns: [
                ['Dự án sử dụng vốn nhà nước', 5],
                ['Dự án đầu tư theo hình thức PPP', 2],
                ['Dự án sử dụng nguồn vốn khác', 3],
            ],
            type: 'pie'
        },
        legend: {
            show: true
        },
        color: {
            pattern: ['#536dfe', '#11c15b','#ff5252']
        }
    });
    var tynguonvonchart = c3.generate({
        bindto: '#tynguonvonchart',
        data: {
            // iris data from R
            columns: [
                ['Vốn ngân sách', 180],
                ['Vốn ODA', 220],
                ['Vốn trái phiếu chính phủ', 150],
                ['Vốn nhà nước ngoài vốn đầu tư công', 140],
                ['Vốn chủ sở hữu', 150],
                ['Vốn vay', 80],
                ['Vốn khác', 100],
            ],
            type: 'pie'
        },
        legend: {
            show: true
        },
        color: {
            pattern: ['#FFBF00', '#9966CC', '#7FFFD4','#007FFF','#CC5500','#C41E3A','#007BA7']
        }
    });
    var chart = c3.generate({
        bindto: '#chart3',
        data: {
            // iris data from R
            columns: [
                ['1', 12],
                ['2', 7],
                ['3', 7],
                ['4', 29],
                ['5', 22],
                ['6', 28],
                ['7', 21],
                ['8', 21],
                ['9', 33],
                ['10', 22],
                ['11', 11],
                ['12', 31]
            ],
            type: 'pie'
        },
        legend: {
            show: true
        },
        color: {
            pattern: ['#FFBF00', '#9966CC', '#7FFFD4','#007FFF','#CC5500','#C41E3A','#007BA7','#50C878','#DF73FF','#4B0082','#00A86B','#FFFF00']
        }
    });
    var chart2 = c3.generate({
        bindto: '#tiendogiaingan',
        size: {
            height: 440,
        },
        data: {
            x: 'x',
            columns: [
                ['x', 'Tháng 1', 'Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'],
                ['Vốn ngân sách', 30, 20, 50, 40, 60, 50,30, 20, 50, 40, 60, 50],
                ['Vốn ODA', 200, 130, 90, 240, 130, 220,200, 130, 90, 240, 130, 220],
                ['Vốn trái phiếu chính phủ',300, 200, 160, 400, 250, 250,300, 200, 160, 400, 250, 250],
                ['Vốn nhà nước ngoài Vốn đầu tư công', 130, 120, 150, 140, 160, 150,130, 120, 150, 140, 160, 150],
                ['Vốn chủ sở hữu',130, 120, 150, 140, 160, 150,130, 120, 150, 140, 160, 150],
                ['Vốn vay',130, 120, 150, 140, 160, 150,130, 120, 150, 140, 160, 150],
                ['Vốn khác', 130, 120, 150, 140, 160, 150,130, 120, 150, 140, 160, 150],
            ],
            type: 'bar',
            types: {
                'Nguồn lao động': 'spline',
            },
            groups: [
                ['Vốn ngân sách','Vốn ODA','Vốn trái phiếu chính phủ','Vốn nhà nước ngoài Vốn đầu tư công','Vốn chủ sở hữu','Vốn vay','Vốn khác']
            ],
            
        },
        tooltip: {
            format: {
                title: function (d) { var thang = d+1; return 'Tháng ' + thang; },
                value: function (value, ratio, id) {
                    value = value + " tỷ đồng";
                    return value;
                }
            }
        },
        axis : {
            x : {
                type : 'category',
                
            }
        }
        
    });
    // Area Chart ends
    //  Resource bar
    $(".resource-barchart").sparkline([5, 6, 2, 4, 9, 1, 2, 8, 3, 6, 4, 2, 1, 5], {
        type: 'bar',
        barWidth: '15px',
        height: '80px',
        barColor: '#fff',
        tooltipClassname: 'abc'
    });




    function setHeight() {
        var $window = $(window);
        var windowHeight = $(window).height();
        if ($window.width() >= 320) {
            $('.user-list').parent().parent().css('min-height', windowHeight);
            $('.chat-window-inner-content').css('max-height', windowHeight);
            $('.user-list').parent().parent().css('right', -300);
        }
    };
    setHeight();

    $(window).on('load', function () {
        setHeight();
    });
});

$(window).resize(function () {
    dashboard();
    //  Resource bar
    $(".resource-barchart").sparkline([5, 6, 2, 4, 9, 1, 2, 8, 3, 6, 4, 2, 1, 5], {
        type: 'bar',
        barWidth: '15px',
        height: '80px',
        barColor: '#fff',
        tooltipClassname: 'abc'
    });
});

function dashboard() {

    $('.tree-2').treegrid({
        expanderExpandedClass: 'icofont icofont-minus',
        expanderCollapsedClass: 'icofont icofont-plus'
    });
    $('.tree').treegrid();



};
