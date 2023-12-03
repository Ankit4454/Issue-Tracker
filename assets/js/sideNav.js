let toggle = document.querySelector('.toggle');
let navigation = document.querySelector('.navigation');
let heading = document.querySelector('.heading');
let mainSection = document.querySelector('.mainSection');

toggle.onclick = function () {
    toggle.classList.toggle('active');
    navigation.classList.toggle('active');
    heading.classList.toggle('active');
    mainSection.classList.toggle('active');
    debugger;
    if(document.title == `Issue Tracker | Issue Logs`){
        setTimeout(function(){
            $('#issueList').removeData('masonry');
            $('#issueList').masonry({
                itemSelector: '.issueItem',
            });
        }, 200);
    }
}

let list = document.querySelectorAll('.list');
let navLink = document.querySelectorAll('.navLink');
let dynamicSection = document.querySelectorAll('.dynamicSection');
let projectDtlsSection = document.querySelector('#projectDetailsSection');

for (let i = 0; i < list.length; i++) {
    list[i].onclick = function (event) {
        event.preventDefault();
        let j = 0;
        let k = 0;
        while (j < list.length && k < dynamicSection.length) {
            list[j++].className = 'list';
            dynamicSection[k++].className = 'dynamicSection';
        }
        list[i].className = 'list active';
        if (i < dynamicSection.length) {
            dynamicSection[i].className = 'dynamicSection active';
        }
        projectDtlsSection.className = 'dynamicSection';

        $.ajax({
            type: 'GET',
            url: $(navLink[i]).attr('href'),
            success: function (data) {
                document.title = `Issue Tracker | ${data.data.title}`;

                if (data.data.title == 'Home') {
                    if (data.data.projects) {
                        let projectList = data.data.projects;
                        let homeProjectListDiv = $('#projectList');
                        homeProjectListDiv.empty();
                        projectList.map((project) => { homeProjectListDiv.append(homeProjectListDom(project)) });
                        projectDtls();
                    }
                }
                else if (data.data.title == 'Issue Logs') {
                    let issueList = data.data.issues;
                    let issueListDiv = $('#issueList');
                    issueListDiv.empty();
                    issueList.map((issue) => { issueListDiv.append(issueLogsDom(issue)) });
                    deleteIssue();
                    $('#issueList').removeData('masonry');
                    $('#issueList').masonry({
                        itemSelector: '.issueItem',
                    });
                }
            },
            error: function (error) {
                console.log(error.responseText);
            }
        });
    }
}

let homeProjectListDom = function (project) {
    return `<a class="projectItem" href="/project/?id=${project._id}">
                <div>
                    <div class="projectName">
                        <h1>${project.projectName}</h1>
                    </div>
                    <div class="projectDesc">
                        <p>${project.author}</p>
                    </div>
                </div>
            </a>`;
}

let issueLogsDom = function (issue) {
    return `<div class="issueItem" id="issueLabel${issue._id}">
                <div class="issueDesc">
                    <h1>${issue.title}</h1>
                    <p>${(issue.description.length > 50) ? issue.description.substring(0, 50) + "..." : issue.description}</p>
                    <div class="labelDiv">
                        ${issue.labels.map((label) => (
                            `<div class="labelItem">
                            ${label}
                        </div>`
                        )).join("")}
                    </div>
                    <p>-${issue.author}</p>
                </div>
                
                <div class="fixBtnDiv">
                    <a href="/deleteIssue?issueId=${issue._id}&projectId=${issue.project}" class="fixBtn">Fix</a>
                </div>
            </div>`;
}