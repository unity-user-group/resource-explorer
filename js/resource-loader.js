/* 
* VARIABLES
********************************************************************************/
const sourceUrl =
  "https://raw.githubusercontent.com/unity-user-group/resources/master/data.yaml";
const search = document.getElementById("search");
const header = document.getElementById("header");
const footer = document.getElementById("footer");
const scrollArea = document.getElementById("scrollArea");

let clusterize = undefined;
let tableRows = [];

/* 
* METHODS
********************************************************************************/
const updateTableHeight = function() {
  const newHeight =
    window.innerHeight - (header.clientHeight + footer.clientHeight);
  scrollArea.style.maxHeight = `${newHeight}px`;
};

const retrieveData = function(url) {
  const defer = $.Deferred();
  $.get(url, data => defer.resolve(jsyaml.load(data)));
  return defer;
};

const onSearch = function() {
  const filtered = [];

  if (search === "" || search === undefined) {
    filtered.push.apply(tableRows);
  } else {
    for (i = 0; i < tableRows.length; i++) {
      if (tableRows[i].toString().indexOf(search.value) + 1) {
        filtered.push(tableRows[i]);
      }
    }
  }

  clusterize.update(filtered);
};

const createTableRows = function(resource) {
  return `<div class="resource">
            <h2 class="title">${resource.name} : <a class="link" href="${resource.url}">link</a></h2>
            <h4 class="tags">tags: ${resource.tags ? resource.tags.join(", ") : ""}</h4>
            <p class="description">${resource.description}</p>
          </div>`;
};

const processLoadedData = function(resourcesArray) {
  // create rows for the table
  tableRows = $.map(resourcesArray, value => createTableRows(value));
  clusterize.update(tableRows);
};


/* 
* START
* when page has loaded, create table
********************************************************************************/
$(document).ready(function() {
  // init table
  clusterize = new Clusterize({
    rows: [],
    scrollId: "scrollArea",
    contentId: "contentArea"
  });

  retrieveData(sourceUrl).then(data => processLoadedData(data));

  // when the window resizes, update table height
  window.onresize = () => updateTableHeight();

  // handle on search input change
  search.oninput = onSearch;

  // adjust table height to match window size
  updateTableHeight();
});
