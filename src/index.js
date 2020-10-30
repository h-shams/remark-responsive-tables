const visit = require("unist-util-visit");

module.exports = md;

function md(options) {
  const { classnames } = options;

  const classMobile = `${classnames.description} ${classnames.mobile}`;

  const classDesktop = `${classnames.description} ${classnames.desktop}`;

  return function transformer(tree, file) {
    let headers;

    visit(tree, "tableRow", visitor);

    function visitor(node, index, parent) {
      if (node.type === "tableRow" && index === 0) {
        // thead
        headers = node.children.map(header => typeof header.children[0] !== 'undefined' ? header.children[0].value : '');
      }

      // tbody rows
      if (index !== 0) {
        node.children = node.children.map( (tableCell, i) => {
          if(i !== 0){
            return {
              ...tableCell,
              data: {
                hProperties: {
                  className: classDesktop
                }
              }
            }
          }else{
            return {
              ...tableCell
            }
          }
        })

        node.children[0].children = [
          {
            type: "div",
            children: headers.map(header => {
              return {
                type: "paragraph",
                children: [
                  {
                    type: "text",
                    value: header
                  }
                ]
              };
            }),
            data: {
              hProperties: {
                className: classnames.title
              }
            }
          },
          {
            type: "div",
            children: node.children.map( (tableCell, i) => {
              const object = {
                type: 'paragraph',
                ...tableCell
              }

              if(i !== 0){
                object.data = {
                  hProperties: {
                    className: classMobile
                  }
                }
              }

              return object
            }),
            data: {
              hProperties: {
                className: classnames.content
              }
            }
          }
        ];
      }
    }
  };
}
