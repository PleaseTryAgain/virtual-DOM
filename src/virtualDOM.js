// 构造函数，构造出虚拟dom对象
var virtualDOM = function (tagName, props, children) {
	// 确保通过new关键字创建构造函数进行调用，否则this指向Windows
	// 也可通过调用函数的时候直接new一个构造函数的对象
	if ( !(this instanceof virtualDOM) ){
		return new virtualDOM(tagName, props, children);
	}
	// props为空时可以省略,此时children传到props参数处
	if ( Object.prototype.toString.call(props) === '[object Array]' ) {
		children = props;
		props = {};
	}
	// 构造函数添加参数, 当不传props和children时默认为空
	this.tagName = tagName;
	this.props = props || {};
	this.children = children || [];
}

// 构造函数的原型方法render渲染虚拟dom
virtualDOM.prototype.render = function() {
	// 创建标签
	var element = document.createElement(this.tagName);

	// 添加属性props
	var props = this.props
	for (var propName in props) {
		var propContent = props[propName];
		switch (propName) {
			case 'style': 
				element.style.cssText = propContent;
				break;
			case 'value':
				var tagName = this.tagName || '';
				tagName = tagName.toLowerCase();
				if (tagName === 'input' || tagName === 'textarea') {
					element.value = value
				} else {
					element.setAttribute(propName, propContent)
				}
				break;
			default: 
				element.setAttribute(propName, propContent);
				break;
		}
	}

	// 渲染子元素
	this.children.forEach((child, index) => {
		var childElement = child instanceof virtualDOM ? child.render() : document.createTextNode(child);
		element.appendChild(childElement);
	})

	// 返回渲染后的dom
	return element;
}

// 模块导出构造函数
module.exports = virtualDOM;