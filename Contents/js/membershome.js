var membersHomeGlobal = new MemebersHome();
var memberInboxGlobal = new MemberInbox();
var memberSentGlobal = new MemberSent();

$(function() {

    membersHomeGlobal.InitMembersHomeComp();
    memberInboxGlobal.InitComponents();
    memberSentGlobal.InitComponents();
})

function MemebersHome() {
    this.memberDetails = null;
    this.tblAssignments = null;

    this.InitMembersHomeComp = function() {
        membersHomeGlobal.GetAllMembers();        
        membersHomeGlobal.GetAssignmentsByMember(JSON.parse(localStorage.getItem('GKKIS_Member_Details')).dataMember.memberNum);

        if (localStorage.getItem('GKKIS_Member_Details') != null) {
            membersHomeGlobal.memberDetails = JSON.parse(localStorage.getItem('GKKIS_Member_Details'));


            $('#members-home .form-container.im-hidden').removeClass('im-hidden');
            $('#drpMemberUsername').html('<div class="member-avatar"></div> ' + membersHomeGlobal.memberDetails.username);
            $('.member-avatar').css('background-image', 'url(' + membersHomeGlobal.memberDetails.dataMember.memberImage + ')');
            $('.member-image').css('background-image', 'url(' + membersHomeGlobal.memberDetails.dataMember.memberImage + ')');
            $('#drpMemberName').html(membersHomeGlobal.memberDetails.dataMember.memberName);
            $('.member-name').html(membersHomeGlobal.memberDetails.dataMember.memberName);
            $('.member-position').html(membersHomeGlobal.memberDetails.dataMember.memberPosition);
            $('.unit-num').html(membersHomeGlobal.memberDetails.dataMember.memberUnitNum);
            $('.gkk-num').html(membersHomeGlobal.memberDetails.dataMember.memberGKKNum);
            $('.blood-type').html(membersHomeGlobal.memberDetails.dataMember.memberBloodType);
            $('.civil-status').html(membersHomeGlobal.memberDetails.dataMember.memberMarStatus);
            $('.member-birthdate').html(moment(membersHomeGlobal.memberDetails.dataMember.memberBirthdate).format('MMMM DD, YYYY'));
            $('.member-age').html(membersHomeGlobal.memberDetails.dataMember.memberAge);
            $('.member-address').html(membersHomeGlobal.memberDetails.dataMember.memberAddress);
            $('.member-educ').html(membersHomeGlobal.memberDetails.dataMember.memberEducAttainment);
            $('.member-sacraments').html(membersHomeGlobal.memberDetails.dataMember.memberSacraments);
            $('.member-relationship').html(membersHomeGlobal.memberDetails.dataMember.memberRelationship);
        }

        $('#btnMemberLogout').unbind('click').click(function() {
            if (confirm("Are you sure you want to logout on Members Page?")) {
                localStorage.removeItem('GKKIS_Member_Details');
                window.top.location.reload();
            }
        });

        $('#btnSendMessage').unbind('click').click(function() {
            membersHomeGlobal.AddMessage();
        });

        $('#btnCloseViewMessage').unbind('click').click(function() {
            memberInboxGlobal.GetAllMessages();
        });
    }

    this.GetAssignmentsByMember = function(memberID) {
        $.ajax({
            url: "../content/functions/assignment/getassignmentspermember.php",
            type: "POST",
            dataType: "JSON",
            data: { id: memberID },
            success: function(data) {
                if (data.status == 1) {
                    $('#tblAssignments').DataTable().destroy();

                    membersHomeGlobal.tblAssignments = $('#tblAssignments').DataTable({
                        pageLength: 7,
                        dom: 'frtp',
                        data: data.dataAssignments,
                        columns: [{
                                data: 'assignmentID',
                                width: '20%',
                                render: function(data, type, full, meta) {
                                    return '<span class="assignment-name">' + data + ' - ' + full.assignmentTitle + '</span><br/>';
                                }
                            },
                            {
                                data: 'assignmentDesc',
                                width: '30%'
                            },
                            {
                                data: 'adminName',
                                width: '20%'
                            },
                            {
                                data: 'memberName',
                                width: '20%'
                            },
                            {
                                data: 'assignmentDate',
                                width: '10%',
                                render: function(data, type, full, meta) {
                                    return moment(data).format('MMMM DD, YYYY');
                                }
                            }
                        ],
                        responsive: {
                            details: {
                                renderer: function(api, rowIdx, columns) {
                                    var data = $.map(columns, function(col, i) {
                                        return col.hidden ?
                                            '<tr data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
                                            '<td>' + col.title + ':' + '</td> ' +
                                            '<td>' + col.data + '</td>' +
                                            '</tr>' :
                                            '';
                                    }).join('');

                                    return data ?
                                        $('<table/>').append(data) :
                                        false;
                                }
                            }
                        }
                    });

                } else {
                    alert('Assignments were not loaded successfully.');
                }
            }
        });
    }

    this.AddMessage = function() {
        var memberDetails = JSON.parse(localStorage.getItem('GKKIS_Member_Details'));

        var sentTo = $('#selMessageRecipient option:selected').val();
        var sentBy = memberDetails.dataMember.memberNum;
        var message = $('#txtMessageFull').val();
        var subject = $('#txtMessageSubject').val();
        var date = moment().format('YYYY-MM-DD');

        if (sentTo != 0 && sentBy.trim() != '' && message.trim() != '' && subject.trim() != '' && date.trim() != '') {
            if (confirm('Send Message?')) {
                $.ajax({
                    url: "../content/functions/member-home/addmessage.php",
                    type: "POST",
                    dataType: "JSON",
                    data: {
                        sentTo: sentTo,
                        sentBy: sentBy,
                        message: message,
                        subject: subject,
                        date: date
                    },
                    success: function(data) {
                        if (data.status == 1) {
                            alert('Message sent.');

                            $('#mdlComposeMessage').modal('hide');
                            $('#selMessageRecipient').val(0);
                            $('#txtMessageFull').val('');
                            $('#txtMessageSubject').val('');

                            memberInboxGlobal.GetAllMessages();
                            memberSentGlobal.GetAllMessages();
                        } else {
                            alert('An error occured while sending the message.');
                        }
                    }
                });
            }
        } else {
            alert('Please fill in all fieds.');
        }
    }

    this.GetAllMembers = function() {
        $.ajax({
            url: "../content/functions/member/getallmembers.php",
            type: "POST",
            dataType: "JSON",
            success: function(data) {
                if (data.status == 1) {
                    var memberDetails = JSON.parse(localStorage.getItem('GKKIS_Member_Details'));
                    var htmlString = '';

                    $.each(data.dataMembers, function(index) {
                        if (index == 0) {
                            htmlString = '<option value="0" selected>Select Recipient</option>';
                        }
                        htmlString += '<option value="' + data.dataMembers[index].memberNum + '">' + data.dataMembers[index].memberName + '</option>';
                        // if (data.dataMembers[index].memberNum != memberDetails.dataMember.memberNum) {
                        //     htmlString += '<option value="' + data.dataMembers[index].memberNum + '">' + data.dataMembers[index].memberName + '</option>';
                        // }
                    });

                    $('#selMessageRecipient').html(htmlString);

                } else {
                    alert('Members were not loaded successfully.');
                }
            }
        });
    }
}

