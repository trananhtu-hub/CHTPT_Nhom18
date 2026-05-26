var SERVER_URL = "http://localhost:8000/api";

function updateMultiplication() {
    $.ajax({
        url: SERVER_URL + "/multiplications/random"
    }).then(function(data) {
        // Cleans the form
        $("#attempt-form").find( "input[name='result-attempt']" ).val("");
        // Gets a random challenge from API and loads the data in the HTML
        $('.multiplication-a').empty().append(data.factorA);
        $('.multiplication-b').empty().append(data.factorB);
    });
}

function updateResults(alias) {
    var userId = -1;
    $.ajax({
        url: SERVER_URL + "/results?alias=" + alias,
        async: false,
        success: function(data) {
            $('#results-div').show();
            $('#results-body').empty();
            data.forEach(function(row) {
                var correctLabel = row.correct === true 
                    ? '<span class="badge-yes">ĐÚNG</span>' 
                    : '<span class="badge-no">SAI</span>';
                    
                $('#results-body').append('<tr><td>' + row.id + '</td>' +
                    '<td>' + row.multiplication.factorA + ' x ' + row.multiplication.factorB + '</td>' +
                    '<td>' + row.resultAttempt + '</td>' +
                    '<td>' + correctLabel + '</td></tr>');
            });
            userId = data[0].user.id;
        }
    });
    return userId;
}

$(document).ready(function() {

    updateMultiplication();

    $("#attempt-form").submit(function( event ) {

        // Don't submit the form normally
        event.preventDefault();

        // Get some values from elements on the page
        var a = $('.multiplication-a').text();
        var b = $('.multiplication-b').text();
        var $form = $( this ),
            attempt = $form.find( "input[name='result-attempt']" ).val(),
            userAlias = $form.find( "input[name='user-alias']" ).val();

        if (!attempt || !userAlias) {
            $('.result-message').empty()
                .append("<div class='alert alert-danger'>⚠️ Vui lòng điền đầy đủ kết quả và biệt danh của bạn!</div>");
            return;
        }

        // Compose the data in the format that the API is expecting
        var data = { user: { alias: userAlias}, multiplication: {factorA: a, factorB: b}, resultAttempt: attempt};

        // Send the data using post
        $.ajax({
            url: SERVER_URL + '/results',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function(result){
                if(result.correct) {
                    $('.result-message').empty()
                        .append("<div class='alert alert-success'>🎉 Kết quả chính xác! Chúc mừng bạn đã ghi điểm!</div>");
                } else {
                    $('.result-message').empty()
                        .append("<div class='alert alert-danger'>❌ Rất tiếc, kết quả chưa đúng! Hãy tiếp tục cố gắng nhé! 💪</div>");
                }
            }
        });

        updateMultiplication();

        setTimeout(function(){
            var userId = updateResults(userAlias);
            updateStats(userId, userAlias);
            updateLeaderBoard();
        }, 300);
    });
});
