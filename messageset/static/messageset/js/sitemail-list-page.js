/**
 * Created by lyhapple on 15/12/10.
 */

var sitemailListPageVue = new CommonListPageVue({
    el: '#siteMailContentRow',
    data: {
        unReadItemsCount: 0
    },
    ready: function () {
        if (this.appName && this.modelName) {
            this.loadData({'receiver': true});
        }
    },
    methods: {
        inBox: function (event) {
            $(event.target).parent().siblings().removeClass('active');
            $(event.target).parent().addClass('active');
            this.loadData({'receiver': true});
        },
        sendBox: function (event) {
            $(event.target).parent().siblings().removeClass('active');
            $(event.target).parent().addClass('active');
            this.loadData({'sender': true});
        },
        trashBox: function(event){
            $(event.target).parent().siblings().removeClass('active');
            $(event.target).parent().addClass('active');
            this.loadData({'trash': true});
        },
        filterStatus: function (status, event) {
            var self = this, data = {};
            if (status !== -1) {
                data = {'status': status};
            }
            self.loadData(data);
            $(event.target).siblings().removeClass('btn-primary').addClass('btn-link');
            $(event.target).addClass('btn-primary').removeClass('btn-link');
        },
        allStatus: function (event) {
            this.filterStatus(-1, event);
        },
        unReadStatus: function (event) {
            this.filterStatus(0, event);
        },
        readStatus: function (event) {
            this.filterStatus(1, event);
        },
        markAllRead: function () {
            var self = this;
            swal({
                title: "您确定要全部标记为已读吗?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定!",
                cancelButtonText: "取消",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function () {
                $.AdminLTE.apiPatch(
                    Urls['messageset_api:sitemail_markall'](), {},
                    function (resp) {
                        swal({
                            title: "标识更新成功!",
                            type: "success"
                        }, function () {
                            self.loadData({});
                        });
                    }
                );
            });
        }
    }
});

sitemailListPageVue.$watch('items', function (items) {
    if (this.unReadItemsCount === 0) {
        var count = 0;
        $.each(items, function (i, item) {
            if (item.status_value === 0 &&
                item.sender != sitemailListPageVue.userName) {
                count++;
            }
        });
        this.unReadItemsCount = count;
    }
});