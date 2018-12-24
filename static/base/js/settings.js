/**
 * @file 普通产品设置页面的js
 * @author gzs10558
 */
/**
 * fid列表
 * @type {*|jQuery|HTMLElement}
 */
var $fid_table = $("#fid_table");
//初始化fid列表
$fid_table.bootstrapTable({
    url: "fid_list/",
    contentType: "",
    sortName: "fid",
    columns: [
        {
            field: 'fid',
            title: 'fid',
            align: 'center',
            searchable: false
        },
        {
            field: 'name',
            title: '板块名称',
            align: 'center',
            searchable: false
        }, {
            field: 'operator',
            title: '操作',
            formatter: function (value, row, index) {
                return [
                    '<a class="remove" href="javascript:void(0)" title="删除">',
                    '<i class="glyphicon glyphicon-remove"></i>',
                    '</a>'
                ].join('');
            },
            events: {
                'click .remove': function (e, value, row, index) {
                    $.ajax({
                        url: "fid_list/",
                        type: "DELETE",
                        data: {"fid": row["fid"]},
                        success: function (data, textStatus, jqXHR) {
                            flash("info", data["message"]);
                            $fid_table.bootstrapTable("remove", {field: 'fid', values: row["fid"]});
                        }
                    })
                }
            }
        }
    ]
});
//添加新的fid
$("#fid_list_add_fid").on('click', function (e) {
    var fid = $.trim($("#fid_table_toolbar > form > div:nth-child(1) > input").val());
    var fid_name = $.trim($("#fid_table_toolbar > form > div:nth-child(2) > input").val());
    if (fid === "" || fid_name === "") {
        flash("danger", "不能为空");
        return
    }
    var data = $fid_table.bootstrapTable("getData");
    for (i in data) {
        if (fid === data[i]["fid"]) {
            flash("danger", "fid已经存在");
            return
        }
    }
    $.post("fid_list/",
        {
            "fid": fid,
            "name": fid_name
        }, function (data) {
            flash("info", data["message"]);
            $fid_table.bootstrapTable("append", {fid: fid, name: fid_name});
        })
});

/**
 * 类似于修饰器，返回删除某个白名单的函数
 * @param {string} type 类型可以为fid,tid,uid
 * @returns {Function}
 */
function remove_whitelist(type) {
    return function (e) {
        var element = $(this).parent().parent().parent();
        $.ajax({
            url: "whitelist/",
            type: 'DELETE',
            data: {"type": type, "value": $.trim($(this).parent().parent().text())},
            success: function (data, textStatus, jqXHR) {
                flash("info", data["message"]);
                element.remove()
            }
        })
    }
}

/**
 * 类似于修饰器，返回添加某个白名单的函数
 * @param {string} type 类型可以为fid,tid,uid
 * @returns {Function}
 */
function add_whitelist(type) {
    return function (e) {
        var value = $.trim($(this).parent().next().val());
        if (value === "") {
            flash("danger", "不能为空");
            $(this).parent().next().val("");
            return
        }

        // p = $('#tid_list > div > p').siblings();
        p = $("#" + type + "_list").find("div > p");
        for (var i = 0; i < p.length; ++i) {
            if ($.trim(p.get(i).innerText) === value) {
                flash("danger", "已经存在");
                $(this).parent().next().val("");
                return
            }
        }
        $.post("whitelist/",
            {"type": type, "value": value},
            function (data) {
                flash("info", data["message"]);
                var list_div = $("#" + type + "_list").get(0);
                var div = document.createElement("div");
                div.classList.add("list-group-item");
                var p = document.createElement("p");
                p.classList.add("list-group-item-text");
                p.innerText = value;
                var a = document.createElement("a");
                a.setAttribute("href", "#");
                var span = document.createElement("span");
                span.setAttribute("style", "float: right");
                span.setAttribute("href", "#");
                span.classList.add("glyphicon", "glyphicon-remove");
                span.onclick = remove_whitelist(type);
                a.appendChild(span);
                p.appendChild(a);
                div.appendChild(p);
                list_div.appendChild(div);
            }
        )
    }
}

//给按钮绑定函数

