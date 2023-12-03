let createIssue = function(){
    let newIssueForm = $('#issueForm');

    newIssueForm.submit(function(event){
        event.preventDefault();
        $.ajax({
            type: 'post',
            url: '/createIssue',
            data: newIssueForm.serialize(),
            success: function(data){
                $('#issueListDiv').prepend(issueDom(data.data.issue));
                let newOption = $('<option>', {
                    value: data.data.issue.author,
                    text: data.data.issue.author
                });
        
                $('#issueAuthor').append(newOption);
                deleteIssue();
            },
            error: function(error){
                console.log(error.responseText);
            }
        });
        $('#issueForm')[0].reset();
    });
}

let deleteIssue = function(){
    $('.fixBtn').on("click", function(event) {
        console.log("Clicked!");
        event.preventDefault();
        $.ajax({
            type: 'get',
            url: $(this).attr('href'),
            success: function(data) {
                if(data.data.deleted){
                    $(`#issueLabel${data.data.issueId}`).remove();
                    $(`#projectIssueLabel${data.data.issueId}`).remove();
                }
            },
            error: function(error) {
                console.log(error.responseText);
            }
        });
    });
}

createIssue();
deleteIssue();