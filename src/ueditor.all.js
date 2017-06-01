/*!
 * UEditor
 * version: ueditor
 * build: <%=new Date%>
 */
 (function () {
    <%
    var fs = require('fs');
    var path = require('path');
    var base = request.util.conf.root;
    var read = function (url) {
        return fs.readFileSync(path.join(base, url))
            .toString()
            .replace(/[\n\r]+/g, '\\n')
            .replace(/'/g, "\\'");
        }
    %>
    var iframeUrlDocMap = {
        'dialogs/anchor/anchor.html': '<%=read("dialogs/anchor/anchor.html")%>',
        'dialogs/image/image.html': '<%=read("dialogs/image/image.html")%>',
        'dialogs/link/link.html': '<%=read("dialogs/link/link.html")%>',
        'dialogs/spechars/spechars.html': '<%=read("dialogs/spechars/spechars.html")%>',
        'dialogs/searchreplace/searchreplace.html': '<%=read("dialogs/searchreplace/searchreplace.html")%>',
        'dialogs/map/map.html': '<%=read("dialogs/map/map.html")%>',
        'dialogs/video/video.html': '<%=read("dialogs/video/video.html")%>',
        'dialogs/help/help.html': '<%=read("dialogs/help/help.html")%>',
        'dialogs/emotion/emotion.html': '<%=read("dialogs/emotion/emotion.html")%>',
        'dialogs/wordimage/wordimage.html': '<%=read("dialogs/wordimage/wordimage.html")%>',
        'dialogs/attachment/attachment.html': '<%=read("dialogs/attachment/attachment.html")%>',
        'dialogs/insertframe/insertframe.html': '<%=read("dialogs/insertframe/insertframe.html")%>',
        'dialogs/table/edittip.html': '<%=read("dialogs/table/edittip.html")%>',
        'dialogs/table/edittable.html': '<%=read("dialogs/table/edittable.html")%>',
        'dialogs/table/edittd.html': '<%=read("dialogs/table/edittd.html")%>',
        'dialogs/scrawl/scrawl.html': '<%=read("dialogs/scrawl/scrawl.html")%>',
        'dialogs/music/music.html': '<%=read("dialogs/music/music.html")%>',
        'dialogs/template/template.html': '<%=read("dialogs/template/template.html")%>'
    };
<%
    var paths  = @import "api.js";
    var package = @import "package.json";
    var root = path.join(base, request.$.title, '../_src/');
    for (var i=0,pi;pi = paths[i++];) {
        var txt = fs.readFileSync(path.join(root, pi)).toString();
        switch (pi) {
            case 'editor.js':
                txt = txt.replace(/([\s\t]+version\:)[\d\.\'\"]+/, '$1"' + package.version + '"');
                break;
            case 'adapter/editor.js':
                txt = txt.replace('_css', 'css');
                break;
        }
        __p += '\n\n\/\/ ' + pi + '\n' + txt;
    }

%>
})();
