let newProjectForm = $('#projectForm');

newProjectForm.submit(function(event){
    event.preventDefault();
    let form = new FormData((newProjectForm)[0]);

    $.ajax({
        type: 'post',
        url: '/createProject',
        data: newProjectForm.serialize(),
        success: function(data){
            console.log(data.data.message);
        },
        error: function(error){
            console.log(error.responseText);
        }
    });
    $('#projectForm')[0].reset();
});

let projectDtls = function(){
    let projectItem = document.querySelectorAll('.projectItem');
    let dynamicSectionTemp = document.querySelectorAll('.dynamicSection');
    for(let i = 0; i < projectItem.length; i++){
        projectItem[i].onclick = function(event){
            event.preventDefault();
            let projectDtlsDiv = $('#projectDetailsSection');
            let k = 0;
            while(k < dynamicSectionTemp.length){
                if(dynamicSectionTemp[k].id == 'projectDetailsSection'){
                    dynamicSectionTemp[k].className = 'dynamicSection active';
                }
                else{
                    dynamicSectionTemp[k].className = 'dynamicSection';
                }
                k++;
            }
            $.ajax({
                type: 'GET',
                url: $(projectItem[i]).attr('href'),
                success: function(data){
                    document.title = `Issue Tracker | ${data.data.title}`;
                    let project = data.data.project;
                    projectDtlsDiv.empty();
                    projectDtlsDiv.append(projectDtlsDom(project));
                    let issueListDiv = $('#issueListDiv');
                    let issues = project.issues;
                    issues.map((issue)=>{issueListDiv.append(issueDom(issue))});
                    createIssue();
                    deleteIssue();
                    getFilterResponse();
                    getSearchResponse();
                    resetForm();

                    $("#issueAuthor option").each(function() {
                        $(this).siblings('[value="'+ this.value +'"]').remove();
                      });
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
        }
    }
}

let projectDtlsDom = function(project){
    return `<div id="projectDtlsDiv">
    <div id="projectLeftDiv">
        <div id="projectDtls">
            <h2>${project.projectName}</h2>
            <p>${project.description}</p>
            <p>-${project.author}</p>
        </div>
        <br>
        <h3>Create Issue</h3>
        <form id="issueForm" action="/createIssue" autocomplete="off" method="post">
            <input type="hidden" name="project" id="project" value=${project._id} />
            <label for="projectName">Title</label>
            <br>
            <input type="text" name="title" id="title" placeholder="Title" required />
            <br>
            <label for="description">Description</label>
            <br>
            <textarea rows="4" type="text" name="description" id="description" placeholder="Description" required></textarea>
            <br>
            <label for="author">Author</label>
            <br>
            <input type="text" name="author" id="author" placeholder="Author" required />
            <br>
            <label>Labels</label>
            <br>
            <input type="checkbox" name="labels" id="bug" value="Bug" />
            <label for="bug">Bug</label>
            <input type="checkbox" name="labels" id="ui" value="UI Improvement" />
            <label for="ui">UI Improvement</label>
            <input type="checkbox" name="labels" id="doc" value="Documentation" />
            <label for="doc">Documentation</label>
            <input type="checkbox" name="labels" id="enhancement" value="Enhancement" />
            <label for="enhancement">Enhancement</label>
            <input type="checkbox" name="labels" id="duplicate" value="Duplicate" />
            <label for="duplicate">Duplicate</label>
            <br>
            <button type="submit" id="createIssueBtn" class="submitBtn">Submit</button>
        </form>
    </div>
    <div id="projectRightDiv">
        <div id="filterSearchTab">
            <div class="projectIssueTitleDiv" id="filterTab" onclick="fnActiveTab(this);">
                <ion-icon name="options-outline"></ion-icon>&ensp;<h4>Filter</h4>
            </div>
            <div class="projectIssueTitleDiv" id="searchTab" onclick="fnActiveTab(this);">
                <ion-icon name="search-outline"></ion-icon>&ensp;<h4>Search</h4>
            </div>
        </div>
        <br>
        <div id="filterDiv" style="display:none;">
            <form id="projectFilterForm" action="/filterIssues" autocomplete="off" method="get">
                <input type="hidden" name="filterProject" id="filterProject" value=${project._id} />
                <label>Labels</label>
                <br>
                <input type="checkbox" name="issueLabels" id="issueBug" value="Bug" />
                <label for="issueBug">Bug</label>
                <input type="checkbox" name="issueLabels" id="issueUi" value="UI Improvement" />
                <label for="issueUi">UI Improvement</label>
                <input type="checkbox" name="issueLabels" id="issueDoc" value="Documentation" />
                <label for="issueDoc">Documentation</label>
                <input type="checkbox" name="issueLabels" id="issueEnhancement" value="Enhancement" />
                <label for="issueEnhancement">Enhancement</label>
                <input type="checkbox" name="issueLabels" id="issueDuplicate" value="Duplicate" />
                <label for="issueDuplicate">Duplicate</label> 
                <br>
                <label for="author">Author</label>
                <br>
                <select name="issueAuthor" id="issueAuthor">
                    <option value="-1">Please select</option>
                    ${project.issues.map((issue) => (
                        `<option value="${issue.author}">
                        ${issue.author}
                    </option>`
                    )).join("")}
                </select>
                <br>
                <button type="submit" id="filterBtn" class="submitBtn">Filter</button>
                <button type="reset" id="filterResetBtn" class="submitBtn">Reset</button>
            </form>
        </div> 
        <div id="searchDiv" style="display:none;">
            <form id="projectSearchForm" action="/searchIssues" autocomplete="off" method="get">
                <input type="hidden" name="searchProject" id="searchProject" value=${project._id} />
                <label for="issueTitle">Title</label>
                <br>
                <input type="text" name="issueTitle" id="issueTitle" placeholder="Title" />
                <br>
                <label for="issueDescription">Description</label>
                <br>
                <input type="text" name="issueDescription" id="issueDescription" placeholder="Description" />
                <br>
                <button type="submit" id="searchBtn" class="submitBtn">Search</button>
                <button type="reset" id="searchResetBtn" class="submitBtn">Reset</button>
            </form>
        </div>
        <br>
        <h2>Issues</h2>
        <div id="issueListDiv">
            
        </div>   
    </div>
    </div>`;
}

let issueDom = function(issue){
    return `<div class="projectDtlIssue" id="projectIssueLabel${issue._id}">
                <div class="projectIssueDesc">
                    <h4>${issue.title}</h4>
                    <p>${issue.description}</p>
                    <div class="projectIssueLabelDiv">
                        ${issue.labels.map((label) => (
                            `<div class="projectIssueLabelItem">
                            ${label}
                        </div>`
                        )).join("")}
                    </div>
                    <small>-${issue.author}</small>
                </div>
                <div class="projectIssueFixBtn">
                    <a href="/deleteIssue?issueId=${issue._id}&projectId=${issue.project}" class="fixBtn">Fix</a>
                </div>
            </div>`;
}

function fnActiveTab(tabObj){
    if(tabObj.id === "filterTab"){
        $('#filterTab')[0].className = 'projectIssueTitleDiv active';
        $('#searchTab')[0].className = 'projectIssueTitleDiv';
        $('#filterDiv').show();
        $('#searchDiv').hide();
    }
    else if(tabObj.id === "searchTab"){
        $('#filterTab')[0].className = 'projectIssueTitleDiv';
        $('#searchTab')[0].className = 'projectIssueTitleDiv active';
        $('#filterDiv').hide();
        $('#searchDiv').show();
    }
}

let getFilterResponse = function(){
    let newFilterForm = $('#projectFilterForm');

    newFilterForm.submit(function(event){
        event.preventDefault();
        $.ajax({
            type: 'get',
            url: '/filterIssues',
            data: newFilterForm.serialize(),
            success: function(data){
                $('#issueListDiv').empty();
                let issues = data.data.issues;
                issues.map((issue)=>{$('#issueListDiv').append(issueDom(issue))});
                deleteIssue();
            },
            error: function(error){
                console.log(error.responseText);
            }
        });
    });
}

let getSearchResponse = function(){
    let newSearchForm = $('#projectSearchForm');

    newSearchForm.submit(function(event){
        event.preventDefault();
        $.ajax({
            type: 'get',
            url: '/searchIssues',
            data: newSearchForm.serialize(),
            success: function(data){
                $('#issueListDiv').empty();
                let issues = data.data.issues;
                issues.map((issue)=>{$('#issueListDiv').append(issueDom(issue))});
                deleteIssue();
            },
            error: function(error){
                console.log(error.responseText);
            }
        });
    });
}

let resetForm = function(){
    $('#filterResetBtn,#searchResetBtn').click(function(event){
        event.preventDefault();
        $('#projectFilterForm')[0].reset();
        $('#projectSearchForm')[0].reset();
        let newSearchForm = $('#projectSearchForm');
        
        $.ajax({
            type: 'get',
            url: '/searchIssues',
            data: newSearchForm.serialize(),
            success: function(data){
                $('#issueListDiv').empty();
                let issues = data.data.issues;
                issues.map((issue)=>{$('#issueListDiv').append(issueDom(issue))});
                deleteIssue();
            },
            error: function(error){
                console.log(error.responseText);
            }
        });
    });
}

function commonValidate(fieldArray,lableArray){
    let isValid = true;

    for (let i = 0; i < fieldArray.length; i++) {
        let fieldName = fieldArray[i];
        let fieldLable = lableArray[i];
        let fieldValue = getFieldData(fieldName);

        if (!fieldValue) {
            alert('Please fill in ' + fieldLable + '.');
            isValid = false;
            break; 
        }
    }

    return isValid;
}

function getFieldData(fieldName) {
    var field = $('#' + fieldName);

    if (field.is(':checkbox')) {
        return field.prop('checked');
    } else if (field.is(':radio')) {
        return $('input[name="' + fieldName + '"]:checked').val();
    } else if (field.is('select')) {
        return field.val();
    } else {
        return field.val().trim();
    }
}

projectDtls();