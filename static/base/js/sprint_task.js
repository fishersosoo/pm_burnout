var $task_table = $("#task_table");

function bool_formatter(value, row, index) {
    if (value)
        return "是";
    else
        return "否";
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
                "sprint_id":getQueryString("id"),
                'task_id': id,
                'hours': input
            },
            function (data) {
                $task_table.bootstrapTable('refresh', true);
            }
        )
    })
}

$task_table.bootstrapTable({
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