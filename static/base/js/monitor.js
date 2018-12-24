var parser = new UBB({//将UBB代码转为HTML代码的设置
    defaultColor: '#000000',            // [option] color of all text element
    linkDefaultColor: '#006699',        // [option] color of a elment
    flashImage: '/skin/imgs/flash.png', // [option] flash image to show
    tags: {
        url: {
            parseHTML: function (nodeName, node, re) {

                // define which dom node to convert
                // node is a jquery object
                if (nodeName === 'a') {
                    // return prefix string
                    re.prefix = '[url=' + node.getAttribute("href") + ']' + (re.prefix || '');
                    // return suffix string
                    re.suffix = (re.suffix || '') + '[/url]';
                }
            },
            parseUBB: function (node, sonString, setting) {
                // parser will find a matched tag for you
                // return UBB string include sonString
                console.log(sonString);
                var href = "";
                if (node["attr"] !== undefined)
                    href = "http://" + product_url + ".netease.com/" + node["attr"].substr(1, node["attr"].length - 1);
                else
                    href = sonString;
                return '<a target="_blank" href="' + href + '">' + sonString + '</a>'
                // console.log(node)
                // return '<span style="color:' + setting["defaultColor"] + ';">' + sonString + '</span>';
            },
            // string.
            // Specified which tag can be contained.
            // '' or undefined indicate it can't contian any tag.
            // '*' indicate it can contian any tag.
            canContains: 'bold,italic,color,url,image',
            // bool.
            // If true, then this tag can contains '\n'.
            canWrap: 1,
            // bool.
            // If true, then the '\n' right after this tag should be ignore.
            isBlock: 0,
            noAttr: 0
        },
        quote: {
            parseHTML: function (nodeName, node, re) {

                // define which dom node to convert
                // node is a jquery object

            },
            parseUBB: function (node, sonString, setting) {
                // parser will find a matched tag for you
                // return UBB string include sonString
                return '<div class="blockquote">' + sonString + '</div>';
            },
            // string.
            // Specified which tag can be contained.
            // '' or undefined indicate it can't contian any tag.
            // '*' indicate it can contian any tag.
            canContains: '*',
            // bool.
            // If true, then this tag can contains '\n'.
            canWrap: 1,
            // bool.
            // If true, then the '\n' right after this tag should be ignore.
            isBlock: 1,
            noAttr: 1
        },
        size: {
            parseHTML: function (nodeName, node, re) {

                // define which dom node to convert
                // node is a jquery object

            },
            parseUBB: function (node, sonString, setting) {
                // parser will find a matched tag for you
                // return UBB string include sonString
                console.log(node);
                return '<span style="color:' + setting["defaultColor"] + ';">' + sonString + '</span>';
            },
            // string.
            // Specified which tag can be contained.
            // '' or undefined indicate it can't contian any tag.
            // '*' indicate it can contian any tag.
            canContains: 'bold,italic,color,url,image',
            // bool.
            // If true, then this tag can contains '\n'.
            canWrap: 0,
            // bool.
            // If true, then the '\n' right after this tag should be ignore.
            isBlock: 0,
            noAttr: 0
        }
        , img: {
            parseHTML: function (nodeName, node, re) {

                // define which dom node to convert
                // node is a jquery object

            },
            parseUBB: function (node, sonString, setting) {
                // parser will find a matched tag for you
                // return UBB string include sonString
                console.log(node);
                return ['<a target="_blank" href="' + sonString + '" class="thumbnail" style="width: 30%;">' +
                '<img src="' + sonString + '" style="width: 30%;" >' +
                '</a>'].join('');
            },
            // string.
            // Specified which tag can be contained.
            // '' or undefined indicate it can't contian any tag.
            // '*' indicate it can contian any tag.
            canContains: '',
            // bool.
            // If true, then this tag can contains '\n'.
            canWrap: 0,
            // bool.
            // If true, then the '\n' right after this tag should be ignore.
            isBlock: 0,
            noAttr: 0
        }

    }
});
//将HTML转为UBB码
var parser2 = new UBB({//将HTML转为UBB码
    defaultColor: '#000000',            // [option] color of all text element
    linkDefaultColor: '#006699',        // [option] color of a elment
    flashImage: '/skin/imgs/flash.png', // [option] flash image to show
    tags: {
        url: {
            parseHTML: function (nodeName, node, re) {

                // define which dom node to convert
                // node is a jquery object
                if (nodeName === 'a') {
                    // return prefix string
                    re.prefix = '[url=' + node.getAttribute("href") + ']' + (re.prefix || '');
                    // return suffix string
                    re.suffix = (re.suffix || '') + '[/url]';
                }
            },
            parseUBB: function (node, sonString, setting) {
                // parser will find a matched tag for you
                // return UBB string include sonString
                console.log(node[0]);
                var href = node[0]["value"];
                if (sonString === href) {
                    sonString = "链接"
                }
                return '<a target="_blank" href="' + href + '">' + sonString + '</a>'
                // console.log(node)
                // return '<span style="color:' + setting["defaultColor"] + ';">' + sonString + '</span>';
            },
            // string.
            // Specified which tag can be contained.
            // '' or undefined indicate it can't contian any tag.
            // '*' indicate it can contian any tag.
            canContains: 'bold,italic,color,url,image',
            // bool.
            // If true, then this tag can contains '\n'.
            canWrap: 1,
            // bool.
            // If true, then the '\n' right after this tag should be ignore.
            isBlock: 0,
            noAttr: 0
        },
        quote: {
            parseHTML: function (nodeName, node, re) {

                // define which dom node to convert
                // node is a jquery object

            },
            parseUBB: function (node, sonString, setting) {
                // parser will find a matched tag for you
                // return UBB string include sonString
                return '<div class="blockquote">' + sonString + '</div>';
            },
            // string.
            // Specified which tag can be contained.
            // '' or undefined indicate it can't contian any tag.
            // '*' indicate it can contian any tag.
            canContains: '*',
            // bool.
            // If true, then this tag can contains '\n'.
            canWrap: 1,
            // bool.
            // If true, then the '\n' right after this tag should be ignore.
            isBlock: 1,
            noAttr: 1
        },
        size: {
            parseHTML: function (nodeName, node, re) {

                // define which dom node to convert
                // node is a jquery object

            },
            parseUBB: function (node, sonString, setting) {
                // parser will find a matched tag for you
                // return UBB string include sonString
                console.log(node);
                return '<span style="color:' + setting["defaultColor"] + ';">' + sonString + '</span>';
            },
            // string.
            // Specified which tag can be contained.
            // '' or undefined indicate it can't contian any tag.
            // '*' indicate it can contian any tag.
            canContains: 'bold,italic,color,url,image',
            // bool.
            // If true, then this tag can contains '\n'.
            canWrap: 0,
            // bool.
            // If true, then the '\n' right after this tag should be ignore.
            isBlock: 0,
            noAttr: 0
        }
        , img: {
            parseHTML: function (nodeName, node, re) {

                // define which dom node to convert
                // node is a jquery object

            },
            parseUBB: function (node, sonString, setting) {
                // parser will find a matched tag for you
                // return UBB string include sonString
                console.log(node);
                return ['<a target="_blank" href="' + sonString + '" class="thumbnail" style="width: 30%;">' +
                '<img src="' + sonString + '" style="width: 30%;" >' +
                '</a>'].join('');
            },
            // string.
            // Specified which tag can be contained.
            // '' or undefined indicate it can't contian any tag.
            // '*' indicate it can contian any tag.
            canContains: '',
            // bool.
            // If true, then this tag can contains '\n'.
            canWrap: 0,
            // bool.
            // If true, then the '\n' right after this tag should be ignore.
            isBlock: 0,
            noAttr: 0
        }

    }
});

