var manageGKKGlobal = new ManageGKK();
var manageChurchGlobal = new ManageChurch();
var manageCommitteeGlobal = new ManageCommittee();

$(function() {
    manageGKKGlobal.InitComponents();
    manageChurchGlobal.InitComponents();
    manageCommitteeGlobal.InitComponents();
})

function ManageGKK() {
    this.tblGKKs = null;
    this.gkkFiestaDate = null;
    this.selectedGKK = null;

    this.InitComponents = function() {
        manageGKKGlobal.GetAllGKKs();
        manageGKKGlobal.GetAllCommittees();
        manageGKKGlobal.GetAllChurches();

        manageGKKGlobal.gkkFiestaDate = new Pikaday({
            field: $('#txtGKKFiestaDate')[0],
            format: 'MMMM DD, YYYY',
            defaultDate: moment().toDate(),
            setDefaultDate: true
        });

        $('#btnToggleAddGKKModal').on('click', function() {
            manageGKKGlobal.ClearFields();
        });

        $('#btnAddGKK').unbind('click').click(function() {
            var process = $(this).attr('btn-process')

            if (process == 'add') {
                manageGKKGlobal.AddGKK();
            } else {
                manageGKKGlobal.UpdateGKK();
            }
        });

        $('#tblGKKs').on('click', '.edit-gkk', function() {
            var gkkID = $(this).data('gkk-id');
            manageGKKGlobal.selectedGKK = gkkID;
            var gkkDetails = manageGKKGlobal.tblGKKs.row($(this).closest('tr')).data();

            $('#txtGKKNumber').val(gkkDetails.gkkNum);
            $('#selGKKChurchNum').val(gkkDetails.gkkChurchNum);
            $('#selGKKCommitteeNum').val(gkkDetails.gkkCommitteeNum);
            $('#txtGKKPatron').val(gkkDetails.gkkPatron);
            $('#txtGKKAddress').val(gkkDetails.gkkAddress);
            $('#txtGKKUnitCount').val(gkkDetails.gkkUnitCount);
            $('#txtGKKZone').val(gkkDetails.gkkZone);
            $('#txtGKKContactNum').val(gkkDetails.gkkContactNum);
            $('#txtGKKName').val(gkkDetails.gkkName);
            manageGKKGlobal.gkkFiestaDate.setMoment(moment(gkkDetails.gkkFiestaDate));

            $('#mdlAddGKK').find('.spn-header').html('Update GKK Details');
            $('#btnAddGKK').attr('btn-process', 'update');
            $('#btnAddGKK').html('Update');
        });

        $('#tblGKKs').on('click', '.remove-gkk', function() {
            var gkkID = $(this).data('gkk-id');

            if (confirm('Remove selected GKK?')) {
                manageGKKGlobal.RemoveGKK(gkkID);
            }
        });

        $('#main-management-list .list-group-item-action').click(function() {
            if ($(this).attr('id') == 'list-gkk-list') {
                manageGKKGlobal.GetAllChurches();
                manageGKKGlobal.GetAllCommittees();
            }
        });
    }

    this.GetAllChurches = function() {
        $.ajax({
            url: "../content/functions/church/getallchurches.php",
            type: "POST",
            dataType: "JSON",
            success: function(data) {
                if (data.status == 1) {
                    var htmlString = '';

                    $.each(data.dataChurches, function(index) {
                        if (index == 0) {
                            htmlString = '<option value="0" selected>Select Church</option>';
                        }
                        htmlString += '<option value="' + data.dataChurches[index].churchID + '">' + data.dataChurches[index].churchNum + ' - ' + data.dataChurches[index].churchName + '</option>';
                    });

                    $('#selGKKChurchNum').html(htmlString);

                } else {
                    alert('Churches were not loaded successfully.');
                }
            }
        });
    }

    this.GetAllCommittees = function() {
        $.ajax({
            url: "../content/functions/committee/getallcommittees.php",
            type: "POST",
            dataType: "JSON",
            success: function(data) {
                if (data.status == 1) {
                    var htmlString = '';

                    $.each(data.dataCommittees, function(index) {
                        if (index == 0) {
                            htmlString = '<option value="0" selected>Select Committee</option>';
                        }
                        htmlString += '<option value="' + data.dataCommittees[index].committeeID + '">' + data.dataCommittees[index].committeeNum + ' - ' + data.dataCommittees[index].committeeName + '</option>';
                    });

                    $('#selGKKCommitteeNum').html(htmlString);

                } else {
                    alert('Committees were not loaded successfully.');
                }
            }
        });
    }

    this.GetAllGKKs = function() {
        $.ajax({
            url: "../content/functions/gkk/getallgkks.php",
            type: "POST",
            dataType: "JSON",
            success: function(data) {
                if (data.status == 1) {
                    $('#tblGKKs').DataTable().destroy();

                    manageGKKGlobal.tblGKKs = $('#tblGKKs').DataTable({
                        pageLength: 7,
                        dom: 'frtp',
                        data: data.dataGKKs,
                        columns: [{
                                data: 'gkkNum',
                                width: '30%',
                                render: function(data, type, full, meta) {
                                    return '<span class="gkk-name">' + data + ' - ' + full.gkkName + '</span><br/><div class="nav-container mt-2"><a class="edit-gkk active" data-gkk-id="' + full.gkkID + '" href="#" data-toggle="modal" data-target="#mdlAddGKK">Edit</a> | <a class="remove-gkk active" data-gkk-id="' + full.gkkID + '" href="#"> Remove</a></div>';
                                }
                            },
                            {
                                data: 'gkkChurch',
                                width: '15%'
                            },
                            {
                                data: 'gkkCommittee',
                                width: '15%'
                            },
                            {
                                data: 'gkkPatron',
                                width: '10%'
                            },
                            {
                                data: 'gkkFiestaDate',
                                width: '10%',
                                render: function(data, type, full, meta) {
                                    return moment(data).format('MMMM DD, YYYY');
                                }
                            },
                            {
                                data: 'gkkAddress',
                                width: '40%'
                            },
                            {
                                data: 'gkkUnitCount'
                            },
                            {
                                data: 'gkkZone'
                            },
                            {
                                data: 'gkkContactNum'
                            }
                        ],
                        responsive: {
                            details: {
                                type: 'column'
                            }
                        },
                        columnDefs: [{
                            className: 'control',
                            orderable: true,
                            targets: 0
                        }],
                        order: [1, 'asc']
                    });

                } else {
                    alert('GKKs were not loaded successfully.');
                }
            }
        });
    }

    this.AddGKK = function() {
        var gkkNum = $('#txtGKKNumber').val();
        var churchNum = $('#selGKKChurchNum option:selected').val();
        var committeeNum = $('#selGKKCommitteeNum option:selected').val();
        var patron = $('#txtGKKPatron').val();
        var address = $('#txtGKKAddress').val();
        var unitCount = $('#txtGKKUnitCount').val();
        var zone = $('#txtGKKZone').val();
        var contactNum = $('#txtGKKContactNum').val();
        var name = $('#txtGKKName').val();
        var fiestaDate = manageGKKGlobal.gkkFiestaDate.getMoment().format('YYYY-MM-DD');

        if (fiestaDate.trim() != '' && gkkNum.trim() && churchNum != 0 && committeeNum != 0 != '' && patron.trim() != '' &&
            address.trim() != '' && unitCount.trim() != '' && zone.trim() != '' && contactNum.trim() != '' &&
            name.trim()) {
            if (confirm('Add new GKK?')) {
                $.ajax({
                    url: "../content/functions/gkk/addgkk.php",
                    type: "POST",
                    dataType: "JSON",
                    data: {
                        gkkNum: gkkNum,
                        churchNum: churchNum,
                        committeeNum: committeeNum,
                        patron: patron,
                        address: address,
                        fiestaDate: fiestaDate,
                        unitCount: unitCount,
                        zone: zone,
                        contactNum: contactNum,
                        name: name
                    },
                    success: function(data) {
                        if (data.status == 1) {
                            alert('GKK has been added successfully.');
                            manageGKKGlobal.GetAllGKKs();
                            manageGKKGlobal.ClearFields();
                        } else {
                            alert('GKK was not added successfully.');
                        }
                    }
                });
            }
        } else {
            alert('Please fill in all fieds.');
        }
    }

    this.UpdateGKK = function() {
        var id = manageGKKGlobal.selectedGKK;
        var gkkNum = $('#txtGKKNumber').val();
        var churchNum = $('#selGKKChurchNum option:selected').val();
        var committeeNum = $('#selGKKCommitteeNum option:selected').val();
        var patron = $('#txtGKKPatron').val();
        var address = $('#txtGKKAddress').val();
        var unitCount = $('#txtGKKUnitCount').val();
        var zone = $('#txtGKKZone').val();
        var contactNum = $('#txtGKKContactNum').val();
        var name = $('#txtGKKName').val();
        var fiestaDate = manageGKKGlobal.gkkFiestaDate.getMoment().format('YYYY-MM-DD');

        if (fiestaDate.trim() != '' && churchNum != 0 && committeeNum != 0 && patron.trim() != '' &&
            address.trim() != '' && unitCount.trim() != '' && zone.trim() != '' && contactNum.trim() != '' &&
            name.trim() && id != null) {
            if (confirm('Update selected GKK?')) {
                $.ajax({
                    url: "../content/functions/gkk/updategkk.php",
                    type: "POST",
                    dataType: "JSON",
                    data: {
                        id: id,
                        gkkNum: gkkNum,
                        churchNum: churchNum,
                        committeeNum: committeeNum,
                        patron: patron,
                        address: address,
                        fiestaDate: fiestaDate,
                        unitCount: unitCount,
                        zone: zone,
                        contactNum: contactNum,
                        name: name
                    },
                    success: function(data) {
                        if (data.status == 1) {
                            alert('GKK has been updated successfully.');
                            manageGKKGlobal.GetAllGKKs();
                            manageGKKGlobal.ClearFields();
                            manageGKKGlobal.selectedGKK = null;
                        } else {
                            alert('GKK was not updated successfully.');
                        }
                    }
                });
            }
        } else {
            alert('Please fill in all fieds.');
        }
    }

    this.RemoveGKK = function(gkkID) {
        $.ajax({
            url: "../content/functions/gkk/removegkk.php",
            type: "POST",
            dataType: "JSON",
            data: { id: gkkID },
            success: function(data) {
                if (data.status == 1) {
                    alert('GKK has been deleted successfully.');
                    manageGKKGlobal.GetAllGKKs();
                } else {
                    alert('GKK was not deleted successfully.');
                }
            }
        });
    }

    this.ClearFields = function() {
        $('#mdlAddGKK').modal('hide')
        $('#frmAddGKK')[0].reset();
        $('#mdlAddGKK').find('.spn-header').html('Add GKK');
        $('#btnAddGKK').attr('btn-process', 'add');
        $('#btnAddGKK').html('<span class="icon">+</span>Add');
        manageGKKGlobal.selectedGKK = null;
        manageGKKGlobal.gkkFiestaDate.setMoment(moment());
    }
}

