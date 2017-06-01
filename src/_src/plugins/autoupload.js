/**
 * @description
 * 1.拖放文件到编辑区域，自动上传并插入到选区
 * 2.插入粘贴板的图片，自动上传并插入到选区
 * @author Jinqn
 * @date 2013-10-14
 */
UE.plugin.register('autoupload', function (){

    /*
    * @description
    * 1, 单独处理百度hi（mac版本）无文件类型的图片
    * 2, 百度hi修复该BUG后需要重新迭代该代码
    * @author Hu Likui
    * @data 2017-05-02
    * */

    var self = this;
    var allowImg = ["png", "jpg", "jpeg", "gif", "bmp"];

    function handleFiles(files){
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var img = document.createElement("img");
            img.classList.add("obj");
            img.file = file;
            self.body.appendChild(img);

            var reader = new FileReader();
            reader.onload = (function(aImg){
                return function(e){
                    if(e.target.result.match(/;base64/)){
                        aImg.src = e.target.result;
                    }else{
                        img = null;
                    }
                };
            })(img);
            reader.readAsDataURL(file);
        }
    }

    function getPasteImage(e){
        //单独处理粘贴图片safari事件
        if(browser.mac && !!browser.safari && e.clipboardData && e.clipboardData.types && e.clipboardData.types[1] == 'image/tiff'){
            var nameArray = e.clipboardData.files && e.clipboardData.files['0'] && e.clipboardData.files['0'].name.split('.');
            if(nameArray && nameArray.length > 0 && allowImg.indexOf(nameArray[nameArray.length-1]) == -1){
                handleFiles(e.clipboardData.files);
            }
            return e.clipboardData.files;

        }
        //单独处理粘贴图片火狐事件
        if(browser.mac && !!browser.firefox){
            return e.clipboardData.items;
        }
        return e.clipboardData && e.clipboardData.items && e.clipboardData.items.length == 1 && /^image\//.test(e.clipboardData.items[0].type) ? e.clipboardData.items:null;
    }

    function isConvert2Image(e) {
        var nameArray = e.dataTransfer.files && e.dataTransfer.files['0'] && e.dataTransfer.files['0'].name.split('.');
        return nameArray && nameArray.length > 0 && allowImg.indexOf(nameArray[nameArray.length-1]) == -1;

    }

    function handleMacDropImage(e) {
        //单独处理拖放图片safari事件
        if(browser.mac && !!browser.safari && e.dataTransfer && e.dataTransfer.types && e.dataTransfer.types[1] == 'image/tiff'){
            if(isConvert2Image(e)){
                handleFiles(e.dataTransfer.files);
            }
        }
        //单独处理拖放图片chrome事件
        if(browser.mac && (!!browser.chrome) && e.dataTransfer && e.dataTransfer.types && e.dataTransfer.types[0] == 'Files'){
            if(isConvert2Image(e)){
                handleFiles(e.dataTransfer.files);
            }

        }
        //单独处理拖放图片firefox事件
        if(browser.mac && (!!browser.firefox) && e.dataTransfer && e.dataTransfer.types && e.dataTransfer.types[1] == 'Files'){
            if(isConvert2Image(e)){
                handleFiles(e.dataTransfer.files);
            }
        }
    }

    function getDropImage(e){
        handleMacDropImage(e);
        return  e.dataTransfer && e.dataTransfer.files ? e.dataTransfer.files:null;
    }

    return {
        outputRule: function(root){
            utils.each(root.getNodesByTagName('img'),function(n){
                if (/\b(loaderrorclass)|(bloaderrorclass)\b/.test(n.getAttr('class'))) {
                    n.parentNode.removeChild(n);
                }
            });
            utils.each(root.getNodesByTagName('p'),function(n){
                if (/\bloadpara\b/.test(n.getAttr('class'))) {
                    n.parentNode.removeChild(n);
                }
            });
        },
        bindEvents:{
            defaultOptions: {
                //默认间隔时间
                enableDragUpload: true,
                enablePasteUpload: true
            },
            //插入粘贴板的图片，拖放插入图片
            'ready':function(e){
                var me = this;
                if(window.FormData && window.FileReader) {
                    var handler = function(e){
                        var hasImg = false,
                            items;
                        //获取粘贴板文件列表或者拖放文件列表
                        items = e.type == 'paste' ? getPasteImage(e):getDropImage(e);
                        if(items){
                            var len = items.length,
                                file;
                            while (len--){
                                file = items[len];
                                if(file.getAsFile) file = file.getAsFile();
                                if(file && file.size > 0) {
                                    UE.utils.sendAndInsertFile(file, me);
                                    hasImg = true;
                                }
                            }
                            hasImg && e.preventDefault();
                        }

                    };

                    if (me.getOpt('enablePasteUpload') !== false) {
                        domUtils.on(me.body, 'paste ', handler);
                    }
                    if (me.getOpt('enableDragUpload') !== false) {
                        domUtils.on(me.body, 'drop', handler);
                        //取消拖放图片时出现的文字光标位置提示
                        domUtils.on(me.body, 'dragover', function (e) {
                            if(e.dataTransfer.types[0] == 'Files') {
                                e.preventDefault();
                            }
                        });
                    } else {
                        if (browser.gecko) {
                            domUtils.on(me.body, 'drop', function(e){
                                if (getDropImage(e)) {
                                    e.preventDefault();
                                }
                            });
                        }
                    }

                    //设置loading的样式
                    utils.cssRule('loading',
                        '.loadingclass{display:inline-block;cursor:default;background: url(\''
                            + this.options.themePath
                            + this.options.theme +'/images/loading.gif\') no-repeat center center transparent;border:1px solid #cccccc;margin-left:1px;height: 22px;width: 22px;}\n' +
                            '.loaderrorclass{display:inline-block;cursor:default;background: url(\''
                            + this.options.themePath
                            + this.options.theme +'/images/loaderror.png\') no-repeat center center transparent;border:1px solid #cccccc;margin-right:1px;height: 22px;width: 22px;' +
                            '}',
                        this.document);
                }
            }
        }
    }
});