$("#add_fid > span > button").on("click", add_whitelist("fid"));
$("#fid_list > div > p > a > span").on('click', remove_whitelist("fid"));
$("#add_tid > span > button").on("click", add_whitelist("tid"));
$("#tid_list > div > p > a > span").on('click', remove_whitelist("tid"));
$("#add_uid > span > button").on("click", add_whitelist("uid"));
$("#uid_list > div > p > a > span").on('click', remove_whitelist("uid"));

/**
 * 类似于修饰器，返回删除uid监控某一项的函数
 * @param {string} name
 * @returns {Function}
 */
function remove_uid_alert(name) {
    return function (e) {
        var element = $(this).parent().parent().parent();
        $.ajax({
            url: "uid_alert/",
            type: 'DELETE',
            data: {"name": name, "value": $.trim($(this).parent().parent().text())},
            success: function (data, textStatus, jqXHR) {
                flash("info", data["message"]);
                element.remove()
            }
        })
    }
}

/**
 * 添加uid报警
 * @param {string} name
 * @param {string} val
 */
function add_uid_alert(name, val) {
    p = $("#uid_alert_" + name + "_list").find("div > p");
    for (var i = 0; i < p.length; ++i) {
        if ($.trim(p.get(i).innerText) === val) {
            flash("danger", "已经存在");
            return
        }
    }
    $.post("uid_alert/",
        {"name": name, "value": val},
        function (data) {
            flash("info", data["message"]);
            var list_div = $("#uid_alert_" + name + "_list").get(0);
            var div = document.createElement("div");
            div.classList.add("list-group-item");
            var p = document.createElement("p");
            p.classList.add("list-group-item-text");
            p.innerText = val;
            var a = document.createElement("a");
            a.setAttribute("href", "#");
            var span = document.createElement("span");
            span.setAttribute("style", "float: right");
            span.setAttribute("href", "#");
            span.classList.add("glyphicon", "glyphicon-remove");
            span.onclick = remove_uid_alert(name);
            a.appendChild(span);
            p.appendChild(a);
            div.appendChild(p);
            list_div.appendChild(div);
        }
    )
}

//uid报警按钮绑定事件
$("#uid_alert_uid_list > div > p > a > span").on("click", remove_uid_alert("uid"));
$("#uid_alert_popo_list > div > p > a > span").on("click", remove_uid_alert("popo"));
$("#uid_alert_re_list > div > p > a > span").on("click", remove_uid_alert("re"));
$("#uid_alert_add_uid > span > button").on("click", function (e) {
    var val = $.trim($(this).parent().next().val());
    if (val === "") {
        flash("danger", "不能为空");
        return;
    }
    add_uid_alert("uid", val)
});
$("#uid_alert_add_popo > span > button").on("click", function (e) {
    var val = $.trim($(this).parent().next().val());
    if (val === "") {
        flash("danger", "不能为空");
        return;
    }
    add_uid_alert("popo", val)
});
$("#uid_alert_add_re").on("click", function (e) {
    var val = $("#uid_alert_re_input").val();
    if (val === "") {
        flash("danger", "不能为空");
        return;
    }
    add_uid_alert("re", val)
});
//关键字预警
//三个报警名单列表
var $keyword_pd_table = $("#keyword_pd_table");
var $keyword_popo_table = $("#keyword_popo_table");
var $keyword_yixin_table = $("#keyword_yixin_table");
//正则列表
var $keyword_table = $("#keyword_table");
//正则列表的选择的行，以及数据
var $keyword_select_row = undefined;
var keyword_select_row_data = null;

/**
 * 加载一行正则到报警名单列表中，
 * @param {Object} row 正则列表的某行数据
 */
function keyword_load_from_row(row) {
    pd = [];
    for (i in row["pd"]) {
        pd.push({pd: row["pd"][i]})
    }
    popo = [];
    for (i in row["popo"]) {
        popo.push({popo: row["popo"][i]})
    }
    yixin = [];
    for (i in row["yixin"]) {
        yixin.push({yixin: row["yixin"][i]})
    }
    $keyword_pd_table.bootstrapTable("load", pd);
    $keyword_popo_table.bootstrapTable("load", popo);
    $keyword_yixin_table.bootstrapTable("load", yixin);
}

/**
 * 在修改数据之后，向服务器发送请求进行修改
 * @param {function} update_func 修改数据的函数
 */
