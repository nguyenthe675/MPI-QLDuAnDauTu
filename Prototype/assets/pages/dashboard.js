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
                ['Dự án đang thực hiện', 430],
                ['Dự án kết thúc đầu tư, bàn giao đưa vào sử dụng trong kỳ', 22],
                ['Dự án bị thu hồi trong kỳ', 0],
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
                ['Đúng tiến độ', 388],
                ['Chậm tiến độ', 42],
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
                ['Dự án sử dụng vốn nhà nước', 310],
                ['Dự án đầu tư theo hình thức PPP', 110],
                ['Dự án sử dụng nguồn vốn khác', 32],
            ],
            type: 'pie'
        },
        legend: {
            show: true
        },
        color: {
            pattern: ['#536dfe', '#11c15b','#ff5252']
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                    value = value + '/452';
                    return value;
                }
            }
        },
    });
    var tynguonvonchart = c3.generate({
        bindto: '#tynguonvonchart',
        data: {
            // iris data from R
            columns: [
                ['Vốn đầu tư công', 180],
                ['Vốn nhà nước ngoài vốn đầu tư công', 220],
                ['Vốn khai trong nước', 150],
                ['Vốn khai nước ngoài', 140],
                ['Vốn chủ sở hữu', 150]
            ],
            type: 'pie'
        },
        legend: {
            show: true
        },
        color: {
            pattern: ['#FFBF00', '#9966CC', '#007FFF','#C41E3A','#007BA7']
        },
        tooltip: {
            format: {
                title: function (d) { var thang = d+1; return 'Tổng vốn 840 tỷ đồng.'; },
                value: function (value, ratio, id) {
                    value = value + " tỷ đồng";
                    return value;
                }
            }
        },
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
                ['Vốn đầu tư công', 30, 20, 45, 34, 26, 35,43, 42, 35, 44, 36, 45],
                ['Vốn nhà nước ngoài vốn đầu tư công', 20, 13, 9, 24, 13, 22,20, 13, 9, 24, 13, 22],
                ['Vốn khai trong nước',30, 20, 16, 40, 25, 25,30, 20, 16, 40, 25, 20],
                ['Vốn khai nước ngoài', 13, 12, 10, 14, 16, 15,13, 12, 15, 14, 16, 15],
                ['Vốn chủ sở hữu',13, 12, 5, 14, 16, 15,13, 12, 10, 14, 8, 15],
            ],
            type: 'bar',
            types: {
                'Nguồn lao động': 'spline',
            },
            groups: [
                ['Vốn đầu tư công','Vốn nhà nước ngoài vốn đầu tư công','Vốn khai trong nước','Vốn khai nước ngoài','Vốn chủ sở hữu']
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