/**
 * 刷新未处理帖子函数
 */
function refresh_post_num() {
    $.get("monitor_post/num/", {}, function (data) {
        $("#all_post").text(data)
    })
}

window.setInterval(refresh_post_num, 20000);

/**
 * 根据帖子信息构建前端div
 * @param {Object} post 一条帖子
 * @param {number} index 帖子的下标
 * @param {boolean} show_buttom 是否显示回复和屏蔽按钮
 * @returns {Element} html元素
 */
function buidl_post_div(post, index, show_buttom) {
    var post_div = document.createElement("div");
    post_div.classList.add("post", "bg-info");
    var subject = post["subject"];
    if (subject === "") {
        subject = "回复"
    }
    var title = document.createElement("h3");
    var title_a = document.createElement("a");
    title_a.innerText = subject;
    title_a.setAttribute("target", "_blank");
    title_a.setAttribute("href", 'http://' + product_url + '.netease.com/forum.php?mod=redirect&goto=findpost&ptid=' + post["tid"] + '&pid=' + post["pid"] + '.html');
    title.appendChild(title_a);
    post_div.appendChild(title);

    var sub_div = document.createElement("div");
    sub_div.classList.add("sub_div");

    var user = document.createElement("h4");
    user.classList.add("sub");
    user.innerText = "用户：";
    var user_a = document.createElement("a");
    user_a.innerText = (post["author"]);
    user_a.setAttribute("target", "_blank");
    user_a.setAttribute("href", 'http://' + product_url + '.netease.com/space-uid-' + post["authorid"] + '.html');
    user.appendChild(user_a);
    sub_div.appendChild(user);

    var dateline = document.createElement("h4");
    dateline.classList.add("sub");
    dateline.innerText = "发表时间：" + (date('Y年m月d日 H:i:s', post["dateline"]));
    sub_div.appendChild(dateline);

    var ip = document.createElement("h4");
    ip.classList.add("sub");
    ip.innerText = "ip：" + post["useip"];
    sub_div.appendChild(ip);

    var position = document.createElement("h4");
    position.classList.add("sub");
    position.innerText = post["position"] + "楼";
    sub_div.appendChild(position);

    var desc = document.createElement("h4");
    desc.classList.add("sub");
    var desc_text = document.createElement("span");
    desc_text.classList.add("text-danger");
    desc_text.innerText = post["desc"];
    desc.appendChild(desc_text);
    sub_div.appendChild(desc);
    post_div.appendChild(sub_div);

    var hr = document.createElement("hr");
    hr.classList.add("separate_line");
    post_div.appendChild(hr);

    var content = document.createElement("div");
    if (post["htmlon"] === 1) {
        content.innerHTML = (post["message"]);
    } else {
        content.innerHTML = parser.UBBtoHTML(post["message"]);
    }

    post_div.appendChild(content);
    if (show_buttom !== undefined) {
        var buttom_row = document.createElement("div");
        buttom_row.classList.add("row");
        buttom_row.style.marginTop = "20px";
        buttom_row.style.marginBottom = "10px";
        buttom_row.innerHTML = '<div class="col-md-2">\n' +
            '    <button name="ban" data-index="' + index + '" class="btn btn-default btn-block">屏蔽</button>\n' +
            '</div>\n' +
            '<div class="col-md-2">\n' +
            '    <button name="reply" data-index="' + index + '" class="btn btn-default btn-block" \n' +
            '           >回复\n' +
            '    </button>\n' +
            '</div>';
        post_div.appendChild(buttom_row);
    }
    post_div.setAttribute("data-index", index);
    return post_div;
}
/**
 * 页面所有的的帖子
 * @type {Array}
 */