function keyword_update(update_func) {
    if ($keyword_select_row === undefined) {
        flash("danger", "请先在表格选择要修改的的记录");
        return
    }
    update_func();
    {
        $.ajax({
            url: "keyword/",
            type: "PUT",
            data: {
                "_id": keyword_select_row_data["_id"],
                "data": JSON.stringify(keyword_select_row_data)
            },
            success: function (data, textStatus, jqXHR) {
                flash("info", data["message"]);
                index = $keyword_select_row.attr("data_index");
                $keyword_table.bootstrapTable("updateRow", {index: parseInt(index), row: keyword_select_row_data});
                $keyword_select_row = $("#keyword_table > tbody > tr[data-index='" + $keyword_select_row.attr("data-index") + "']");
                $keyword_select_row.get(0).classList.add("my-bg-primary");
                keyword_load_from_row(keyword_select_row_data);
                // $fid_table.bootstrapTable("remove", {field: 'fid', values: row["fid"]});
            }
        })
    }
}

//初始化pd报警表格
$keyword_pd_table.bootstrapTable({
    columns: [{
        field: 'pd',
        title: 'PD',
        align: 'left',
    }, {
        field: 'operator',
        title: '',
        width: 20,
        formatter: function (value, row, index) {
            return [
                '<a class="remove" href="javascript:void(0)" title="删除">',
                '<i class="glyphicon glyphicon-remove"></i>',
                '</a>'
            ].join('');
        },
        events: {
            'click .remove': function (e, value, row, index) {
                keyword_update(function () {
                    $keyword_pd_table.bootstrapTable("remove", {field: 'pd', values: [row["pd"]]});
                    var data = $keyword_pd_table.bootstrapTable("getData");
                    keyword_select_row_data["pd"] = [];
                    for (i in data) {
                        keyword_select_row_data["pd"].push(data[i]["pd"])
                    }
                });
            }
        }
    }]
});
//初始化popo表格
$keyword_popo_table.bootstrapTable({
    columns: [{
        field: 'popo',
        title: 'POPO',
        align: 'left',
    }, {
        field: 'operator',
        title: '',
        width: 20,
        formatter: function (value, row, index) {
            return [
                '<a class="remove" href="javascript:void(0)" title="删除">',
                '<i class="glyphicon glyphicon-remove"></i>',
                '</a>'
            ].join('');
        },
        events: {
            'click .remove': function (e, value, row, index) {
                keyword_update(function () {
                    $keyword_popo_table.bootstrapTable("remove", {field: 'popo', values: [row["popo"]]});
                    var data = $keyword_popo_table.bootstrapTable("getData");
                    keyword_select_row_data["popo"] = [];
                    for (i in data) {
                        keyword_select_row_data["popo"].push(data[i]["popo"])
                    }
                });
            }
        }
    }]
});
$("#keyword_edit").on("click", function (e) {
    keyword_update(function () {
        keyword_select_row_data["re"] = $("#keyword_re_input").val();
        keyword_select_row_data["desc"] = $("#keyword_desc_input").val();
    });
});
//初始化易信表格
$keyword_yixin_table.bootstrapTable({
    columns: [{
        field: 'yixin',
        title: '易信',
        align: 'left',
    }, {
        field: 'operator',
        title: '',
        width: 20,
        formatter: function (value, row, index) {
            return [
                '<a class="remove" href="javascript:void(0)" title="删除">',
                '<i class="glyphicon glyphicon-remove"></i>',
                '</a>'
            ].join('');
        },
        events: {
            'click .remove': function (e, value, row, index) {
                keyword_update(function () {
                    $keyword_yixin_table.bootstrapTable("remove", {field: 'yixin', values: [row["yixin"]]});
                    var data = $keyword_yixin_table.bootstrapTable("getData");
                    keyword_select_row_data["yixin"] = [];
                    for (i in data) {
                        keyword_select_row_data["yixin"].push(data[i]["yixin"])
                    }
                });
            }
        }
    }]
});
//关键字报警正则表格
$keyword_table.bootstrapTable({
    contentType: "",
    uniqueId: "_id",
    url: "keyword/",
    columns: [{
        field: '_id',
        title: 'id',
        align: 'left',
        visible: false
    }, {
        field: 'yixin',
        title: '易信',
        align: 'left',
        visible: false
    }, {
        field: 'popo',
        title: 'POPO',
        align: 'left',
        visible: false
    }, {
        field: 'pd',
        title: 'PD',
        align: 'left',
        visible: false
    }, {
        field: 're',
        title: '正则',
        align: 'left',
        width: 250,
        formatter: function (value, row, index) {
            if (value.length > 25) {
                return value.substr(0, 25) + "..."
            }
            else {
                return value
            }
        }
    },

        {
            field: 'desc',
            title: '备注',
            filterControl: "select",
            width: 80,
            align: 'left',
        },
        {
            field: 'operator',
            title: '操作',
            width: 30,
            formatter: function (value, row, index) {
                return [
                    '<a class="remove" href="javascript:void(0)" title="删除">',
                    '<i style="color: #c7254e"  class="glyphicon glyphicon-remove"></i>',
                    '</a>'
                ].join('');
            },
            events: {
                'click .remove': function (e, value, row, index) {
                    $.ajax({
                        url: "keyword/",
                        type: "DELETE",
                        data: {"_id": row["_id"]},
                        success: function (data, textStatus, jqXHR) {
                            $keyword_table.bootstrapTable("refresh");
                            flash("info", data["message"]);
                            $("#keyword_re_input").val("");
                            $("#keyword_desc_input").val("");
                            $keyword_select_row = undefined;
                            keyword_select_row_data = null;
                            $("#keyword_save").get(0).classList.remove("hidden");
                            $("#keyword_edit").get(0).classList.add("hidden");
                            $keyword_pd_table.bootstrapTable("load", []);
                            $keyword_popo_table.bootstrapTable("load", []);
                            $keyword_yixin_table.bootstrapTable("load", []);
                            // flash("info", data["message"]);
                            // $fid_table.bootstrapTable("remove", {field: 'fid', values: row["fid"]});
                        }
                    })
                }
            }
        }]
});

