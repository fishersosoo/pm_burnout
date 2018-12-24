var $task_table = $("#task_table");

function bool_formatter(value, row, index) {
    if (value)
        return "是";
    else
        return "否";
}


var myChart = echarts.init(document.getElementById("chart"));

function setChart(data_idea, date_real) {

// 获取到这个DOM节点，然后初始化


// option 里面的内容基本涵盖你要画的图表的所有内容
// 定义样式和数据
    var option = {

        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        title: {text: "燃尽图"},
        dataZoom: [
            {   // 这个dataZoom组件，也控制x轴。
                top: 20,
                right: 200,
                type: 'inside', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                start: 0,      // 左边在 10% 的位置。
                end: 100         // 右边在 60% 的位置。
            },
            {   // 这个dataZoom组件，默认控制x轴。
                top: 20,
                right: 200,
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
                rotate: 45,
                interval: 0
            },
            offset: 0,
            boundaryGap: false,

            data: function () {
                var list = [];
                for (var i = 1; i <= 31; i++) {
                    if (i <= 31) {
                        list.push('2018-12-' + i);
                    } else {
                        list.push('2019-1-1');
                    }
                }
                list.push('2019-1-1');
                return list;
            }()
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [{
            name: '预计剩余工时',
            type: 'line',
            data: data_idea,
            color: ['#66AEDE']
        }, {
            name: '实际剩余工时',
            type: 'line',
            data: date_real,
            color: ['#90EC7D'],
        }]
    };
    myChart.setOption(option);
}

function loadChart() {
    $.get("/chart_data/",
        {"sprint_id": getQueryString("id"),},
        function (data) {
            // data=JSON.parse(data)
            setChart(data["ideal"], data["real"])
        }
    )
}

function submit_formatter(value, row, index) {
    if (row["person"] != current_user || row["done"])
        return "";
    return [
        '<form class="form-horizontal">',
        '<div class="form-group"  style="margin-bottom: 0px;">',
        '<div class="col-md-3">',
        '<input type="text" class="form-control" id="input_' + row['_id'] + '" placeholder=工时>',
        '</div>',
        '<div class="form-group"  style="margin-bottom: 0px;">',
        '<div class="col-md-2">',
        '<button type="button" name="submit_btn" id="btn_' + row['_id'] + '" class="btn btn-success">提交</button>',
        '</div>',
        '</div>',
        '</div>',
        '</form>'

    ].join("");
}

loadChart()

function bind_btn(data) {

    $("[name='submit_btn']").click(function () {
        btn_id = $(this).attr("id");
        id = btn_id.split('_')[1];
        input_id = "input_" + id;
        input = document.getElementById(input_id).value

        console.log(input)
        if (parseInt($task_table.bootstrapTable('getRowByUniqueId', id)["remain_hour"]) < parseInt(input)) {
            flash("danger", "提交工时不得大于剩余工时", "错误")
            return
        }
        $.post(
            "/commit_hour/",
            {
                "sprint_id": getQueryString("id"),
                'task_id': id,
                'hours': input
            },
            function (data) {
                $task_table.bootstrapTable('refresh', true);
                loadChart();
            }
        )
    })
}

$task_table.bootstrapTable({
    onRefresh: loadChart,
    onLoadSuccess: bind_btn,
    url: "/tasks/",
    method: 'GET',
    contentType: "",
    queryParams: function (params) {
        params["sprint_id"] = getQueryString("id")
        return params;
    },
    uniqueId: "_id",
    idField: '_id',
    pageSize: 20,
    rowStyle: function (row, index) {
        if (row["done"])
            return {classes: 'success'};
        return "";
    },
    // sortName: "fid",
    columns: [
        {field: "_id", title: "id", align: 'center', searchable: false, 'visible': false},
        {field: "task_name", title: "任务名称", sortable: true, searchable: true, align: 'center'},
        {field: "content", title: "任务内容", searchable: true, align: 'left'},
        {field: "hour", title: "工作量", sortable: true, searchable: false, align: 'center'},
        {field: "remain_hour", title: "剩余工作量", sortable: true, searchable: false, align: 'center'},
        {field: "person", title: "负责人", sortable: true, searchable: true, align: 'center'},
        {field: "done", title: "是否完成", sortable: true, searchable: false, align: 'center', formatter: bool_formatter},
        {field: "submit", title: "提交工作量", searchable: false, align: 'center', formatter: submit_formatter}
    ]
});

var create_user_form = $("#create_user_form");

// create_user_form.submit(function(event){
//     // cancels the form submission
//     // event.preventDefault();
// if(!this.checkValidity())
//         {
//                 console.info("false");
//                 create_user_form.
//
//             event.preventDefault();
//         }
//     console.info("submit");
//     // do whatever you want here
// });

$("#create_user").click(function (event) {
    console.info("click");
    $.ajax({
        method: "PUT",
        url: "user/",
        data: create_user_form.serialize(),
        success: function (response) {
            $project_table.bootstrapTable("refresh");
        },
        error: function (response) {
            flash('warning', (response.responseJSON)["message"])
        }
    })
    // create_user_form.get().checkValidity();
    // create_user_form.submit();

});