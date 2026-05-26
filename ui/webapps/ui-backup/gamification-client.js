var SERVER_URL = "http://localhost:8000/api";

function updateLeaderBoard() {
    $.ajax({
        url: SERVER_URL + "/leaders"
    }).then(function(data) {
        $('#leaderboard-body').empty();
        data.forEach(function(row, index) {
            var rowId = "leader-row-" + index;
            $('#leaderboard-body').append('<tr id="' + rowId + '"><td>' + row.userId + '</td>' +
                '<td style="font-weight: 600; color: #10b981;">' + row.totalScore + ' điểm</td></tr>');
            
            // Resolve User ID to Alias
            $.ajax({
                url: SERVER_URL + "/users/" + row.userId,
                success: function(user) {
                    $('#' + rowId).find('td:first').text(user.alias);
                }
            });
        });
    });
}

function updateStats(userId, userAlias) {
    $.ajax({
        url: SERVER_URL + "/stats?userId=" + userId,
        success: function(data) {
            $('#stats-div').show();
            $('#stats-user-id').empty().append(userAlias);
            $('#stats-score').empty().append(data.score + " điểm");
            
            // Map english badges to Vietnamese with icons
            var badgeHtml = "";
            if (data.badges && data.badges.length > 0) {
                data.badges.forEach(function(badge) {
                    var badgeName = badge;
                    var badgeClass = "badge-generic";
                    
                    if (badge === "FIRST_WON") { 
                        badgeName = "🏆 Chiến Thắng Đầu Tiên"; 
                        badgeClass = "badge-first"; 
                    } else if (badge === "FIRST_ATTEMPT") { 
                        badgeName = "🎯 Lần Đầu Chinh Phục"; 
                        badgeClass = "badge-generic"; 
                    } else if (badge === "BRONZE_MULTIPLICATOR") { 
                        badgeName = "🥉 Cao Thủ Đồng"; 
                        badgeClass = "badge-bronze"; 
                    } else if (badge === "SILVER_MULTIPLICATOR") { 
                        badgeName = "🥈 Cao Thủ Bạc"; 
                        badgeClass = "badge-silver"; 
                    } else if (badge === "GOLD_MULTIPLICATOR") { 
                        badgeName = "🥇 Cao Thủ Vàng"; 
                        badgeClass = "badge-gold"; 
                    } else if (badge === "LUCKY_NUMBER") { 
                        badgeName = "🍀 Con Số May Mắn"; 
                        badgeClass = "badge-lucky"; 
                    }
                    
                    badgeHtml += '<span class="badge-chip ' + badgeClass + '">' + badgeName + '</span> ';
                });
            } else {
                badgeHtml = '<span style="color: var(--text-muted); font-style: italic;">Chưa có huy chương</span>';
            }
            
            $('#stats-badges').empty().append(badgeHtml);
        },
        error: function(data) {
            $('#stats-div').show();
            $('#stats-user-id').empty().append(userAlias);
            $('#stats-score').empty().append("0 điểm");
            $('#stats-badges').empty().append('<span style="color: var(--text-muted); font-style: italic;">Chưa có huy chương</span>');
        }
    });
}

$(document).ready(function() {

    updateLeaderBoard();

    $("#refresh-leaderboard").click(function( event ) {
        updateLeaderBoard();
    });

});