//点击关键词表格某一行
$keyword_table.on("click-row.bs.table", function (e, row, $element, field) {
    if ($keyword_select_row !== undefined) {
        // selected 清除原来选中行状态
        $keyword_select_row.get(0).classList.remove("my-bg-primary");
        keyword_select_row_data = null;
    } else {
        // not selected
        $("#keyword_save").get(0).classList.add("hidden");
        $("#keyword_edit").get(0).classList.remove("hidden");
    }
    //修改被选中行状态
    $keyword_select_row = $element;
    keyword_select_row_data = row;
    $element.get(0).classList.add("my-bg-primary");
    keyword_load_from_row(row);
    $("#keyword_re_input").val(row["re"]);
    $("#keyword_desc_input").val(row["desc"]);
});
$("#keyword_add_re").on('click', function (e) {
    $("#keyword_re_input").val("");
    $("#keyword_desc_input").val("");
    $keyword_select_row.get(0).classList.remove("my-bg-primary");
    $keyword_select_row = undefined;
    keyword_select_row_data = null;
    $("#keyword_save").get(0).classList.remove("hidden");
    $("#keyword_edit").get(0).classList.add("hidden");
    $keyword_pd_table.bootstrapTable("load", []);
    $keyword_popo_table.bootstrapTable("load", []);
    $keyword_yixin_table.bootstrapTable("load", []);
});
$("#keyword_save").on('click', function (e) {
    //新建正则
    var re = $("#keyword_re_input").val();
    if ($.trim(re) === "") {
        flash('danger', '正则不能为空');
        return
    }
    var desc = $("#keyword_desc_input").val();

    $.post("keyword/", {re: re, desc: desc}, function (data) {
        $keyword_table.bootstrapTable("refresh");
        flash("info", data["message"]);
        re = $("#keyword_re_input").val("");
        desc = $("#keyword_desc_input").val("");
    })
});
//添加popo
$("#keyword_add_popo").on("click", function (e) {
    val = $("#keyword_popo_input").val();
    if (val === "") {
        flash("danger", "不能为空")
    }
    keyword_update(function () {
        keyword_select_row_data["popo"].push(val)
    })
});
//添加pd
$("#keyword_add_pd").on("click", function (e) {
    val = $("#keyword_pd_input").val();
    if (val === "") {
        flash("danger", "不能为空")
    }
    keyword_update(function () {
        keyword_select_row_data["pd"].push(val)
    })
});
//添加易信
$("#keyword_add_yixin").on("click", function (e) {
    val = $("#keyword_yixin_input").val();
    if (val === "") {
        flash("danger", "不能为空")
    }
    keyword_update(function () {
        keyword_select_row_data["yixin"].push(val)
    })
});
//自动处理字库

