var tree = {
    name: "A0",
    children: [
            {
                name: 'A1.1',
                children: [{
                    name: 'A1.1.1',
                    children: []
                }]
            },
            { 
                name: 'A1.2',
                children: [
                    {
                        name: 'A1.2.1',
                        children: []
                    },
                    {
                        name: 'A1.2.2',
                        children : [
                            {
                                name: 'A1.2.2.1',
                                children: []
                            },
                            {
                                name: 'A1.2.2.2',
                                children: []
                            }
                        ]
                    }
                ]
            }
        ]
};

// function deepTraversal(node, nodes){
    
//     if(node!=null){
//         nodes.push(node);
       
//         let childrens=node.children;
//         for(let i=0;i<childrens.length;i++)
//             deepTraversal(childrens[i], nodes);
//     }
//     return nodes;
// }

function deepTraversal(node) {
    var nodes = [];
    if (node != null) {
      var stack = [];
      stack.push(node);
      while (stack.length != 0) {
        var item = stack.pop();
        nodes.push(item);
        var children = item.children;
        for (var i = children.length - 1; i >= 0; i--)
          stack.push(children[i]);
      }
    }
    return nodes;
  }

// function wideTraversal(selectNode) {
//       var nodes = [];
//       if (selectNode != null) {
//         var queue = [];
//         queue.unshift(selectNode);
//         while (queue.length != 0) {
//           var item = queue.shift();
//           nodes.push(item);
//           var children = item.children;
//           for (var i = 0; i < children.length; i++)
//             queue.push(children[i]);
//         }
//       }
//       return nodes;
//     }

console.log('xxxx', deepTraversal(tree, []));

export default {

}