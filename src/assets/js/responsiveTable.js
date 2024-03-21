function rsTables(options) {
    let defaultOptions = {
        tableClass: "table",
        breakPoint: 'medium',
        breakPointValues: {
            "x-small": 480,
            "small": 768,
            "medium": 992,
            "large": 1200,
            "x-large": 1400
        },
        mode: 'stack',
        addCustomStyle: false,
        expandFirst: true,
        expandAll: true,
        showToggle: true,
        togglePosition: 'start', // or end or none (which is thesame as showToggle false)
        toggleIconHTML: '<span>dsdsdsds</span>',
        onBreak: () => {},
    }

    // Option Data Sets
    Modes = ['stack', 'swipe', 'collapse']
    Breakpoints = ['all', 'x-small', 'small', 'medium', 'large', 'x-large']

    // Merge custom options to default options
    options = {...defaultOptions, ...options};

    // Check if required options are correct
    (function() {
        if (!Modes.includes(options.mode)) {
            throw `Mode type: '${options.mode}' isn't known. Only ${Modes.toString()} are allowed options`
        }else if (!Breakpoints.includes(options.breakPoint)) {
            throw `Breakpoint: '${options.breakPoint}' isn't known. Only ${Breakpoints.toString()} are allowed options`
        }
    })();

    // Initial Variables
    let _this = this;
    let noResponsiveClass = 'table-no-responsive';
    let tableIndexAttribute = '_table-index';
    let lastNodeIndex = 0;
    let tables = document.querySelectorAll(`table.${options.tableClass}`);

    const styleElm = document.createElement('style');
    document.head.appendChild(styleElm);



    // Get The Breakpoint for The CSS Media Query
    function _getBreakpoint() {
        if (options.breakPoint == 'all') {
            return 999999999999;
        }else if(options.breakPointValues[options.breakPoint]){
            return options.breakPointValues[options.breakPoint]
        }else{
            throw `Breakpoint: '${options.breakPoint}' isn't known. Only ${Breakpoints.toString()} are allowed options`
        }
    }


    // Set The Mode General Style
    function setStyles(style){
        switch (style) {
            case 'stack':
                styleElm.sheet.insertRule(`
                @media screen and (max-width: ${_getBreakpoint()}px) {
                    .${options.tableClass}:not(.${noResponsiveClass}) {
                      display: block;
                      box-shadow: none;
                      min-width: unset;
                      overflow-x: auto;
                    }

                    .${options.tableClass}:not(.${noResponsiveClass}) thead {
                      position: absolute;
                      opacity: 0;
                      display: none;
                    }

                    .${options.tableClass}:not(.${noResponsiveClass}) tbody {
                      display: block;
                      min-width: 16em;
                    }

                    .${options.tableClass}:not(.${noResponsiveClass}) tr {
                      display: block;
                        ${options.addCustomStyle && (`
                            border-bottom: 1px solid;
                            border-top: 0;
                            border-color: inherit;
                            margin-bottom: 7px;
                            padding-bottom: 7px;
                        `)}
                    }

                    .${options.tableClass}:not(.${noResponsiveClass}) tbody tr > * {
                      display: flex;
                      text-align: end;
                    }

                    .${options.tableClass}:not(.${noResponsiveClass}) tbody tr > *::before {
                      display: inline-block;
                      font-weight: bold;
                      margin-right: auto;
                      padding-right: 1em;

                      text-align: start;
                    }
                }
                `, styleElm.sheet.cssRules.length)
                break;

            default:
                break;
        }
    }

    setStyles(options.mode);


    function _stackTable(table, t_index){
        if (table.rows.length == null || table.rows.length == 0) {
            //do empty table rows
          } else {
            let thArray = [];
            const headers = table.querySelectorAll('thead th');
            for (let i = 0; i < headers.length; i++) {
                thArray.push(headers[i].innerText);
            }

            for (let i = 0; i < thArray.length; i++) {
              try {
                styleElm.sheet.insertRule(
                  `
                    @media screen and (max-width: ${_getBreakpoint()}px){
                        .${options.tableClass}[${tableIndexAttribute}="${t_index}"]:not(.${noResponsiveClass}) tbody tr > *:nth-child(${(i + 1)})::before {
                            content:"${thArray[i]}";
                        }
                    }
                  `,
                  styleElm.sheet.cssRules.length
                );
              } catch (error) {
                  throw error
              }
            }

          }

    }

    function _collapseTable(table, t_index){
        table = document.querySelector('table.food');

        // console.log(table.tHead.rows[0].cells);

        let headRows = table.tHead.rows[0].cells;

        let stayIndices = [];

        for (const element of headRows) {
            if (element.attributes['stay']){
                stayIndices.push(element.cellIndex);
            }
        }

        console.log(table);

        let newTable = document.createElement('table');

        newTable.className = table.className

        let oldTableHeader;
        for (const el of table.children) {
            if (el.tagName == "THEAD") {
                oldTableHeader = el;
            }
        }
        console.log(oldTableHeader);
        for(const el of oldTableHeader.rows[0].cells){

        }
        newTable.appendChild(oldTableHeader);

        document.getElementById('body').appendChild(newTable);
    }

    function makeResponsive(el) {
        if (el.classList.contains('table-no-responsive')) {
            return;
        }

        el.setAttribute(tableIndexAttribute, `${lastNodeIndex}`)

        switch (options.mode) {
            case 'stack':
                _stackTable(el, lastNodeIndex);
                break;

            case 'collapse':
                _collapseTable(el, lastNodeIndex);
                break;
            default:
                break;
        }


        lastNodeIndex += 1;
    }

    tables.forEach(el => {
        makeResponsive(el)
    });






    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(function (mutations, observer) {
        let mutationsCount = mutations?.length > 0 ? mutations?.length : false;
        if (mutationsCount && mutations[mutationsCount - 1].addedNodes) {
          mutations.forEach(m => {
            if (m.target.tagName == 'TABLE' && m.target.classList.contains(options.tableClass) && !m.target.getAttribute(tableIndexAttribute)) {
              makeResponsive(m.target)
            }
          })
        }
    });

    // define what element should be observed by the observer
    // and what types of mutations trigger the callback
    observer.observe(document, {
        subtree: true,
        attributes: true,
        childList: true,
        characterData: true,
        attributeOldValue: true,
        attributeFilter: [tableIndexAttribute],
        characterDataOldValue: true
        //...
    });
}