var $auto_re_table = $("#auto_re_table");
var $auto_re_selected_row = undefined;
var auto_re_selected_row_data = null;
$auto_re_table.bootstrapTable({
    height: 550,
    contentType: "",
    url: "auto_re/",
    uniqueId: "_id",
    columns: [{
        field: '_id',
        title: 'id',
        align: 'left',
        visible: false
    }, {
        field: 'fids',
        title: '',
        align: 'left',
        visible: false
    }, {
        field: 're',
        title: '正则',
        align: 'left',
        width: 250,
        formatter: function (value, row, index) {
            if (value.length > 25) {
                return value.substr(0, 25) + "..."
            }
            else {
                return value
            }
        }
    },
        {
            field: 'desc',
            title: '备注',
            filterControl: "select",
            width: 80,
            align: 'left',
        },
        {
            field: 'operator',
            title: '操作',
            width: 30,
            formatter: function (value, row, index) {
                return [
                    '<a class="remove" href="javascript:void(0)" title="删除">',
                    '<i style="color: #c7254e"  class="glyphicon glyphicon-remove"></i>',
                    '</a>'
                ].join('');
            },
            events: {
                'click .remove': function (e, value, row, index) {
                    $.ajax({
                        url: "auto_re/",
                        type: "DELETE",
                        data: {"_id": row["_id"]},
                        success: function (data, textStatus, jqXHR) {

                            flash("info", data["message"]);
                            $auto_re_table.bootstrapTable("remove", {field: '_id', values: [row["_id"]]});
                            auto_re_selected_row_data = null;
                            $auto_re_selected_row = undefined;
                            $(document).trigger("auto_re_selected_row_load")
                        }
                    })
                }
            }
        }]
});
//选择的行重新加载
$(document).on("auto_re_selected_row_load", function () {
    if (auto_re_selected_row_data === null) {
        $("#auto_edit_re").get(0).classList.add("hidden");
        $("#auto_add_re").get(0).classList.remove("hidden");
        $("#auto_fid_input").val("");
        $("#auto_desc_input").val("");
        $("#auto_re_input").val("");
        return;
    }
    if (auto_re_selected_row_data["fids"] !== "all") {
        $("#auto_fid_input").val(auto_re_selected_row_data["fids"].join(","));
        $("input[name=auto_fid_radio][value='part']").trigger('click')
    } else {
        $("input[name=auto_fid_radio][value='all']").trigger('click')
    }
    $("#auto_desc_input").val(auto_re_selected_row_data["desc"]);
    $("#auto_re_input").val(auto_re_selected_row_data["re"]);
});

//更新选中行
$(document).on("auto_re_selected_row_save", function () {
    if ($("input[name='auto_fid_radio']:checked").val() === "part") {
        var fids = $("#auto_fid_input").val();
        fids = fids.replace(/\s+/g, "");
        fids = fids.split(',');
        auto_re_selected_row_data["fids"] = fids
    } else {
        auto_re_selected_row_data["fids"] = "all"
    }
    auto_re_selected_row_data["re"] = $("#auto_re_input").val();
    auto_re_selected_row_data["desc"] = $("#auto_desc_input").val();
    $.ajax({
        url: "auto_re/",
        type: "PUT",
        data: {"_id": auto_re_selected_row_data["_id"], data: JSON.stringify(auto_re_selected_row_data)},
        success: function (data, textStatus, jqXHR) {
            index = $auto_re_selected_row.attr("data_index");
            $auto_re_table.bootstrapTable("updateRow", {index: parseInt(index), row: auto_re_selected_row_data});
            $auto_re_selected_row = $("#auto_re_table > tbody > tr[data-index='" + $auto_re_selected_row.attr("data-index") + "']");
            $auto_re_selected_row.get(0).classList.add("my-bg-primary");
            flash("info", data["message"]);
            // $fid_table.bootstrapTable("remove", {field: 'fid', values: row["fid"]});
        }
    })
});

