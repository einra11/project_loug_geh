var manageMembersGlobal = new ManageMembers();
var manageAssignmentsGlobal = new ManageAssignments();

$(function() {
    manageMembersGlobal.InitComponents();
    manageAssignmentsGlobal.InitComponents();
})

function ManageMembers() {
    this.tblMembers = null;
    this.memberBirthDate = null;
    this.selectedMember = null;
    this.memberImage = null;

    this.InitComponents = function() {
        manageMembersGlobal.GetAllMembers();
        manageMembersGlobal.GetAllGKKs();

        manageMembersGlobal.memberBirthDate = new Pikaday({
            field: $('#txtMemberBirthdate')[0],
            format: 'MMMM DD, YYYY',
            defaultDate: moment().toDate(),
            setDefaultDate: true
        });

        $('#btnToggleAddMemberModal').on('click', function() {
            manageMembersGlobal.ClearFields();
        });

        $('#btnAddMember').unbind('click').click(function() {
            var process = $(this).attr('btn-process')

            if (process == 'add') {
                manageMembersGlobal.AddMember();
            } else {
                manageMembersGlobal.UpdateMember();
            }
        });

        $('#divMemberImage').unbind('click').click(function() {
            $('#inpMemberImage').click();
        });

        $("#inpMemberImage").change(function() {
            readURL(this);
        });

        function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function(e) {
                    if ($('#inpMemberImage')[0].files[0].size > 32770) {
                        alert('File size must be less than 32 KB');
                    } else {
                        $('#divMemberImage').css('background-image', 'url(' + e.target.result + ')');
                        manageMembersGlobal.memberImage = e.target.result;
                    }
                }

                reader.readAsDataURL(input.files[0]);
            }
        }

        $('#tblMembers').on('click', '.edit-member', function() {
            var memberID = $(this).data('member-id');
            manageMembersGlobal.selectedMember = memberID;
            var memberDetails = manageMembersGlobal.tblMembers.row($(this).closest('tr')).data();

            $('#txtMemberUsername').val(memberDetails.memberUsername);
            $('#txtMemberPassword').val(memberDetails.memberPassword);
            $('#selMemberGKK').val(memberDetails.memberGKKNum);
            $('#txtMemberName').val(memberDetails.memberName);
            $('#txtMemberAddress').val(memberDetails.memberAddress);
            $('#txtMemberAge').val(memberDetails.memberAge);
            $('#txtMemberCivilStatus').val(memberDetails.memberMarStatus);
            $('#txtMemberEducAttainment').val(memberDetails.memberEducAttainment);
            $('#txtMemberBloodType').val(memberDetails.memberBloodType);
            $('#txtMemberPosition').val(memberDetails.memberPosition);
            $('#txtMemberRelationship').val(memberDetails.memberRelationship);
            $('#txtMemberUnitNum').val(memberDetails.memberUnitNum);
            $('#txtMemberSacraments').val(memberDetails.memberSacraments);
            $('#divMemberImage').css('background-image', 'url(' + memberDetails.memberImage + ')');
            manageMembersGlobal.memberImage = memberDetails.memberImage;
            manageMembersGlobal.memberBirthDate.setMoment(moment(memberDetails.memberBirthdate));

            $('#mdlAddMember').find('.spn-header').html('Update Member Details');
            $('#btnAddMember').attr('btn-process', 'update');
            $('#btnAddMember').html('Update');
        });

        $('#tblMembers').on('click', '.remove-member', function() {
            var memberID = $(this).data('member-id');

            if (confirm('Remove selected member?')) {
                manageMembersGlobal.RemoveMember(memberID);
            }
        });

        $('#manage-members-list .list-group-item-action').click(function() {
            if ($(this).attr('id') == 'list-members-list') {
                manageMembersGlobal.GetAllGKKs();
            }
        })
    }

    this.GetAllGKKs = function() {
        $.ajax({
            url: "../content/functions/gkk/getallgkks.php",
            type: "POST",
            dataType: "JSON",
            success: function(data) {
                if (data.status == 1) {
                    var htmlString = '';

                    $.each(data.dataGKKs, function(index) {
                        if (index == 0) {
                            htmlString = '<option value="0" selected>Select GKK</option>';
                        }
                        htmlString += '<option value="' + data.dataGKKs[index].gkkID + '">' + data.dataGKKs[index].gkkNum + ' - ' + data.dataGKKs[index].gkkName + '</option>';
                    });

                    $('#selMemberGKK').html(htmlString);

                } else {
                    alert('Churches were not loaded successfully.');
                }
            }
        });
    }

    this.GetAllMembers = function() {
        $.ajax({
            url: "../content/functions/member/getallmembers.php",
            type: "POST",
            dataType: "JSON",
            success: function(data) {
                if (data.status == 1) {
                    $('#tblMembers').DataTable().destroy();

                    manageMembersGlobal.tblMembers = $('#tblMembers').DataTable({
                        pageLength: 5,
                        dom: 'frtp',
                        data: data.dataMembers,
                        columns: [{
                                data: 'memberImage',
                                width: '15%',
                                render: function(data, type, full, meta) {
                                    return '<div class="member-avatar" style="background-image: url(' + data + ')"></div>';
                                }
                            },
                            {
                                data: 'memberNum',
                                width: '15%',
                                render: function(data, type, full, meta) {
                                    return '<span class="member-id">' + data + '</span><br/><div class="nav-container mt-2"><a class="edit-member active" data-member-id="' + data + '" href="#" data-toggle="modal" data-target="#mdlAddMember">Edit</a> | <a class="remove-member active" data-member-id="' + data + '" href="#"> Remove</a></div>';
                                }
                            },
                            {
                                data: 'memberUsername',
                                width: '15%'
                            },
                            {
                                data: 'memberName',
                                width: '15%'
                            },
                            {
                                data: 'memberAge',
                                width: '10%'
                            },
                            {
                                data: 'memberBirthdate',
                                width: '10%',
                                render: function(data, type, full, meta) {
                                    return moment(data).format('MMMM DD, YYYY');
                                }
                            },
                            {
                                data: 'memberBloodType',
                                width: '10%'
                            },
                            {
                                data: 'memberUnitNum',
                                width: '10%'
                            },
                            {
                                data: 'gkkName',
                                width: '10%'
                            },
                            {
                                data: 'memberAddress'
                            },
                            {
                                data: 'memberMarStatus'
                            },
                            {
                                data: 'memberSacraments'
                            },
                            {
                                data: 'memberEducAttainment'
                            },
                            {
                                data: 'memberPosition'
                            },
                            {
                                data: 'memberRelationship'
                            }
                        ],
                        responsive: {
                            details: {
                                type: 'column'
                            }
                        },
                        columnDefs: [{
                            className: 'control',
                            orderable: false,
                            targets: 0
                        }],
                        order: [1, 'asc']
                    });

                } else {
                    alert('Members were not loaded successfully.');
                }
            }
        });
    }

    this.AddMember = function() {
        var username = $('#txtMemberUsername').val();
        var password = $('#txtMemberPassword').val();
        var name = $('#txtMemberName').val();
        var address = $('#txtMemberAddress').val();
        var age = $('#txtMemberAge').val();
        var civilStatus = $('#txtMemberCivilStatus').val();
        var educAttainment = $('#txtMemberEducAttainment').val();
        var bloodType = $('#txtMemberBloodType').val();
        var position = $('#txtMemberPosition').val();
        var relationship = $('#txtMemberRelationship').val();
        var unitNum = $('#txtMemberUnitNum').val();
        var gkkNum = $('#selMemberGKK option:selected').val();
        var sacraments = $('#txtMemberSacraments').val();
        var birthDate = manageMembersGlobal.memberBirthDate.getMoment().format('YYYY-MM-DD');
        var image = manageMembersGlobal.memberImage;

        if (image != null && birthDate.trim() != '' && username.trim() != '' && password.trim() != '' && name.trim() != '' &&
            address.trim() != '' && age.trim() != '' && civilStatus.trim() != '' && educAttainment.trim() != '' &&
            bloodType.trim() != '' && position.trim() != '' && position.trim() != '' && relationship.trim() != '' &&
            unitNum.trim() != '' && gkkNum != 0 && sacraments.trim() != '') {
            if (confirm('Add new Member?')) {
                $.ajax({
                    url: "../content/functions/member/addmember.php",
                    type: "POST",
                    dataType: "JSON",
                    data: {
                        image: image,
                        username: username,
                        password: password,
                        name: name,
                        address: address,
                        age: age,
                        civilStatus: civilStatus,
                        educAttainment: educAttainment,
                        bloodType: bloodType,
                        position: position,
                        relationship: relationship,
                        unitNum: unitNum,
                        gkkNum: gkkNum,
                        sacraments: sacraments,
                        birthDate: birthDate
                    },
                    success: function(data) {
                        if (data.status == 1) {
                            alert('Member has been added successfully.');
                            manageMembersGlobal.GetAllMembers();
                            manageMembersGlobal.ClearFields();
                        } else {
                            alert('Member was not added successfully.');
                        }
                    }
                });
            }
        } else {
            alert('Please fill in all fieds.');
        }
    }

    this.UpdateMember = function() {
        var id = manageMembersGlobal.selectedMember;
        var username = $('#txtMemberUsername').val();
        var password = $('#txtMemberPassword').val();
        var name = $('#txtMemberName').val();
        var address = $('#txtMemberAddress').val();
        var age = $('#txtMemberAge').val();
        var civilStatus = $('#txtMemberCivilStatus').val();
        var educAttainment = $('#txtMemberEducAttainment').val();
        var bloodType = $('#txtMemberBloodType').val();
        var position = $('#txtMemberPosition').val();
        var relationship = $('#txtMemberRelationship').val();
        var unitNum = $('#txtMemberUnitNum').val();
        var gkkNum = $('#selMemberGKK option:selected').val();
        var sacraments = $('#txtMemberSacraments').val();
        var image = manageMembersGlobal.memberImage;
        var birthDate = manageMembersGlobal.memberBirthDate.getMoment().format('YYYY-MM-DD');

        if (image != null && birthDate.trim() != '' && username.trim() != '' && password.trim() != '' && name.trim() != '' &&
            address.trim() != '' && age.trim() != '' && civilStatus.trim() != '' && educAttainment.trim() != '' &&
            bloodType.trim() != '' && position.trim() != '' && position.trim() != '' && relationship.trim() != '' &&
            unitNum.trim() != '' && gkkNum != 0 && sacraments.trim() != '') {
            if (confirm('Update selected member?')) {
                $.ajax({
                    url: "../content/functions/member/updatemember.php",
                    type: "POST",
                    dataType: "JSON",
                    data: {
                        image: image,
                        id: id,
                        username: username,
                        password: password,
                        name: name,
                        address: address,
                        age: age,
                        civilStatus: civilStatus,
                        educAttainment: educAttainment,
                        bloodType: bloodType,
                        position: position,
                        relationship: relationship,
                        unitNum: unitNum,
                        gkkNum: gkkNum,
                        sacraments: sacraments,
                        birthDate: birthDate
                    },
                    success: function(data) {
                        if (data.status == 1) {
                            alert('Member has been updated successfully.');
                            manageMembersGlobal.GetAllMembers();
                            manageMembersGlobal.ClearFields();
                            manageMembersGlobal.selectedMember = null;
                        } else {
                            alert('Member was not updated successfully.');
                        }
                    }
                });
            }
        } else {
            alert('Please fill in all fieds.');
        }
    }

    this.RemoveMember = function(memberID) {
        $.ajax({
            url: "../content/functions/member/removemember.php",
            type: "POST",
            dataType: "JSON",
            data: { id: memberID },
            success: function(data) {
                if (data.status == 1) {
                    alert('Member has been deleted successfully.');
                    manageMembersGlobal.GetAllMembers();
                } else {
                    alert('Member was not deleted successfully.');
                }
            }
        });
    }

    this.ClearFields = function() {
        $('#mdlAddMember').modal('hide')
        $('#frmAddMember')[0].reset();
        $('#mdlAddMember').find('.spn-header').html('Add Member');
        $('#btnAddMember').attr('btn-process', 'add');
        $('#btnAddMember').html('<span class="icon">+</span>Add');
        $('#divMemberImage').removeAttr('style');
        manageMembersGlobal.memberImage = null;
        manageMembersGlobal.memberBirthDate.setMoment(moment());
    }
}

