(function() {
  window.addEventListener('load', function() {
    var vizData = {};

    function processMatches(matches) {
      for (var i = 0; i < matches.length; i++) {
        var match = matches[i];
        var name = matches[i].innerHTML, perf, value;
        if (match.previousSibling.previousSibling.classList.contains('mrPerc'))
          perc = match.previousSibling.previousSibling.textContent;
        if (match.previousSibling.previousSibling.previousSibling.previousSibling.classList.contains('mrValue'))
          value = match.previousSibling.previousSibling.previousSibling.previousSibling.textContent;
        perc = perc.substr(1, perc.indexOf('%')-1);
        name = [name, ' (', value, ')'].join('');
        vizData[name] = Math.round(perc);
      }
    }

    processMatches(document.querySelectorAll('span[class~="mrName"][title*="compartment("]'));
    processMatches(document.querySelectorAll('span[class~="mrName"][title*="shell("]'));

    // clear previous content
    var linkEls = document.querySelectorAll('link');
    for (var i = 0; i < linkEls; i++)
      linkEls[i].parent.removeChild(linkEls[i]);
    document.body.innerHTML = '';
    var linkEl = document.createElement('style');
    linkEl.innerHTML += 'html { -moz-padding-start: 0; padding: 0px; background: none; border: 0; margin: 0; min-width: 0; max-width: 0;}';
    linkEl.innerHTML += 'body { -moz-padding-start: 0; padding: 2px; background: none; border: 0; border-radius: 0; margin: 0; min-width: 0; max-width: 0;}';
    document.body.appendChild(linkEl);

    var data = { Compartments: vizData };

    // TODO: handle window resize
    var windowDelta = 10;
    var w = window.innerWidth - 6;
        h = window.innerHeight - 8;
        color = d3.scale.category20c();

    // new treemap
    var treemap = d3.layout.treemap()
        .size([w, h])
        .children(function(d) { return isNaN(d.value) ? d3.entries(d.value) : null; })
        .value(function(d) { return d.value; })
        .sticky(true);

    // make container element
    var chart = document.body.appendChild(document.createElement('div'));
    chart.id = 'chart';

    // treemap cell styles
    var style = document.body.appendChild(document.createElement('style'));
    style.innerHTML = '.cell { font: 1.5em bold; overflow: hidden; position: absolute; text-indent: 2px; word-wrap: break-word; }';

    // div containing treemap
    var div = d3.select("#chart").append("div")
        .style("position", "relative")
        .style("width", w + "px")
        .style("height", h + "px");

    function cell() {
      this
          .style("left", function(d) { return d.x + "px"; })
          .style("top", function(d) { return d.y + "px"; })
          .style("width", function(d) { return d.dx - 1 + "px"; })
          .style("height", function(d) { return d.dy - 1 + "px"; });
    }

    div.data(d3.entries(data))
      .selectAll("div")
      .data(treemap)
      .enter()
      .append("div")
      .attr("class", "cell")
      .style("background", function(d) {
        return color(d.data.key);

        /*
        if (linkData[d.data.key] && linkData[d.data.key].image) {
          return 'url("' + linkData[d.data.key].image + '")';
        }
        else {
          if (linkData[d.data.key]) {
            var node = this;
            fetchImage(linkData[d.data.key].url, function(imageURL) {
              node.style.backgroundImage = 'url("' + imageURL + '")';
            });
          }
          return color(d.data.key);
        }
        */
      })
      .call(cell)
      .text(function(d) { return d.children ? null : d.data.key; })
      .on('click', function(d, index) {
        //self.port.emit('navigateTo', linkData[d.data.key].url);
      });

    /*
    d3.select("#size").on("click", function() {
      div.selectAll("div")
          .data(treemap.value(function(d) { return d.value; }))
        .transition()
          .duration(1500)
          .call(cell);

      d3.select("#size").classed("active", true);
      d3.select("#count").classed("active", false);
    });

    d3.select("#count").on("click", function() {
      div.selectAll("div")
          .data(treemap.value(function(d) { return 1; }))
        .transition()
          .duration(1500)
          .call(cell);

      d3.select("#size").classed("active", false);
      d3.select("#count").classed("active", true);
    });
    */
  });
})();