function ManageChurch() {
    this.tblChurches = null;
    this.selectedChurch = null;

    this.InitComponents = function() {
        manageChurchGlobal.GetAllChurches();

        $('#btnToggleAddChurchModal').on('click', function() {
            manageChurchGlobal.ClearFields();
        });

        $('#btnAddChurch').unbind('click').click(function() {
            var process = $(this).attr('btn-process')

            if (process == 'add') {
                manageChurchGlobal.AddChurch();
            } else {
                manageChurchGlobal.UpdateChurch();
            }
        });

        $('#tblChurches').on('click', '.edit-church', function() {
            var churchID = $(this).data('church-id');
            manageChurchGlobal.selectedChurch = churchID;
            var churchDetails = manageChurchGlobal.tblChurches.row($(this).closest('tr')).data();

            $('#txtChurchName').val(churchDetails.churchName);
            $('#txtChurchNum').val(churchDetails.churchNum);
            $('#txtChurchCongregation').val(churchDetails.churchCongregation);
            $('#txtChurchZoneCount').val(churchDetails.churchZoneCount);
            $('#txtChurchContactNum').val(churchDetails.churchContactNum);
            $('#txtChurchAddress').val(churchDetails.churchAddress);

            $('#mdlAddChurch').find('.spn-header').html('Update Church Details');
            $('#btnAddChurch').attr('btn-process', 'update');
            $('#btnAddChurch').html('Update');
        });

        $('#tblChurches').on('click', '.remove-church', function() {
            var churchID = $(this).data('church-id');

            if (confirm('Remove selected Church?')) {
                manageChurchGlobal.RemoveChurch(churchID);
            }
        });
    }

    this.GetAllChurches = function() {
        $.ajax({
            url: "../content/functions/church/getallchurches.php",
            type: "POST",
            dataType: "JSON",
            success: function(data) {
                if (data.status == 1) {
                    $('#tblChurches').DataTable().destroy();

                    manageChurchGlobal.tblChurches = $('#tblChurches').DataTable({
                        pageLength: 7,
                        dom: 'frtp',
                        data: data.dataChurches,
                        columns: [{
                                data: 'churchID',
                                width: '25%',
                                render: function(data, type, full, meta) {
                                    return '<span class="church-name">' + full.churchNum + ' - ' + full.churchName + '</span><br/><div class="nav-container mt-2"><a class="edit-church active" data-church-id="' + data + '" href="#" data-toggle="modal" data-target="#mdlAddChurch">Edit</a> | <a class="remove-church active" data-church-id="' + data + '" href="#"> Remove</a></div>';
                                }
                            },
                            {
                                data: 'churchCongregation',
                                width: '15%'
                            },
                            {
                                data: 'churchZoneCount',
                                width: '15%'
                            },
                            {
                                data: 'churchContactNum',
                                width: '10%'
                            },
                            {
                                data: 'churchAddress',
                                width: '35%'
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
                    alert('Churches were not loaded successfully.');
                }
            }
        });
    }

    this.AddChurch = function() {
        var churchNum = $('#txtChurchNum').val();
        var name = $('#txtChurchName').val();
        var address = $('#txtChurchAddress').val();
        var congregation = $('#txtChurchCongregation').val();
        var zoneCount = $('#txtChurchZoneCount').val();
        var contactNum = $('#txtChurchContactNum').val();

        if (name.trim() != '' && address.trim() != '' && congregation.trim() != '' && zoneCount.trim() != '' &&
            contactNum.trim() != '' && churchNum.trim() != '') {
            if (confirm('Add new Church?')) {
                $.ajax({
                    url: "../content/functions/church/addchurch.php",
                    type: "POST",
                    dataType: "JSON",
                    data: {
                        churchNum: churchNum,
                        name: name,
                        address: address,
                        congregation: congregation,
                        zoneCount: zoneCount,
                        contactNum: contactNum
                    },
                    success: function(data) {
                        if (data.status == 1) {
                            alert('Church has been added successfully.');
                            manageChurchGlobal.GetAllChurches();
                            manageChurchGlobal.ClearFields();
                        } else {
                            alert('Church was not added successfully.');
                        }
                    }
                });
            }
        } else {
            alert('Please fill in all fieds.');
        }
    }

    this.UpdateChurch = function() {
        var id = manageChurchGlobal.selectedChurch;
        var churchNum = $('#txtChurchNum').val();
        var name = $('#txtChurchName').val();
        var address = $('#txtChurchAddress').val();
        var congregation = $('#txtChurchCongregation').val();
        var zoneCount = $('#txtChurchZoneCount').val();
        var contactNum = $('#txtChurchContactNum').val();

        if (name.trim() != '' && address.trim() != '' && congregation.trim() != '' && zoneCount.trim() != '' &&
            contactNum.trim() != '' && id != null && churchNum.trim() != '') {
            if (confirm('Update selected Church?')) {
                $.ajax({
                    url: "../content/functions/church/updatechurch.php",
                    type: "POST",
                    dataType: "JSON",
                    data: {
                        id: id,
                        churchNum: churchNum,
                        name: name,
                        address: address,
                        congregation: congregation,
                        zoneCount: zoneCount,
                        contactNum: contactNum
                    },
                    success: function(data) {
                        if (data.status == 1) {
                            alert('Church has been updated successfully.');
                            manageChurchGlobal.GetAllChurches();
                            manageChurchGlobal.ClearFields();
                            manageChurchGlobal.selectedChurch = null;
                        } else {
                            alert('Church was not updated successfully.');
                        }
                    }
                });
            }
        } else {
            alert('Please fill in all fieds.');
        }
    }

    this.RemoveChurch = function(churchID) {
        $.ajax({
            url: "../content/functions/church/removechurch.php",
            type: "POST",
            dataType: "JSON",
            data: { id: churchID },
            success: function(data) {
                if (data.status == 1) {
                    alert('Church has been deleted successfully.');
                    manageChurchGlobal.GetAllChurches();
                } else {
                    alert('Church was not deleted successfully.');
                }
            }
        });
    }

    this.ClearFields = function() {
        $('#mdlAddChurch').modal('hide')

        $('#txtChurchNum').val('');
        $('#txtChurchName').val('');
        $('#txtChurchCongregation').val('');
        $('#txtChurchZoneCount').val('');
        $('#txtChurchContactNum').val('');
        $('#txtChurchAddress').val('');

        $('#mdlAddChurch').find('.spn-header').html('Add Church');
        $('#btnAddChurch').attr('btn-process', 'add');
        $('#btnAddChurch').html('<span class="icon">+</span>Add');
        manageChurchGlobal.selectedChurch = null;
    }
}

function ManageCommittee() {
    this.tblCommittees = null;
    this.selectedCommittee = null;

    this.InitComponents = function() {
        manageCommitteeGlobal.GetAllCommittees();

        $('#btnToggleAddCommitteeModal').on('click', function() {
            manageCommitteeGlobal.ClearFields();
        });

        $('#btnAddCommittee').unbind('click').click(function() {
            var process = $(this).attr('btn-process')

            if (process == 'add') {
                manageCommitteeGlobal.AddCommittee();
            } else {
                manageCommitteeGlobal.UpdateCommittee();
            }
        });

        $('#tblCommittees').on('click', '.edit-committee', function() {
            var committeeID = $(this).data('committee-id');
            manageCommitteeGlobal.selectedCommittee = committeeID;
            var committeeDetails = manageCommitteeGlobal.tblCommittees.row($(this).closest('tr')).data();

            $('#txtCommitteeNum').val(committeeDetails.committeeNum);
            $('#txtCommitteeName').val(committeeDetails.committeeName);
            $('#txtCommitteeHead').val(committeeDetails.committeeHead);
            $('#txtCommitteeContactNum').val(committeeDetails.committeeContactNum);

            $('#mdlAddCommittee').find('.spn-header').html('Update Committee Details');
            $('#btnAddCommittee').attr('btn-process', 'update');
            $('#btnAddCommittee').html('Update');
        });

        $('#tblCommittees').on('click', '.remove-committee', function() {
            var committeeID = $(this).data('committee-id');

            if (confirm('Remove selected Committee?')) {
                manageCommitteeGlobal.RemoveCommittee(committeeID);
            }
        });
    }

    this.GetAllCommittees = function() {
        $.ajax({
            url: "../content/functions/committee/getallcommittees.php",
            type: "POST",
            dataType: "JSON",
            success: function(data) {
                if (data.status == 1) {
                    $('#tblCommittees').DataTable().destroy();

                    manageCommitteeGlobal.tblCommittees = $('#tblCommittees').DataTable({
                        pageLength: 7,
                        dom: 'frtp',
                        data: data.dataCommittees,
                        columns: [{
                                data: 'committeeID',
                                width: '50%',
                                render: function(data, type, full, meta) {
                                    return '<span class="committee-name">' + full.committeeNum + ' - ' + full.committeeName + '</span><br/><div class="nav-container mt-2"><a class="edit-committee active" data-committee-id="' + data + '" href="#" data-toggle="modal" data-target="#mdlAddCommittee">Edit</a> | <a class="remove-committee active" data-committee-id="' + data + '" href="#"> Remove</a></div>';
                                }
                            },
                            {
                                data: 'committeeHead',
                                width: '30%'
                            },
                            {
                                data: 'committeeContactNum',
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
                    alert('Committees were not loaded successfully.');
                }
            }
        });
    }

    this.AddCommittee = function() {
        var committeeNum = $('#txtCommitteeNum').val();
        var name = $('#txtCommitteeName').val();
        var head = $('#txtCommitteeHead').val();
        var contactNum = $('#txtCommitteeContactNum').val();

        if (name.trim() != '' && head.trim() != '' && contactNum.trim() != '' && committeeNum.trim() != '') {
            if (confirm('Add new Committee?')) {
                $.ajax({
                    url: "../content/functions/committee/addcommittee.php",
                    type: "POST",
                    dataType: "JSON",
                    data: {
                        committeeNum: committeeNum,
                        name: name,
                        head: head,
                        contactNum: contactNum
                    },
                    success: function(data) {
                        if (data.status == 1) {
                            alert('Committee has been added successfully.');
                            manageCommitteeGlobal.GetAllCommittees();
                            manageCommitteeGlobal.ClearFields();
                        } else {
                            alert('Committee was not added successfully.');
                        }
                    }
                });
            }
        } else {
            alert('Please fill in all fieds.');
        }
    }

    this.UpdateCommittee = function() {
        var id = manageCommitteeGlobal.selectedCommittee;
        var committeeNum = $('#txtCommitteeNum').val();
        var name = $('#txtCommitteeName').val();
        var head = $('#txtCommitteeHead').val();
        var contactNum = $('#txtCommitteeContactNum').val();

        if (name.trim() != '' && head.trim() != '' && contactNum.trim() != '' && id != null && committeeNum.trim() != '') {
            if (confirm('Update selected Committee?')) {
                $.ajax({
                    url: "../content/functions/committee/updatecommittee.php",
                    type: "POST",
                    dataType: "JSON",
                    data: {
                        id: id,
                        committeeNum: committeeNum,
                        name: name,
                        head: head,
                        contactNum: contactNum
                    },
                    success: function(data) {
                        if (data.status == 1) {
                            alert('Committee has been updated successfully.');
                            manageCommitteeGlobal.GetAllCommittees();
                            manageCommitteeGlobal.ClearFields();
                            manageCommitteeGlobal.selectedCommittee = null;
                        } else {
                            alert('Committee was not updated successfully.');
                        }
                    }
                });
            }
        } else {
            alert('Please fill in all fieds.');
        }
    }

    this.RemoveCommittee = function(committeeID) {
        $.ajax({
            url: "../content/functions/committee/removecommittee.php",
            type: "POST",
            dataType: "JSON",
            data: { id: committeeID },
            success: function(data) {
                if (data.status == 1) {
                    alert('Committee has been deleted successfully.');
                    manageCommitteeGlobal.GetAllCommittees();
                } else {
                    alert('Committee was not deleted successfully.');
                }
            }
        });
    }

    this.ClearFields = function() {
        $('#mdlAddCommittee').modal('hide')

        $('#txtCommitteeNum').val('');
        $('#txtCommitteeName').val('');
        $('#txtCommitteeHead').val('');
        $('#txtCommitteeContactNum').val('');

        $('#mdlAddCommittee').find('.spn-header').html('Add Committee');
        $('#btnAddCommittee').attr('btn-process', 'add');
        $('#btnAddCommittee').html('<span class="icon">+</span>Add');
        manageCommitteeGlobal.selectedCommittee = null;
    }
}