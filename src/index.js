// 引入虚拟dom属性和渲染功能文件
var virtualDOM = require('./virtualDOM');
// 引入原始dom到改变后dom的操作步骤
var diff = require('./diff');
// // 引入执行dom改变的文件
var patch = require('./patch');

// 定义一个改变之前的dom
var beforeVirtualDom = virtualDOM('div', { 'id': 'container' }, [
    virtualDOM('h1', { style: 'color:red' }, ['simple virtual dom']),
    virtualDOM('p', ['hello world']),
    virtualDOM('ul', [virtualDOM('li', ['item #1']), virtualDOM('li', ['item #2'])]),
]);
// 对dom进行渲染成真实dom
var rootnode = beforeVirtualDom.render();
// 在文档中进行操作
document.body.appendChild(rootnode);

// // 定义一个新dom
var afterVirtualDom = virtualDOM('div', { 'id': 'container' }, [
	virtualDOM('h2', ['123']),
    virtualDOM('h3', ['456']),
    virtualDOM('h5', { 'class': 'hello' }, ['simple']),
    virtualDOM('p', ['hello world']),
    virtualDOM('ul', [virtualDOM('li', ['item #1']), virtualDOM('li', ['item #2']), virtualDOM('li', ['item #3'])])
]);
// 获取旧dom到新dom的操作步骤
var patches = diff(beforeVirtualDom, afterVirtualDom);
// 执行改变
patch(rootnode, patches);