$("#auto_edit_re").on("click", function (e) {
    $(document).trigger("auto_re_selected_row_save")
});
$("#auto_add_re").on("click", function (e) {
    if (auto_re_selected_row_data === null) {
        auto_re_selected_row_data = {}
    }
    if ($("input[name='auto_fid_radio']:checked").val() === "part") {
        var fids = $("#auto_fid_input").val();
        fids = fids.replace(/\s+/g, "");
        fids = fids.split(',');
        auto_re_selected_row_data["fids"] = fids
    } else {
        auto_re_selected_row_data["fids"] = "all"
    }
    auto_re_selected_row_data["re"] = $("#auto_re_input").val();
    if ($.trim(auto_re_selected_row_data["re"]) === "") {
        flash('danger', '正则不能为空');
        return
    }
    auto_re_selected_row_data["desc"] = $("#auto_desc_input").val();
    $.ajax({
        url: "auto_re/",
        type: "POST",
        data: {data: JSON.stringify(auto_re_selected_row_data)},
        success: function (data, textStatus, jqXHR) {
            auto_re_selected_row_data["_id"] = data["_id"];
            $auto_re_table.bootstrapTable("append", auto_re_selected_row_data);
            // console.log($("#auto_re_table > tbody > tr[data-uniqueid='" + data["_id"] + "']"))
            $auto_re_selected_row = $("#auto_re_table > tbody > tr:last");
            $auto_re_selected_row.attr("id", data["_id"]);
            $auto_re_selected_row.attr("data-uniqueid", data["_id"]);
            $auto_re_selected_row.get(0).classList.add("my-bg-primary");
            flash("info", data["message"]);
            $("#auto_add_re").get(0).classList.add("hidden");
            $("#auto_edit_re").get(0).classList.remove("hidden");
            // $fid_table.bootstrapTable("remove", {field: 'fid', values: row["fid"]});
        }
    })
});
$auto_re_table.on("click-row.bs.table", function (e, row, $element, field) {
    if ($auto_re_selected_row !== undefined) {
        // selected
        $auto_re_selected_row.get(0).classList.remove("my-bg-primary");
        auto_re_selected_row_data = null;
    } else {
        // not selected
        $("#auto_add_re").get(0).classList.add("hidden");
        $("#auto_edit_re").get(0).classList.remove("hidden");
    }
    $auto_re_selected_row = $element;
    auto_re_selected_row_data = row;
    $element.get(0).classList.add("my-bg-primary");
    $(document).trigger("auto_re_selected_row_load")
});
$("input[name='auto_fid_radio']").change(function (e) {
    if ($("input[name='auto_fid_radio']:checked").val() === "part") {
        $("#auto_fid_input").attr("disabled", false)
    } else {
        $("#auto_fid_input").attr("disabled", true)
    }
});
$("#auto_add").on("click", function (e) {
    if ($auto_re_selected_row !== undefined) {
        // selected
        $auto_re_selected_row.get(0).classList.remove("my-bg-primary");
        $auto_re_selected_row = undefined;
        auto_re_selected_row_data = null;
        $("#auto_edit_re").get(0).classList.add("hidden");
        $("#auto_add_re").get(0).classList.remove("hidden");
    }
});
//监控字库
var $monitor_re_table = $("#monitor_re_table");
var $monitor_re_selected_row = undefined;
var monitor_re_selected_row_data = null;
$monitor_re_table.bootstrapTable({
    contentType: "",
    url: "monitor_re/",
    uniqueId: "_id",
    columns: [{
        field: '_id',
        title: 'id',
        align: 'left',
        visible: false
    }, {
        field: 're',
        title: '正则',
        align: 'left',
        width: 250,
        formatter: function (value, row, index) {
            if (value.length > 25) {
                return value.substr(0, 25) + "..."
            }
            else {
                return value
            }
        }
    },
        {
            field: 'desc',
            title: '备注',
            filterControl: "select",
            width: 80,
            align: 'left',
        },
        {
            field: 'operator',
            title: '操作',
            width: 30,
            formatter: function (value, row, index) {
                return [
                    '<a class="remove" href="javascript:void(0)" title="删除">',
                    '<i style="color: #c7254e"  class="glyphicon glyphicon-remove"></i>',
                    '</a>'
                ].join('');
            },
            events: {
                'click .remove': function (e, value, row, index) {
                    $.ajax({
                        url: "monitor_re/",
                        type: "DELETE",
                        data: {"_id": row["_id"]},
                        success: function (data, textStatus, jqXHR) {
                            flash("info", data["message"]);
                            $monitor_re_table.bootstrapTable("remove", {field: '_id', values: [row["_id"]]});
                            monitor_re_selected_row_data = null;
                            $monitor_re_selected_row = undefined;
                            $(document).trigger("monitor_re_selected_row_load")
                        }
                    })
                }
            }
        }]
});
//选择的行重新加载
$(document).on("monitor_re_selected_row_load", function () {
    if (monitor_re_selected_row_data === null) {
        $("#monitor_desc_input").val("");
        $("#monitor_re_input").val("");
        return;
    }
    $("#monitor_desc_input").val(monitor_re_selected_row_data["desc"]);
    $("#monitor_re_input").val(monitor_re_selected_row_data["re"]);
});
//更新选中行
$(document).on("monitor_re_selected_row_save", function () {
    monitor_re_selected_row_data["re"] = $("#monitor_re_input").val();
    if ($.trim(monitor_re_selected_row_data["re"]) === "") {
        flash('danger', '正则不能为空');
        return
    }
    monitor_re_selected_row_data["desc"] = $("#monitor_desc_input").val();
    $.ajax({
        url: "monitor_re/",
        type: "PUT",
        data: {"_id": monitor_re_selected_row_data["_id"], data: JSON.stringify(monitor_re_selected_row_data)},
        success: function (data, textStatus, jqXHR) {
            index = $monitor_re_selected_row.attr("data_index");
            $monitor_re_table.bootstrapTable("updateRow", {index: parseInt(index), row: monitor_re_selected_row_data});
            $monitor_re_selected_row = $("#monitor_re_table > tbody > tr[data-index='" + $monitor_re_selected_row.attr("data-index") + "']");
            $monitor_re_selected_row.get(0).classList.add("my-bg-primary");
            flash("info", data["message"]);
            // $fid_table.bootstrapTable("remove", {field: 'fid', values: row["fid"]});
        }
    })
});