function MemberInbox() {
    this.tblMessageInbox = null;

    this.InitComponents = function() {
        memberInboxGlobal.GetAllMessages();

        $('#tblMessageInbox').on('click', '.view-message', function() {
            var messageID = $(this).data('message-id');
            var messageDetails = memberInboxGlobal.tblMessageInbox.row($(this).closest('tr')).data();

            if (messageDetails.messageState == 1) {
                memberInboxGlobal.UpdateMessageStateToRead(messageID);
            }

            $('#mdlViewMessage .spn-header').html(messageDetails.messageSubject);
            $('#messageSubject').html(messageDetails.messageSubject);
            $('#messageFull').html(messageDetails.messageFull);
            $('#mdlViewMessage .sender-details .sender').html('From:<span class="spn-sender-name ml-2">' + messageDetails.messageSentBy + '</span>');
            $('.spn-message-date').html(moment(messageDetails.messageDate).format('MMMM DD, YYYY'));
        });

        $('#tblMessageInbox').on('click', '.remove-message', function() {
            var messageID = $(this).data('message-id');
            var messageStatus = $(this).data('message-status');

            if (confirm('Remove message?')) {
                memberInboxGlobal.RemoveMessage(messageID, messageStatus);
            }
        });
    }

    this.GetAllMessages = function() {
        var memberDetails = JSON.parse(localStorage.getItem('GKKIS_Member_Details'));

        $.ajax({
            url: "../content/functions/member-home/getallinboxmessages.php",
            type: "POST",
            dataType: "JSON",
            data: { id: memberDetails.dataMember.memberNum },
            success: function(data) {
                if (data.status == 1) {
                    $('#tblMessageInbox').DataTable().destroy();

                    memberInboxGlobal.tblMessageInbox = $('#tblMessageInbox').DataTable({
                        pageLength: 7,
                        dom: 'frtp',
                        data: data.dataMessages,
                        columns: [{
                                data: 'messageID',
                                width: '20%',
                                render: function(data, type, full, meta) {
                                    if (full.messageState == 1) {
                                        return '<span class="sender-name text-700">' + full.messageSentBy + '</span><br/><div class="nav-container mt-2"><a class="view-message active" data-message-id="' + data + '" href="#" data-toggle="modal" data-target="#mdlViewMessage">View Message</a> | <a class="remove-message active" data-message-id="' + data + '" data-message-status="' + full.messageStatus + '" href="#"> Delete</a></div>';
                                    } else {
                                        return '<span class="sender-name">' + full.messageSentBy + '</span><br/><div class="nav-container mt-2"><a class="view-message active" data-message-id="' + data + '" href="#" data-toggle="modal" data-target="#mdlViewMessage">View Message</a> | <a class="remove-message active" data-message-id="' + data + '" data-message-status="' + full.messageStatus + '" href="#"> Delete</a></div>';
                                    }
                                }
                            },
                            {
                                data: 'messageSubject',
                                width: '20%',
                                render: function(data, type, full, meta) {
                                    if (full.messageState == 1) {
                                        return '<span class="text-700">' + data + '</span>';
                                    } else {
                                        return data;
                                    }
                                }
                            },
                            {
                                data: 'messageFull',
                                width: '40%',
                                render: function(data, type, full, meta) {
                                    if (full.messageState == 1) {
                                        return '<span class="text-700">' + data + '</span>';
                                    } else {
                                        return data;
                                    }
                                }
                            },
                            {
                                data: 'messageDate',
                                render: function(data, type, full, meta) {
                                    if (full.messageState == 1) {
                                        return '<span class="text-700">' + moment(data).format('MMMM DD, YYYY') + '</span>';
                                    } else {
                                        return moment(data).format('MMMM DD, YYYY');
                                    }
                                },
                                width: '20%'
                            }
                        ],
                        responsive: {
                            details: {
                                renderer: function(api, rowIdx, columns) {
                                    var data = $.map(columns, function(col, i) {
                                        return col.hidden ?
                                            '<tr data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
                                            '<td>' + col.title + ':' + '</td> ' +
                                            '<td>' + col.data + '</td>' +
                                            '</tr>' :
                                            '';
                                    }).join('');

                                    return data ?
                                        $('<table/>').append(data) :
                                        false;
                                }
                            }
                        }
                    });

                } else {
                    alert('Inbox Messages were not loaded successfully.');
                }
            }
        });
    }

    this.UpdateMessageStateToRead = function(messageID) {
        $.ajax({
            url: "../content/functions/member-home/updatemessagestatetoread.php",
            type: "POST",
            dataType: "JSON",
            data: { id: messageID },
            success: function(data) {
                if (data.status == 2) {
                    console.log('An error occured. Contact the administrator.');
                }
            }
        });
    }

    this.RemoveMessage = function(messageID, messageStatus) {
        $.ajax({
            url: "../content/functions/member-home/removemessage.php",
            type: "POST",
            dataType: "JSON",
            data: { id: messageID, module: 'inbox', messageStatus: messageStatus },
            success: function(data) {
                if (data.status == 1) {
                    alert('Inbox message has been deleted successfully.');
                    memberInboxGlobal.GetAllMessages();
                } else {
                    alert('Inbox message was not deleted successfully.');
                }
            }
        });
    }
}

