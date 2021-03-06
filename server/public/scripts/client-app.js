
$(document).ready(function() {
    $('#submit').on('click', postTask);
    $('body').on('load', showAllTasks());
    $('#tasks').on('click', '.button-complete', completeTask);
    $('#tasks').on('click', '.button-delete', deleteTask);
    $('#completed-tasks').on('click', '.button-delete', deleteTask);
});

function postTask() {
    event.preventDefault();

    var values = {};
    $.each($('#task-form').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });

    console.log(values);

    $('#task-form').find('input[type=text]').val('');

    $.ajax({
        type: 'POST',
        url: '/tasks',
        data: values,
        success: function(data) {
            if(data) {
                console.log('from server:', data);
                displayTask();

            } else {
                console.log('error');
            }
        }
    });

}

function displayTask() {
    $.ajax({
        type: 'GET',
        url: '/tasks',
        success: function(data) {
            var displayTask = data[data.length-1].task;
            var id = data[data.length-1].id;

            $('#tasks').prepend('<p id="' + id + '">' + displayTask  + '<button class="button-complete" id="' + id + '" >&#10004</button>'
             + '<button class="button-delete" id="' + id + '">&#10005</button></p>');

        }
    })
}

function showAllTasks() {
    $.ajax({
        type: 'GET',
        url: '/tasks',
        success: function(data) {
            console.log(data);

            data.forEach(function(task, i) {
                var displayTask = task.task;
                var id = task.id;
                var completed = task.completed;

                if(completed == false) {

                    $('#tasks').prepend('<p id="' + id + '"><button class="button-complete" id="' + id + '" /></button>'
                     + displayTask + '<button class="button-delete" id="' + id + '"></button></p>');

                } else {
                    $('#completed-tasks').append('<p id="' + id + '"><button class="button-complete" id="' + id + '" /></button>'
                        + displayTask + '<button class="button-delete" id="' + id + '"></button></p>');

                }

            })

        }
    })
}

function completeTask() {

    var taskId = $(this).attr('id');

    console.log('taskId: ' + taskId);

    var taskText = $('#tasks').find('#' + taskId).text();
    console.log('task text: ' + taskText);

    $(this).parent().remove();

    $('#completed-tasks').append('<p id="' + taskId + '">' + taskText + '<button class="button-delete" id="' + taskId + '">&#10005</button></p>');


    $.ajax({
        type: 'POST',
        url: '/tasks/completeTask',
        data: {id: taskId},
        success: function(data) {
            if(data) {
                console.log('from server:', data);
            } else {
                console.log('error');
            }
        }
    });

}

function deleteTask() {

    var taskId = $(this).attr('id');
    console.log('delete taskId: ' + taskId);
    $.ajax({
        type: 'POST',
        url: '/tasks/deleteTask',
        data: {id: taskId},
        success: function(data) {
            if(data) {
                console.log('id removed: ' + data);
                $('#tasks').children().find('#' + taskId).parent().remove();
                $('#completed-tasks').children().find('#' + taskId).parent().remove();

            } else {
                console.log('error');
            }
        }
    });
}