$("#monitor_edit_re").on("click", function (e) {
    if ($monitor_re_selected_row === undefined) {
        flash("danger", "请先选取需要修改的正则");
        return;
    }
    $(document).trigger("monitor_re_selected_row_save")
});
$("#monitor_add_re").on("click", function (e) {
    monitor_re_selected_row_data = null;
    $monitor_re_selected_row = undefined;
    if (monitor_re_selected_row_data === null) {
        monitor_re_selected_row_data = {}
    }
    monitor_re_selected_row_data["re"] = $("#monitor_re_input").val();
    if ($.trim(monitor_re_selected_row_data["re"]) === "") {
        flash('danger', '正则不能为空');
        return
    }
    monitor_re_selected_row_data["desc"] = $("#monitor_desc_input").val();
    $.ajax({
        url: "monitor_re/",
        type: "POST",
        data: {data: JSON.stringify(monitor_re_selected_row_data)},
        success: function (data, textStatus, jqXHR) {
            monitor_re_selected_row_data["_id"] = data["_id"];
            $monitor_re_table.bootstrapTable("append", monitor_re_selected_row_data);
            // console.log($("#auto_re_table > tbody > tr[data-uniqueid='" + data["_id"] + "']"))
            $monitor_re_selected_row = $("#monitor_re_table > tbody > tr:last");
            $monitor_re_selected_row.attr("id", data["_id"]);
            $monitor_re_selected_row.attr("data-uniqueid", data["_id"]);
            $monitor_re_selected_row.get(0).classList.add("my-bg-primary");
            flash("info", data["message"]);
            // $fid_table.bootstrapTable("remove", {field: 'fid', values: row["fid"]});
        }
    })
});
$monitor_re_table.on("click-row.bs.table", function (e, row, $element, field) {
    if ($monitor_re_selected_row !== undefined) {
        // selected
        $monitor_re_selected_row.get(0).classList.remove("my-bg-primary");
        monitor_re_selected_row_data = null;
    } else {
        // not selected
    }
    $monitor_re_selected_row = $element;
    monitor_re_selected_row_data = row;
    $element.get(0).classList.add("my-bg-primary");
    $(document).trigger("monitor_re_selected_row_load")
});
$("#monitor_add").on("click", function (e) {
    if ($monitor_re_selected_row !== undefined) {
        // selected
        $monitor_re_selected_row.get(0).classList.remove("my-bg-primary");
        $monitor_re_selected_row = undefined;
        monitor_re_selected_row_data = null;
    }
});