function MemberSent() {
    this.tblMessageSent = null;

    this.InitComponents = function() {
        memberSentGlobal.GetAllMessages();

        $('#tblSentMessages').on('click', '.view-message', function() {
            var messageID = $(this).data('message-id');
            var messageDetails = memberSentGlobal.tblMessageSent.row().data();

            $('#mdlViewMessage .spn-header').html(messageDetails.messageSubject);
            $('#messageSubject').html(messageDetails.messageSubject);
            $('#messageFull').html(messageDetails.messageFull);
            $('#mdlViewMessage .sender-details .sender').html('To:<span class="spn-sender-name ml-2">' + messageDetails.messageSentTo + '</span>');
            $('.spn-message-date').html(moment(messageDetails.messageDate).format('MMMM DD, YYYY'));
        });

        $('#tblSentMessages').on('click', '.remove-message', function() {
            var messageID = $(this).data('message-id');
            var messageStatus = $(this).data('message-status');

            if (confirm('Remove message?')) {
                memberSentGlobal.RemoveMessage(messageID, messageStatus);
            }
        });
    }

    this.GetAllMessages = function() {
        var memberDetails = JSON.parse(localStorage.getItem('GKKIS_Member_Details'));

        $.ajax({
            url: "../content/functions/member-home/getallsentmessages.php",
            type: "POST",
            dataType: "JSON",
            data: { id: memberDetails.dataMember.memberNum },
            success: function(data) {
                if (data.status == 1) {
                    $('#tblSentMessages').DataTable().destroy();

                    memberSentGlobal.tblMessageSent = $('#tblSentMessages').DataTable({
                        pageLength: 7,
                        dom: 'frtp',
                        data: data.dataMessages,
                        columns: [{
                                data: 'messageID',
                                width: '20%',
                                render: function(data, type, full, meta) {
                                    return '<span class="receiver-name">' + full.messageSentTo + '</span><br/><div class="nav-container mt-2"><a class="view-message active" data-message-id="' + data + '" href="#" data-toggle="modal" data-target="#mdlViewMessage">View Message</a> | <a class="remove-message active" data-message-id="' + data + '" data-message-status="' + full.messageStatus + '" href="#"> Delete</a></div>';
                                }
                            },
                            {
                                data: 'messageSubject',
                                width: '20%'
                            },
                            {
                                data: 'messageFull',
                                width: '40%'
                            },
                            {
                                data: 'messageDate',
                                render: function(data, type, full, meta) {
                                    return moment(data).format('MMMM DD, YYYY');
                                },
                                width: '20%'
                            }
                        ],
                        responsive: {
                            details: {
                                renderer: function(api, rowIdx, columns) {
                                    var data = $.map(columns, function(col, i) {
                                        return col.hidden ?
                                            '<tr data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
                                            '<td>' + col.title + ':' + '</td> ' +
                                            '<td>' + col.data + '</td>' +
                                            '</tr>' :
                                            '';
                                    }).join('');

                                    return data ?
                                        $('<table/>').append(data) :
                                        false;
                                }
                            }
                        }
                    });

                } else {
                    alert('Sent Messages were not loaded successfully.');
                }
            }
        });
    }

    this.RemoveMessage = function(messageID, messageStatus) {
        $.ajax({
            url: "../content/functions/member-home/removemessage.php",
            type: "POST",
            dataType: "JSON",
            data: { id: messageID, module: 'sent', messageStatus: messageStatus },
            success: function(data) {
                if (data.status == 1) {
                    alert('Sent message has been deleted successfully.');
                    memberSentGlobal.GetAllMessages();
                } else {
                    alert('Sent message was not deleted successfully.');
                }
            }
        });
    }
}