function ManageAssignments() {
    this.tblAssignments = null;
    this.selectedAssignment = null;

    this.InitComponents = function() {
        manageAssignmentsGlobal.GetAllAssignments();
        manageAssignmentsGlobal.GetAllMembers();

        $('#btnToggleAddAssignmentModal').on('click', function() {
            manageAssignmentsGlobal.ClearFields();
        });

        $('#btnAddAssignment').unbind('click').click(function() {
            var process = $(this).attr('btn-process')

            if (process == 'add') {
                manageAssignmentsGlobal.AddAssignment();
            } else {
                manageAssignmentsGlobal.UpdateAssignment();
            }
        });

        $('#tblAssignments').on('click', '.edit-assignment', function() {
            var assignmentID = $(this).data('assignment-id');
            manageAssignmentsGlobal.selectedAssignment = assignmentID;
            var assignmentDetails = manageAssignmentsGlobal.tblAssignments.row($(this).closest('tr')).data();
            
            $('#txtAssignmentTitle').val(assignmentDetails.assignmentTitle);
            $('#txtAssignmentDesc').val(assignmentDetails.assignmentDesc);
            $('#selAssignmentMembers').val(assignmentDetails.assignedTo);

            $('#mdlAddAssignment').find('.spn-header').html('Update Assignment Details');
            $('#btnAddAssignment').attr('btn-process', 'update');
            $('#btnAddAssignment').html('Update');
        });

        $('#tblAssignments').on('click', '.remove-assignment', function() {
            var assignmentID = $(this).data('assignment-id');

            if (confirm('Remove selected Assignment?')) {
                manageAssignmentsGlobal.RemoveAssignment(assignmentID);
            }
        });

        $('#manage-members-list .list-group-item-action').click(function() {
            if ($(this).attr('id') == 'list-assignment-list') {
                manageAssignmentsGlobal.GetAllAssignments();
                manageAssignmentsGlobal.GetAllMembers();
            }
        })
    }
    
    this.GetAllMembers = function() {
        $.ajax({
            url: "../content/functions/member/getallmembers.php",
            type: "POST",
            dataType: "JSON",
            success: function(data) {
                if (data.status == 1) {
                    var htmlString = '';

                    $.each(data.dataMembers, function(index) {
                        if (index == 0) {
                            htmlString = '<option value="0" selected>Select Member</option>';
                        }
                        htmlString += '<option value="' + data.dataMembers[index].memberNum + '">' + data.dataMembers[index].memberNum + ' - ' + data.dataMembers[index].memberName + '</option>';
                    });

                    $('#selAssignmentMembers').html(htmlString);

                } else {
                    alert('Members were not loaded successfully.');
                }
            }
        });
    }

    this.GetAllAssignments = function() {
        $.ajax({
            url: "../content/functions/assignment/getallassignments.php",
            type: "POST",
            dataType: "JSON",
            success: function(data) {
                if (data.status == 1) {
                    $('#tblAssignments').DataTable().destroy();

                    manageAssignmentsGlobal.tblAssignments = $('#tblAssignments').DataTable({
                        pageLength: 7,
                        dom: 'frtp',
                        data: data.dataAssignments,
                        columns: [{
                                data: 'assignmentID',
                                width: '20%',
                                render: function(data, type, full, meta) {
                                    return '<span class="assignment-name">' + data + ' - ' + full.assignmentTitle + '</span><br/><div class="nav-container mt-2"><a class="edit-assignment active" data-assignment-id="' + data + '" href="#" data-toggle="modal" data-target="#mdlAddAssignment">Edit</a> | <a class="remove-assignment active" data-assignment-id="' + data + '" href="#"> Remove</a></div>';
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

    this.AddAssignment = function() {
        var title = $('#txtAssignmentTitle').val();
        var desc = $('#txtAssignmentDesc').val();
        var assignedBy = JSON.parse(localStorage.getItem('GKKIS_Admin_Details')).dataAdmin.adminID;
        var assignedTo = $('#selAssignmentMembers option:selected').val();
        var assignmentDate = moment().format('YYYY-MM-DD');
        
        if (assignedBy != 0 && assignedTo != 0 && title.trim() != '' &&
            desc.trim() != '' && assignmentDate.trim() != '') {
            if (confirm('Add new Assignment?')) {
                $.ajax({
                    url: "../content/functions/assignment/addassignment.php",
                    type: "POST",
                    dataType: "JSON",
                    data: {
                        title: title,
                        desc: desc,
                        assignedBy: assignedBy,
                        assignedTo: assignedTo,
                        assignmentDate: assignmentDate
                    },
                    success: function(data) {
                        if (data.status == 1) {
                            alert('Assignment has been added successfully.');
                            manageAssignmentsGlobal.GetAllAssignments();
                            manageAssignmentsGlobal.ClearFields();
                        } else {
                            alert('Assignment was not added successfully.');
                        }
                    }
                });
            }
        } else {
            alert('Please fill in all fieds.');
        }
    }

    this.UpdateAssignment = function() {
        var id = manageAssignmentsGlobal.selectedAssignment;
        var title = $('#txtAssignmentTitle').val();
        var desc = $('#txtAssignmentDesc').val();
        var assignedBy = JSON.parse(localStorage.getItem('GKKIS_Admin_Details')).dataAdmin.adminID;
        var assignedTo = $('#selAssignmentMembers option:selected').val();
        var assignmentDate = moment().format('YYYY-MM-DD');

        if (id != null && assignedBy != 0 && assignedTo != 0 && title.trim() != '' &&
            desc.trim() != '' && assignmentDate.trim() != '') {
            if (confirm('Update selected Assignment?')) {
                $.ajax({
                    url: "../content/functions/assignment/updateassignment.php",
                    type: "POST",
                    dataType: "JSON",
                    data: {
                        id: id,
                        title: title,
                        desc: desc,
                        assignedBy: assignedBy,
                        assignedTo: assignedTo,
                        assignmentDate: assignmentDate
                    },
                    success: function(data) {
                        if (data.status == 1) {
                            alert('Assignment has been updated successfully.');
                            manageAssignmentsGlobal.GetAllAssignments();
                            manageAssignmentsGlobal.ClearFields();
                            manageAssignmentsGlobal.selectedAssignment = null;
                        } else {
                            alert('Assignment was not updated successfully.');
                        }
                    }
                });
            }
        } else {
            alert('Please fill in all fieds.');
        }
    }

    this.RemoveAssignment = function(assignmentID) {
        $.ajax({
            url: "../content/functions/assignment/removeassignment.php",
            type: "POST",
            dataType: "JSON",
            data: { id: assignmentID },
            success: function(data) {
                if (data.status == 1) {
                    alert('Assignment has been deleted successfully.');
                    manageAssignmentsGlobal.GetAllAssignments();
                } else {
                    alert('Assignment was not deleted successfully.');
                }
            }
        });
    }

    this.ClearFields = function() {
        $('#mdlAddAssignment').modal('hide')
        $('#frmAddAssignment')[0].reset();
        $('#mdlAddAssignment').find('.spn-header').html('Add Assignment');
        $('#btnAddAssignment').attr('btn-process', 'add');
        $('#btnAddAssignment').html('<span class="icon">+</span>Add');
        manageAssignmentsGlobal.selectedAssignment = null;
    }
}