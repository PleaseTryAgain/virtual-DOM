var listDiff = require('list-diff2');

var diff = function (beforeDOM, afterDOM) {
	var index = 0;
	var patches = {};
	dfsWalk(beforeDOM, afterDOM, index, patches);
	return patches;
}

function dfsWalk(beforeDOM, afterDOM, index, patches) {
	var currentPatches = [];
	// 1.根节点为字符串 2.根节点为标签 相等 3.其余情况
	if (Object.prototype.toString.call(beforeDOM) === '[object String]' && Object.prototype.toString.call(afterDOM) === '[object String]' ) {
		// 都是string类型，且不一样直接替换
		if (beforeDOM !== afterDOM) {
			currentPatches.push({type: 3, content: afterDOM });
		}
	} else if (beforeDOM.tagName === afterDOM.tagName) {
		// 属性是否相同
		var propsPatches = diffProps(beforeDOM, afterDOM)
		if(propsPatches) {
			currentPatches.push({type: 2, props: propsPatches})
		}

		// 子元素是否相同
		diffChildren(beforeDOM.children, afterDOM.children, index, patches, currentPatches);

	} else {
		// 根节点类型不一致 或 类型一致为不同标签
		currentPatches.push({type: 0, node: afterDOM});
	}

	// 如果有变动记录变动的节点 节点在旧节点的步骤
    if (currentPatches.length) {
        patches[index] = currentPatches;
    }
}

function diffProps(beforeDOM, afterDOM) {
	var beforeProps = beforeDOM.props;
	var afterProps = afterDOM.props;
	var propsPatches = {}, propName;
	// 以之前属性为循环，不相等就记录
	for (propName in beforeProps) {
		if (beforeProps[propName] != afterProps[propName]) {
			propsPatches[propName] = afterProps[propName];
		}
	};
	// 以新属性为循环，旧属性不存在就记录，是新增属性
	for (propName in afterProps) {
		if ( !beforeProps.hasOwnProperty(propName) ) {
			propsPatches[propName] = afterProps[propName];
		}
	};

	return propsPatches ? propsPatches : null ;
}

function diffChildren(beforeChildren, afterChildren, index, patches, currentPatches) {
	var diffs = listDiff(beforeChildren, afterChildren, 'key');
	afterChildren = diffs.children;

	if(diffs.moves.length) {
		currentPatches.push({type: 1, moves: diffs.moves});
	}

	var leftNode = null;
    var currentNodeIndex = index;
    // 以旧节点为循环，递归执行，主要判断子节点的子节点和子节点与新节点，并添加编号
    beforeChildren.forEach((child, index) => {
    	var newChild = afterChildren[index];
    	currentNodeIndex = (leftNode && leftNode.count) ? currentNodeIndex + leftNode.count + 1 : currentNodeIndex + 1;
    	dfsWalk(child, newChild, currentNodeIndex, patches);
    	leftNode = child;
    })
}

// 导出diff
module.exports = diff;