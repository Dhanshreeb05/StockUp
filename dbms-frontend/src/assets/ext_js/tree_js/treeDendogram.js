function createTreeMap(treeData, location, highlightData, statusClosed) {
  debugger;
  // Set the dimensions and margins of the diagram
  var margin = { top: 0, right: 0, bottom: 0, left: 0 },
    width = 1200 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  d3.select(location).select("svg").remove();

  var svg = d3
    .select(location)
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .call(
      d3
        .zoom()
        .scaleExtent([0.7, 2])
        .on("zoom", function () {
          svg.attr("transform", d3.event.transform);
        })
    )
    .append("g")
    .attr("transform", "translate(90, 280) scale(0.9)")
    .append("g");

  var i = 0,
    duration = 750,
    root;

  // declares a tree layout and assigns the size
  var treemap = d3
    .tree()
    .size([height, width])
    .nodeSize([15])
    .separation(function separation(a, b) {
      return a.parent == b.parent ? 3 : 5;
    });
  // Assigns parent, children, height, depth
  root = d3.hierarchy(treeData, function (d) {
    return d.children;
  });
  root.x0 = height / 2;
  root.y0 = 0;

  // Collapse after the second level
  root?.children?.forEach(collapse);
  expand(root?.children?.[0]);

  update(root);
  console.log(root);
  // Collapse the node and all it's children
  function collapse(d) {
    //  console.log(d);
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  function expand(d) {
    console.log(d.data.idLists);
    console.log(d.data.name);
    if (d?._children) {
      d.children = d._children;
      expand(d.children[0]);
      d._children = null;
    }
  }

  function update(source) {
    // treemap = d3.tree().size([height, width]);
    treemap = d3
      .tree()
      .size([height, width])
      .nodeSize([15])
      .separation(function separation(a, b) {
        return a.parent == b.parent ? 2 : 3;
      });

    // Assigns the x and y position for the nodes
    var treeData = treemap(root);

    // Compute the new tree layout.
    var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach(function (d) {
      d.y = d.depth * 180;
    });

    // ****************** Nodes section ***************************

    // Update the nodes...
    var node = svg.selectAll("g.node").data(nodes, function (d) {
      return d.id || (d.id = ++i);
    });

    // Enter any new modes at the parent's previous position.
    var nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on("click", click);

    // Add Circle for the nodes
    nodeEnter
      .append("circle")
      .attr("class", "node")
      .attr("r", 1e-6)
      .style("fill", function (d) {
        return d._children ? "rgb(139, 195, 74)" : "white";
      });

    // Add labels for the nodes
    nodeEnter
      .append("text")
      .attr("dy", ".35em")
      .attr("x", function (d) {
        return d.children || d._children ? -13 : 13;
      })
      .attr("text-anchor", function (d) {
        return d.children || d._children ? "end" : "start";
      })
      .text(function (d) {
        return d.data.name;
      })
      .style("fill", function (d) {
        if (
          d.data.children &&
          d.data.children.length > 1 &&
          d.data.children[1].name.startsWith("No. of authors")
        ) {
          return d.data.children[1].name != "No. of authors : 1"
            ? "red"
            : "black";
        }

        if (d.depth == 1 && highlightData !== "" && statusClosed !== "") {
          var level1child = d.children || d._children;
          for (var i = 0; i < level1child.length; i++) {
            child = level1child[i];
            if (child.data.name.includes("Status")) {
              var level2child = child.children || child._children;
              if (level2child) {
                for (var j = 0; j < level2child.length; j++) {
                  child = level2child[j];
                  var statusArray = statusClosed.split(",");
                  for (var k = 0; k < statusArray.length; k++) {
                    if (child.data.name.includes(statusArray[k])) {
                      var statusCheck = false;
                      break;
                    } else {
                      var statusCheck = true;
                    }
                  }
                }
              }
            }
            if (child.data.name.includes("Severity") && statusCheck) {
              var level2child = child.children || child._children;
              if (level2child) {
                for (var j = 0; j < level2child.length; j++) {
                  child = level2child[j];
                  if (child.data.name.includes(highlightData)) {
                    return "red";
                  }
                }
              }
              break;
            }
          }
        }
      });

    // UPDATE
    var nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate
      .transition()
      .duration(duration)
      .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    // Update the node attributes and style
    nodeUpdate
      .select("circle.node")
      .attr("r", 10)
      .attr("stroke", function (d) {
        return d._children ? "rgb(139, 195, 74)" : "grey";
      })
      .style("fill", function (d) {
        return d._children ? "rgb(139, 195, 74)" : "white";
      })
      .attr("cursor", "pointer");

    // Remove any exiting nodes
    var nodeExit = node
      .exit()
      .transition()
      .duration(duration)
      .attr("transform", function (d) {
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select("circle").attr("r", 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select("text").style("fill-opacity", 1e-6);

    // ****************** links section ***************************

    // Update the links...
    var link = svg.selectAll("path.link").data(links, function (d) {
      return d.id;
    });

    // Enter any new links at the parent's previous position.
    var linkEnter = link
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("d", function (d) {
        var o = { x: source.x0, y: source.y0 };
        return diagonal(o, o);
      });

    // UPDATE
    var linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate
      .transition()
      .duration(duration)
      .attr("d", function (d) {
        return diagonal(d, d.parent);
      });

    // Remove any exiting links
    var linkExit = link
      .exit()
      .transition()
      .duration(duration)
      .attr("d", function (d) {
        var o = { x: source.x, y: source.y };
        return diagonal(o, o);
      })
      .remove();

    // Store the old positions for transition.
    nodes.forEach(function (d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {
      path = `M ${s.y} ${s.x}
        C ${(s.y + d.y) / 2} ${s.x},
          ${(s.y + d.y) / 2} ${d.x},
          ${d.y} ${d.x}`;

      return path;
    }

    // Toggle children on click.
    function click(d) {
      //if (!d.children && !d._children) {
      console.log(d);
      let event = new CustomEvent("TreeMapClickEvent", { detail: d });
      window.dispatchEvent(event);
      //}
      if (d.children) {
        // height = height - (d.children.length - 1) * 10;
        d._children = d.children;
        d.children = null;
      } else if (d._children) {
        // height = height + (d._children.length - 1) * 10;
        d.children = d._children;
        d._children = null;
      }
      update(d);
    }
  }
}