var posts_data = [];

/**
 * 刷新帖子列表
 */
function refresh_post() {
    var all_post_divs = document.getElementById("posts");
    all_post_divs.innerHTML = "loading...";
    //从服务器获取帖子
    $.get("monitor_post/", {}, function (data) {
        posts_data = data;
        //清除原有帖子列表
        all_post_divs.innerHTML = "";
        //构造帖子列表
        for (index in posts_data) {
            all_post_divs.appendChild(buidl_post_div(posts_data[index], index, true))
        }
        refresh_post_num();
        //给所有屏蔽按钮绑定响应
        $("#posts > div > div.row > div:nth-child(1) > button").on('click', function (e) {
            var index = parseInt($(this).attr("data-index"));
            if (posts_data[(index)]["ischecked"] !== true) {
                console.log(($("#posts > div").get(index).style));
                $("#posts > div").get(index).classList.remove("bg-info");
                $("#posts > div").get(index).classList.add("bg-danger");
                posts_data[(index)]["ischecked"] = true;
                this.innerText = "解除屏蔽"
            }
            else {
                posts_data[parseInt(index)]["ischecked"] !== false;
                $("#posts > div").get(index).classList.add("bg-info");
                $("#posts > div").get(index).classList.remove("bg-danger");
                posts_data[(index)]["ischecked"] = false;
                this.innerText = "屏蔽"
            }
        });
        //给所有回复按钮绑定响应
        $("#posts > div > div.row > div:nth-child(2) > button").on('click', function (e) {
            var index = parseInt($(this).attr("data-index"));
            $("#reply_modal").modal("toggle");
            var reply_modal_post = document.getElementById("reply_modal_post");
            reply_modal_post.innerHTML = "";
            reply_modal_post.appendChild(buidl_post_div(posts_data[index], index));
            $("#reply").data("post_data", posts_data[index]);
            if (posts_data[index]["has_reply"] === "1") {
                $("#reply_modal > div > div > div.modal-header > h4").text("回复");
                //从服务器获取推荐回复
                $.get(
                    "post_reply/",
                    {
                        fid: posts_data[index]["fid"],
                        tid: posts_data[index]["tid"]
                    }, function (data) {
                        $("#label_tab").find("a[href='#tab_" + data["label_reco"] + "']").tab('show');
                        $("[data-type='reply_show']").html("");
                        var $div = $("#reply_show_" + data["label_reco"]);
                        //动态设置推荐回复
                        $div.innerHTML = "";
                        for (i in data["reply_reco"]) {

                            if (0 === i || i === 4) {
                                console.log(i);
                                $div.get(0).innerHTML += '<div class="row">';
                            }
                            $div.get(0).innerHTML += '<div class="col-md-4" href="javascript:void(0)">\n' +
                                '                                                <div name="one_replay" class="thumbnail" style="cursor:pointer">\n' +
                                '                                                    <div class="caption">\n' +
                                parser2.UBBtoHTML(data["reply_reco"][i]) +
                                '                                                    </div>\n' +
                                '                                                </div>\n' +
                                '                                            </div>';
                            if (i === 3 || i === 7) {
                                $div.get(0).innerHTML += '</div>';
                            }
                        }
                        $("[name='one_replay']").on('click', function (e) {
                            $("#reply_input").val(parser2.HTMLtoUBB($(this).children().get(0)));

                        })
                    }
                )
            }
            else {
                $("[data-type='reply_show']").html("");
                $("#reply_modal > div > div > div.modal-header > h4").text("回复（暂无推荐回复及分类）");
            }
        })
    })

}
//加载页面时候马上获取帖子列表
refresh_post();
//点击获取帖子时候刷新帖子列表
$("#get_post").on("click", refresh_post);
//点击提交按钮
$("#submit").on('click', function (e) {
    var ban_list = [];
    var open_list = [];
    //分别获取屏蔽和不需要屏蔽的帖子
    $("html, body").animate({scrollTop: "0px"}, 1000);
    for (i in posts_data) {
        if (posts_data[i]["ischecked"] === true) {
            ban_list.push(posts_data[i])
        } else {
            open_list.push(posts_data[i])
        }
    }
    $.post(
        'monitor_post/',
        {
            data: JSON.stringify({
                ban_list: ban_list,
                open_list: open_list
            })
        },
        function (data) {

            refresh_post();
            refresh_post_num()

        }
    )
});
//点击模态框中的回复
$("#reply").on('click', function (e) {
    var post_data = $(this).data("post_data");
    var $a = $("#label_tab").find("> li.active > a");
    var label_id = $a.attr("data-id");
    //向平台记录信息
    //TODO:检查没选择label，现在没选择label会出错但页面提示
    $.post(
        'post_reply/',
        {
            post_data: JSON.stringify(post_data),
            label: label_id,
            reply: $("#reply_input").val()
        }, function (data) {

        }
    )
});
//选择快捷回复的时候将数据添加到回复框
$("[name='quick_reply']").on('change', function (e) {
    $("#reply_input").val($(this).val())
});
$("#overlook").on("click", function (e) {
    $.post('overlook/',
        {
            desc: $("#overlook_desc").val()
        }, function (data) {
            flash("info", data["message"]);
            refresh_post_num()
        })
});
//滚动到顶部
$("#to_top").on('click', function (e) {
    $("html, body").animate({scrollTop: "0px"}, 2000);
});
$("#label_tab > li > a").on('click', function (e) {
    var id = $(this).attr("data-id");
    $("#reply_input").val($("#tab_" + id + " > div:nth-child(1) > div.col-md-10 > select").val())
});