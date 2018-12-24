var $user_table = $("#user_table");

function bool_formatter(value, row, index) {
    if (value)
        return "是";
    else
        return "否";
}

$user_table.bootstrapTable({
    url: "projects/",
    method: 'GET',
    contentType: "",
    idField: '_id',
    // sortName: "fid",
    columns: [
        {field: "_id", title: "id", align: 'center', searchable: false, 'visible': false},
        {
            field: "name", title: "项目名", searchable: true, align: 'center', formatter: function (value, row, index) {
                herf = "project/?id=" + row["_id"];
                return [
                    '<a href=' +
                    herf +
                    ' >',
                    '<i>' +
                    value +
                    '</i>',
                    '</a>'
                ].join('');
            }
        },
        {field: "owner", title: "所有者", searchable: true, align: 'center'},
        {field: "start_time", title: "启动时间", searchable: false, align: 'center'},
        {field: "end_time", title: "结束时间", searchable: false, align: 'center'}
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
            $user_table.bootstrapTable("refresh");
        },
        error: function (response) {
            flash('warning', (response.responseJSON)["message"])
        }
    })
    // create_user_form.get().checkValidity();
    // create_user_form.submit();

});