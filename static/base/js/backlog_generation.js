
// 获取到这个DOM节点，然后初始化

var myChart = echarts.init(document.getElementById("box"));

// option 里面的内容基本涵盖你要画的图表的所有内容
// 定义样式和数据
data=[]
var option = {
      dataZoom: [
        {   // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 0,      // 左边在 10% 的位置。
            end: 100         // 右边在 60% 的位置。
        }
    ],
    // 给echarts图设置背景色
    backgroundColor: '#FBFBFB',
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['预计剩余工时', '实际剩余工时']
    },

    calculable: true,


    xAxis: [{
        type: 'category',
        // boundaryGap: false,
        axisLabel: {
                rotate: 90,
                interval: 0
            },

        boundaryGap: false,

        data: function() {
            var list = [];
            for (var i = 1; i <= 31; i++) {
                if (i <= 31) {
                    list.push('2018-12-'+i);
                } else {
                    list.push('2019-1-1');
                }
            }
            return list;
            }()
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [{
            name: '预计剩余工时',
            type: 'line',
            data:data,
            color: ['#66AEDE']
        }, {
            name: '实际剩余工时',
            type: 'line',
            data:data,
            color: ['#90EC7D'],
        }]
    };


// 一定不要忘了这个，具体是干啥的我忘了，官网是这样写的使用刚指定的配置项和数据显示图表。
myChart.setOption(option);