/**
 * 在页面上添加一个key value对
 * @param {string} key
 * @param {string} value
 */
function add_cookies_item(key, value) {
    var div = document.getElementById("cookies_json_div");
    var form_group = document.createElement('div');
    form_group.classList.add("form-group");
    var key_div = document.createElement('div');
    key_div.classList.add("col-md-4");
    var key_input = document.createElement("input");
    key_input.classList.add("form-control");
    key_input.type = "text";
    key_input.value = key;
    key_div.appendChild(key_input);
    form_group.appendChild(key_div);
    var value_div = document.createElement('div');
    value_div.classList.add("col-md-7");
    var value_input = document.createElement("input");
    value_input.classList.add("form-control");
    value_input.type = "text";
    value_input.value = value;
    value_div.appendChild(value_input);
    form_group.appendChild(value_div);
    div.appendChild(form_group)
}

//添加一个key value对
$("#add_cookies").on("click", function (e) {
    var key = $.trim($("#cookies_key_input").val());
    if (key === "") {
        $("#cookies_key_input").popover('show');
        $('#cookies_key_input').on('shown.bs.popover', function () {
            setTimeout(function () {
                $("#cookies_key_input").popover('hide');
                $("#cookies_key_input").popover('destroy');
            }, 2000);

        });
        return
    }
    var val = $.trim($("#cookies_value_input").val());
    add_cookies_item(key, val);
    $("#cookies_key_input").val("");
    $("#cookies_value_input").val("");

});

/**
 * 从服务器获取cookies
 */
function load_cookies() {
    document.getElementById("cookies_json_div").innerHTML = "";
    $.get("cookies/", {}, function (data) {
            for (k in data) {
                add_cookies_item(k, data[k])
            }
        }
    )
}

load_cookies();

/**
 * 保存 cookies 到服务器
 */
function set_cookies() {
    var data = {};
    var $lines = $("#cookies_json_div").find(".form-group");
    for (var i = 0; i < $lines.length; ++i) {
        if ($($lines[i]).find("input:first").val() !== "")
            data[$($lines[i]).find("input:first").val()] = $($lines[i]).find("input:last").val()
    }
    console.log(data);
    $.post("cookies/",
        {data: JSON.stringify(data)}, function (data) {
            flash("info", data["message"]);
            load_cookies()
        })
}

//保存cookies按钮响应
$("#save_cookies").on("click", set_cookies);
//还原cookies
$("#reset_cookies").on("click", load_cookies);

//这三个是修复固定表头以及表格高度造成的显示bug
$keyword_table.on("load-success.bs.table", function (e) {
    $(".fixed-table-container").css("padding-bottom", "40px");
});
$auto_re_table.on("load-success.bs.table", function (e) {
    $(".fixed-table-container").css("padding-bottom", "40px")
});
$monitor_re_table.on("load-success.bs.table", function (e) {
    $(".fixed-table-container").css("padding-bottom", "40px")
});
//封面输入改变时候，显示到预览上
$("#cover_pic_input").on("change", function (e) {
    $("#previewer").attr("src", $("#cover_pic_input").val());

});
//修改封面提交到服务器上
$("#cover_submit").on('click', function (e) {
    $.post("set_cover/",
        {
            tid: $("#cover_fid_input").val(),
            img_url: $("#cover_pic_input").val()
        },
        function (data) {
            data = JSON.parse(data);
            flash("info", data["message"])
        })
});
$("#set_cover_file_upload").on("click", function (e) {
    $.ajax({
        url: 'set_cover_file/',
        type: 'POST',
        cache: false,
        data: new FormData($('#set_cover_form')[0]),
        processData: false,
        contentType: false
    }).done(function (res) {
        flash('info',JSON.parse(res)["message"])
    }).fail(function (res) {
        alert(JSON.parse(res)["message"])
    });
});